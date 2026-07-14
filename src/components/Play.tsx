// src/components/Play.tsx
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext"; // 📌 1. Import useTheme เข้ามา

type Bullet = { x: number; y: number; vy: number };
type Enemy = { x: number; y: number; w: number; h: number; vy: number; vx: number; hp: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: string };

type LeaderboardEntry = { id: string; playerName: string; score: number; isMe: boolean };

export default function Play() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(60);
  const { language } = useLanguage();
  const { theme } = useTheme(); // 📌 2. เรียกใช้งาน theme

  const [gameKey, setGameKey] = useState(0); 
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const gameOverRef = useRef(false); 

  const [hasStarted, setHasStarted] = useState(false);
  const startedRef = useRef(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      // 📌 เติม ?t=${Date.now()} เข้าไปที่ URL เพื่อทะลวง Cache เบราว์เซอร์ 100%
      const res = await fetch(`/api/leaderboard?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLeaders(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(sessionStorage.getItem("vault_session") === "active");
      fetchLeaderboard();
    };
    
    const init = setTimeout(() => {
      checkAuth();
    }, 0);

    window.addEventListener("authStateChanged", checkAuth);
    
    // 📌 รับฟังการแจ้งเตือนว่าโปรไฟล์โดนอัปเดต ให้ดึงตารางคะแนนใหม่ทันที!
    window.addEventListener("profileUpdated", fetchLeaderboard);
    
    return () => {
      clearTimeout(init);
      window.removeEventListener("authStateChanged", checkAuth);
      
      // 📌 อย่าลืมทำลายการรับฟังเมื่อคอมโพเนนต์ถูกปิด
      window.removeEventListener("profileUpdated", fetchLeaderboard);
    };
  }, [fetchLeaderboard]);

  useEffect(() => {
    startedRef.current = hasStarted;
  }, [hasStarted]);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const W = cv.width;
    const H = cv.height;

    const css = getComputedStyle(document.documentElement);
    const ACC = () => css.getPropertyValue("--accent").trim() || "#ff2e88";
    const CY = () => css.getPropertyValue("--accent-2").trim() || "#21e6c1";

    const GAME = {
      player: { x: W / 2, y: H - 70, w: 46, h: 18, speed: 6.2, cool: 0 },
      bullets: [] as Bullet[],
      enemies: [] as Enemy[],
      particles: [] as Particle[],
      keys: {} as Record<string, boolean>,
      score: 0,
      wave: 1,
      lives: 3,
      paused: false,
      running: true,
    };

    let pointerX: number | null = null;

    function spawnWave() {
      const n = 4 + GAME.wave * 2;
      for (let i = 0; i < n; i++) {
        GAME.enemies.push({
          x: 80 + Math.random() * (W - 160),
          y: -40 - Math.random() * 240,
          w: 34, h: 30,
          vy: 0.7 + Math.random() * 0.6 + GAME.wave * 0.12,
          vx: (Math.random() - 0.5) * 1.4,
          hp: 1,
        });
      }
    }
    spawnWave();

    function rect(x: number, y: number, w: number, h: number, c: string) {
      ctx!.fillStyle = c;
      ctx!.fillRect(x - w / 2, y - h / 2, w, h);
    }

    function burst(x: number, y: number, c: string) {
      for (let i = 0; i < 10; i++) {
        GAME.particles.push({ x, y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 1, c });
      }
    }

    function shoot() {
      if (GAME.player.cool <= 0) {
        GAME.bullets.push({ x: GAME.player.x, y: GAME.player.y - 14, vy: -11 });
        GAME.player.cool = 9;
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        if (cv.matches(":hover")) e.preventDefault(); 
      }
      GAME.keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === "p") GAME.paused = !GAME.paused;
    };
    const handleKeyUp = (e: KeyboardEvent) => GAME.keys[e.key.toLowerCase()] = false;

    const handlePointerMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointerX = ((e.clientX - r.left) / r.width) * W;
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (gameOverRef.current || !startedRef.current) return;
      const r = cv.getBoundingClientRect();
      pointerX = ((e.clientX - r.left) / r.width) * W;
      shoot();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    cv.addEventListener("pointermove", handlePointerMove);
    cv.addEventListener("pointerdown", handlePointerDown);

    const handleKonamiEvent = () => { GAME.lives += 1; burst(GAME.player.x, GAME.player.y - 30, ACC()); };
    window.addEventListener("konamiActivated", handleKonamiEvent);

    let last = performance.now();
    let acc = 0;
    let fpsT = 0;
    const STEP = 1000 / 60;
    let animationFrameId: number;

    function update() {
      if (GAME.paused || gameOverRef.current || !startedRef.current) return;
      
      const p = GAME.player;

      if (GAME.keys["arrowleft"] || GAME.keys["a"]) p.x -= p.speed;
      if (GAME.keys["arrowright"] || GAME.keys["d"]) p.x += p.speed;
      
      if (pointerX !== null) p.x += (pointerX - p.x) * 0.18;
      p.x = Math.max(p.w / 2, Math.min(W - p.w / 2, p.x));

      if (GAME.keys[" "]) shoot();
      if (p.cool > 0) p.cool--;

      GAME.bullets.forEach((b) => (b.y += b.vy));
      GAME.bullets = GAME.bullets.filter((b) => b.y > -20);

      GAME.enemies.forEach((en) => {
        en.y += en.vy;
        en.x += en.vx;
        if (en.x < 40 || en.x > W - 40) en.vx *= -1;
        if (en.y > H + 40) {
          en.y = -40;
          GAME.lives = Math.max(0, GAME.lives - 1);
        }
      });

      if (GAME.lives <= 0 && !gameOverRef.current) {
        gameOverRef.current = true;
        setFinalScore(GAME.score);
        setIsGameOver(true);
        GAME.running = false;
        
        const scoreEl = document.getElementById("score-readout");
        if (scoreEl) scoreEl.textContent = `HR SCORE ${GAME.score} · WAVE ${GAME.wave} · LIVES 0`;
        return;
      }

      GAME.bullets.forEach((b) => {
        GAME.enemies.forEach((en) => {
          if (Math.abs(b.x - en.x) < en.w / 2 && Math.abs(b.y - en.y) < en.h / 2) {
            en.hp = 0;
            b.y = -999;
            GAME.score += 10;
            burst(en.x, en.y, ACC());
          }
        });
      });
      GAME.enemies = GAME.enemies.filter((en) => en.hp > 0);
      GAME.bullets = GAME.bullets.filter((b) => b.y > -900);

      if (GAME.enemies.length === 0) { GAME.wave++; spawnWave(); }

      GAME.particles.forEach((pt) => { pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.04; });
      GAME.particles = GAME.particles.filter((pt) => pt.life > 0);

      const scoreEl = document.getElementById("score-readout");
      if (scoreEl && !gameOverRef.current) {
        scoreEl.textContent = `HR SCORE ${GAME.score} · WAVE ${GAME.wave} · LIVES ${GAME.lives}`;
      }
    }

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      GAME.particles.forEach((pt) => { ctx.globalAlpha = pt.life; rect(pt.x, pt.y, 5, 5, pt.c); ctx.globalAlpha = 1; });
      GAME.bullets.forEach((b) => rect(b.x, b.y, 4, 14, CY()));
      
      GAME.enemies.forEach((en) => {
        rect(en.x, en.y, en.w, en.h, "#5a626f");
        rect(en.x, en.y - 2, en.w * 0.5, en.h * 0.4, ACC());
      });

      const p = GAME.player;
      ctx.fillStyle = ACC();
      ctx.beginPath(); ctx.moveTo(p.x, p.y - p.h); ctx.lineTo(p.x - p.w / 2, p.y + p.h); ctx.lineTo(p.x + p.w / 2, p.y + p.h); ctx.closePath(); ctx.fill();
      
      ctx.fillStyle = CY();
      rect(p.x, p.y + 4, 8, 8, CY());

      if (GAME.paused && startedRef.current && !gameOverRef.current) {
        ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff"; ctx.font = "600 38px JetBrains Mono, monospace"; ctx.textAlign = "center";
        ctx.fillText("|| PAUSED", W / 2, H / 2);
      }
    }

    function loop(now: number) {
      if (!GAME.running) return;
      animationFrameId = requestAnimationFrame(loop);
      const dt = now - last;
      last = now;
      acc += dt;
      fpsT += dt;

      if (fpsT > 500) { setFps(Math.round(1000 / (dt || 16))); fpsT = 0; }
      while (acc >= STEP) { update(); acc -= STEP; }
      render();
    }

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      GAME.running = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cv.removeEventListener("pointermove", handlePointerMove);
      cv.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("konamiActivated", handleKonamiEvent);
    };
  }, [gameKey]);

  const handleRestart = () => {
    setIsGameOver(false);
    gameOverRef.current = false;
    setHasStarted(true); 
    setGameKey(prev => prev + 1); 
  };

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      localStorage.setItem("pending_score", finalScore.toString());
      localStorage.setItem("pending_player", playerName || "");
      window.dispatchEvent(new Event("openVaultAuthModal"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName || "HR_Guest", score: finalScore })
      });
      if (res.ok) {
        await fetchLeaderboard(); 
        handleRestart(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteScore = async () => {
    if (!confirm(language === "en" ? "Are you sure you want to delete your score?" : "แน่ใจหรือไม่ว่าต้องการลบสถิติของคุณ?")) return;
    try {
      const res = await fetch("/api/leaderboard", { method: "DELETE" });
      if (res.ok) fetchLeaderboard();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="play" className="py-20 relative scroll-mt-10">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
          {language === "en" ? "runtime · interactive" : "ประมวลผลสด · ตอบสนองผู้ใช้"}
        </span>
        
        <h2 className={`font-bold mt-4 mb-3 ${language === "en" ? "text-4xl md:text-5xl tracking-tight leading-[1.05]" : "text-[1.65rem] sm:text-3xl md:text-4xl tracking-normal leading-[1.4]"}`}>
          {language === "en" ? (
            <>The Recruiter&apos;s Lounge <br /> &quot; HR Chill Zone &quot;</>
          ) : (
            <>
              <span className="inline-block">ห้องรับรองสำหรับผู้สรรหาบุคลากร</span> <br /> 
              <span className="inline-block">&quot; โซนผ่อนคลายสำหรับ HR &quot;</span>
            </>
          )}
        </h2>
        
        <p className="text-[var(--text-dim)] text-[1rem] mt-2">
          {language === "en"
            ? <>Let&apos;s play! A fun, relaxing mini-game for HR made with JavaScript. Save your high score on the global HR leaderboard below (requires login to keep the scores fair).</>
            : <>มาลองเล่นกัน! เกมผ่อนคลายเล็กๆเพื่อ HR ที่สร้างด้วย JavaScript สามารถบันทึกคะแนนสูงสุดของคุณบนตารางอันดับ HR ทั่วโลกได้ที่ด้านล่างนี้ (จำเป็นต้องเข้าสู่ระบบเพื่อป้องกันการโกงคะแนน)</>
          }
        </p>
      </div>

      <div className="border border-[var(--edge)] rounded-md overflow-hidden bg-[var(--bg-panel)] shadow-xl relative">
        <div className="flex gap-[2px] px-2 bg-[var(--bg-panel-2)] border-b border-[var(--edge)] font-mono text-xs">
          <span className="py-3 px-4 text-[var(--text)] border-b-2 border-[var(--accent)] cursor-default">🎯 Choose Me 🔫</span>
          <span className="flex-1"></span>
          <span className="py-3 px-2 text-[var(--good)]">{fps} fps</span>
        </div>
        
        <div className="relative">
          <canvas ref={canvasRef} width={1280} height={720} className="block w-full h-auto aspect-video bg-[#070809] cursor-crosshair touch-none"></canvas>
          
          {!hasStarted && !isGameOver && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10 animate-fade-in">
              <h3 className="text-2xl md:text-3xl font-mono font-bold text-[var(--text)] mb-6 tracking-widest text-center shadow-black drop-shadow-md">
                {language === "en" ? "HR CHILL ZONE" : "โซนผ่อนคลาย HR"}
              </h3>
              <button 
                onClick={() => setHasStarted(true)} 
                className="bg-[var(--accent)] text-white font-mono text-[1.1rem] py-3.5 px-8 rounded-[var(--radius)] hover:brightness-110 transition-all flex items-center gap-3 shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_40%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--accent)_60%,transparent)] hover:-translate-y-1"
              >
                ▶ {language === "en" ? "CLICK TO PLAY" : "คลิกเพื่อเริ่มเล่น"}
              </button>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10 animate-fade-in">
              <h3 className="text-5xl font-mono font-bold text-[var(--accent)] mb-2 tracking-widest">GAME OVER</h3>
              <p className="font-mono text-xl text-white mb-6">FINAL SCORE: <span className="text-[var(--good)]">{finalScore}</span></p>
              
              <div className="bg-[var(--bg-panel)] border border-[var(--edge)] p-6 rounded-lg max-w-sm w-full text-center shadow-2xl">
                <p className="text-[0.9rem] text-[var(--text-dim)] mb-4">
                  {language === "en" ? "Would you like to show off your score to other HRs?" : "อยากอวดสถิติให้ HR ท่านอื่นเห็นไหมครับ?"}
                </p>
                
                <form onSubmit={handleSaveScore} className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder={language === "en" ? "Display Name (e.g. HR_Recruiter)" : "นามแฝง (เช่น HR_Google)"}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={15}
                    className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded py-2 px-3 text-center font-mono text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-[var(--accent)] text-white font-mono text-[0.8rem] py-2 rounded hover:brightness-110 transition-all"
                    >
                      {isSubmitting ? "..." : (language === "en" ? "SAVE SCORE" : "บันทึกคะแนน")}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleRestart}
                      className="flex-1 bg-[var(--bg-panel-2)] text-[var(--text)] border border-[var(--edge)] font-mono text-[0.8rem] py-2 rounded hover:border-[var(--text-dim)] transition-all"
                    >
                      {language === "en" ? "RESTART" : "เล่นใหม่"}
                    </button>
                  </div>
                </form>

                {!isLoggedIn && (
                  <p className="font-mono text-[0.65rem] text-[var(--accent-3)] mt-4">
                    * {language === "en" ? "Requires login (Modal will open)" : "ต้องเข้าสู่ระบบก่อน (หน้าต่างจะเด้งขึ้นมา)"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap py-3 px-4 bg-[var(--bg-panel-2)] border-t border-[var(--edge)] font-mono text-xs text-[var(--text-dim)]">
          <span>
            Move <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] ml-2 mr-[2px]">Mouse</kbd> 
            · Shoot <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">Click</kbd>
          </span>
          <span id="score-readout">HR SCORE 0 · WAVE 1 · LIVES 3</span>
        </div>
      </div>

      <div className="mt-8 border border-[var(--edge)] rounded-md overflow-hidden bg-[var(--bg-panel)] shadow-md">
        <div className="bg-[var(--bg-panel-2)] py-3 px-5 border-b border-[var(--edge)] flex justify-between items-center">
          <h3 className="font-mono font-bold text-[0.9rem] text-[var(--text)]">
            🏆 HR GLOBAL LEADERBOARD
          </h3>
          <span className="font-mono text-[0.7rem] text-[var(--text-dim)]">
            {language === "en" ? "Top 10 High Scores" : "10 อันดับสถิติสูงสุด"}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[0.85rem]">
            <thead className="text-[var(--text-faint)] bg-[var(--bg)]">
              <tr>
                <th className="py-3 px-5 font-normal">RANK</th>
                <th className="py-3 px-5 font-normal">NAME</th>
                <th className="py-3 px-5 font-normal">SCORE</th>
                <th className="py-3 px-5 font-normal text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {leaders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--text-dim)] italic">
                    {language === "en" ? "No scores recorded yet. Be the first!" : "ยังไม่มีบันทึกสถิติ มาเป็นคนแรกกันเถอะ!"}
                  </td>
                </tr>
              ) : (
                leaders.map((leader, index) => (
                  <tr key={leader.id} className={`border-t border-[var(--edge)] transition-colors hover:bg-[var(--bg-panel-2)] ${leader.isMe && isLoggedIn ? "bg-[rgba(33,230,193,0.05)]" : ""}`}>
                    <td className="py-3 px-5 text-[var(--text-dim)]">#{index + 1}</td>
                    {/* 📌 3. แก้ไขบรรทัดนี้: เพิ่มเงื่อนไขเปลี่ยนสีตัวหนังสือตามธีม และแปลเป็น "คุณ" */}
                    <td className="py-3 px-5 font-bold text-[var(--text)]">
                      {leader.playerName} {leader.isMe && isLoggedIn && <span className={`text-[0.6rem] bg-[var(--accent-2)] px-1.5 py-0.5 rounded ml-2 ${theme === 'light' ? 'text-white' : 'text-[#04201b]'}`}>{language === "en" ? "YOU" : "คุณ"}</span>}
                    </td>
                    <td className="py-3 px-5 text-[var(--good)]">{leader.score.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right">
                      {leader.isMe && isLoggedIn ? (
                        <button 
                          onClick={handleDeleteScore}
                          className="text-[0.7rem] text-[var(--danger)] hover:underline opacity-80 hover:opacity-100"
                        >
                          [ ✕ {language === "en" ? "Delete" : "ลบ"} ]
                        </button>
                      ) : (
                        <span className="text-[var(--text-faint)]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}