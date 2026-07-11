"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type DuckState = "fly" | "shot" | "fall";
type Duck = { 
  id: number; x: number; y: number; w: number; h: number; 
  vx: number; vy: number; state: DuckState; timer: number;
};
type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: string };

export default function Play() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(60);
  const { language } = useLanguage();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = cv.width;
    const H = cv.height;

    const css = getComputedStyle(document.documentElement);
    const ACC = () => css.getPropertyValue("--accent").trim() || "#ff2e88";
    const CY = () => css.getPropertyValue("--accent-2").trim() || "#21e6c1";

    const GAME = {
      ducks: [] as Duck[],
      particles: [] as Particle[],
      score: 0,
      wave: 1,
      ammo: 3, // กระสุนสูงสุด 3 นัด
      maxAmmo: 3,
      isReloading: false,
      konamiActive: false, // 📌 โหมดกระสุนอินฟินิตี้
      paused: false,
      running: true,
      duckIdCounter: 0,
    };

    let pointerX = W / 2;
    let pointerY = H / 2;
    let isMouseDown = false;

    // 📌 ระบบสปอว์นเป้าหมาย (เป็ด)
    function spawnDuck() {
      const isLeft = Math.random() > 0.5;
      GAME.ducks.push({
        id: GAME.duckIdCounter++,
        x: isLeft ? -50 : W + 50,
        y: H - 150 - Math.random() * 300, // บินขึ้นมาจากขอบล่าง
        w: 60, h: 60,
        vx: (isLeft ? 1 : -1) * (3 + Math.random() * 2 + GAME.wave * 0.5), // ความเร็วเพิ่มตามเวฟ
        vy: -2 - Math.random() * 3, // ความเร็วแนวตั้ง
        state: "fly",
        timer: 0,
      });
    }

    // 📌 เอฟเฟกต์เลือด/ขนนก
    function burst(x: number, y: number, c: string) {
      for (let i = 0; i < 15; i++) {
        GAME.particles.push({
          x, y, 
          vx: (Math.random() - 0.5) * 8, 
          vy: (Math.random() - 0.5) * 8 - 2, 
          life: 1, c,
        });
      }
    }

    // 📌 ระบบยิงปืน
    function shoot() {
      if (GAME.ammo <= 0 && !GAME.konamiActive) {
        // แชะๆ กระสุนหมด
        return;
      }

      if (!GAME.konamiActive) GAME.ammo--;
      
      // เอฟเฟกต์ยิงปืน (สั่นหน้าจอนิดหน่อย)
      ctx!.translate((Math.random()-0.5)*10, (Math.random()-0.5)*10);
      setTimeout(() => ctx!.setTransform(1, 0, 0, 1, 0, 0), 50);

      let hit = false;
      
      // เช็ค Hitbox (วงกลมชนกับสี่เหลี่ยม)
      GAME.ducks.forEach(d => {
        if (d.state === "fly") {
          // คำนวณระยะห่างระหว่างเป้าเล็งกับจุดศูนย์กลางเป็ด
          const dx = pointerX - d.x;
          const dy = pointerY - d.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < d.w / 1.2) { // รัศมี Hitbox
            d.state = "shot";
            d.timer = 20; // ค้างกลางอากาศ 20 เฟรม (อารมณ์ตกใจ)
            hit = true;
            GAME.score += 150;
            burst(d.x, d.y, ACC());
          }
        }
      });

      // ถ้ายิงไม่โดนเลย และไม่ใช่กระสุนอินฟินิตี้ อาจจะลดคะแนน หรือไม่มีอะไรเกิดขึ้น
      if (!hit) {
        GAME.score = Math.max(0, GAME.score - 10); // พลาดโดนหักคะแนน 10 แต้ม
      }
    }

    function reload() {
      if (GAME.ammo < GAME.maxAmmo && !GAME.isReloading) {
        GAME.isReloading = true;
        // หน่วงเวลาโหลดกระสุน 0.5 วินาที
        setTimeout(() => {
          GAME.ammo = GAME.maxAmmo;
          GAME.isReloading = false;
        }, 500);
      }
    }

    // --- Input Events ---
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "p") GAME.paused = !GAME.paused;
      if (key === "r") reload();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      // คำนวณ Scale สัดส่วนภาพ
      const scaleX = cv.width / r.width;
      const scaleY = cv.height / r.height;
      pointerX = (e.clientX - r.left) * scaleX;
      pointerY = (e.clientY - r.top) * scaleY;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (GAME.paused) return;
      
      if (e.button === 0) { // คลิกซ้าย = ยิง
        isMouseDown = true;
        shoot();
      } else if (e.button === 2) { // คลิกขวา = โหลดกระสุน
        reload();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.button === 0) isMouseDown = false;
    };

    // 📌 ปิดเมนูคลิกขวาของเบราว์เซอร์ เพื่อให้ใช้คลิกขวาในเกมได้
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    cv.addEventListener("pointermove", handlePointerMove);
    cv.addEventListener("pointerdown", handlePointerDown);
    cv.addEventListener("pointerup", handlePointerUp);
    cv.addEventListener("contextmenu", handleContextMenu);

    // 📌 รับบัฟ Konami
    const handleKonamiEvent = () => {
      GAME.konamiActive = true;
    };
    window.addEventListener("konamiActivated", handleKonamiEvent);

    let last = performance.now();
    let acc = 0;
    let fpsT = 0;
    const STEP = 1000 / 60;
    let animationFrameId: number;
    let frameCount = 0;

    // --- Core Logic ---
    function update() {
      if (GAME.paused) return;
      frameCount++;

      // ออโต้สปอว์นเป็ด
      if (Math.random() < 0.015 + (GAME.wave * 0.002)) {
        if (GAME.ducks.filter(d => d.state === "fly").length < 3 + GAME.wave) {
          spawnDuck();
        }
      }

      // โหมดปืนกล (กดยิงค้างได้ถ้ารับบัฟ Konami)
      if (GAME.konamiActive && isMouseDown && frameCount % 6 === 0) {
        shoot();
      }

      // Logic ของเป้าหมายแต่ละตัว (State Machine)
      GAME.ducks.forEach((d) => {
        if (d.state === "fly") {
          d.x += d.vx;
          d.y += d.vy;
          // โค้งลงตามแรงโน้มถ่วงนิดๆ
          d.vy += 0.02; 
        } else if (d.state === "shot") {
          d.timer--;
          if (d.timer <= 0) {
            d.state = "fall";
            d.vy = 0; // เคลียร์แรงเหวี่ยง
          }
        } else if (d.state === "fall") {
          d.y += d.vy;
          d.vy += 0.5; // ร่วงเร็วขึ้น
        }
      });

      // ลบตัวที่ตกขอบจอ
      GAME.ducks = GAME.ducks.filter(d => d.y < H + 100 && d.x > -100 && d.x < W + 100);

      // อัปเดตเลเวลเวฟ (ตามคะแนน)
      GAME.wave = Math.floor(GAME.score / 1500) + 1;

      // อัปเดต Particle
      GAME.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.03;
      });
      GAME.particles = GAME.particles.filter((pt) => pt.life > 0);

      const scoreEl = document.getElementById("score-readout");
      if (scoreEl) {
        scoreEl.textContent = `HR SCORE: ${GAME.score} · WAVE ${GAME.wave} · AMMO: ${GAME.konamiActive ? "∞" : GAME.ammo}/${GAME.maxAmmo}`;
      }
    }

    // --- Rendering ---
    function render() {
      if (!ctx) return;
      // ล้างจอ
      ctx.clearRect(0, 0, W, H);
      
      // พื้นหลังท้องฟ้าสไตล์ Retro (Gradient)
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0c1424");
      grad.addColorStop(1, "#1a2a40");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // วาด Particles
      GAME.particles.forEach((pt) => { 
        ctx.globalAlpha = pt.life; 
        ctx.fillStyle = pt.c;
        ctx.fillRect(pt.x, pt.y, 6, 6); 
        ctx.globalAlpha = 1; 
      });
      
      // วาดเป็ด
      GAME.ducks.forEach((d) => {
        ctx.save();
        ctx.translate(d.x, d.y);
        
        // หันหน้าซ้ายขวา
        if (d.vx < 0 && d.state === "fly") ctx.scale(-1, 1);

        /* 
          // TODO: เปลี่ยนเป็นภาพของคุณตรงนี้
          if (d.state === 'fly') ctx.drawImage(myFlyImage, -d.w/2, -d.h/2, d.w, d.h);
          else if (d.state === 'shot') ctx.drawImage(myHitImage, -d.w/2, -d.h/2, d.w, d.h);
          else if (d.state === 'fall') ctx.drawImage(myFallImage, -d.w/2, -d.h/2, d.w, d.h);
        */

        // ตอนนี้ใช้ Emoji แทนไปก่อน
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (d.state === "fly") {
          // ขยับปีกขึ้นลงตามเฟรม
          const flap = Math.sin(frameCount * 0.2) > 0 ? "🦆" : "🦢"; 
          ctx.fillText(flap, 0, 0);
        } else if (d.state === "shot") {
          ctx.fillText("💥", 0, 0);
        } else if (d.state === "fall") {
          ctx.rotate(frameCount * 0.1); // หมุนควงสว่านตอนร่วง
          ctx.fillText("💀", 0, 0);
        }

        ctx.restore();
      });

      // หญ้าด้านล่างจอ
      ctx.fillStyle = "#12261a";
      ctx.fillRect(0, H - 80, W, 80);

      // วาด UI กระสุน (มุมซ้ายล่าง)
      if (!GAME.konamiActive) {
        for (let i = 0; i < GAME.maxAmmo; i++) {
          ctx.fillStyle = i < GAME.ammo ? CY() : "#333";
          ctx.fillRect(20 + i * 15, H - 30, 10, 20);
        }
        if (GAME.isReloading) {
          ctx.fillStyle = ACC();
          ctx.font = "14px JetBrains Mono";
          ctx.textAlign = "left";
          ctx.fillText("RELOADING...", 70, H - 15);
        } else if (GAME.ammo === 0) {
          ctx.fillStyle = "#ff5f57";
          ctx.font = "16px JetBrains Mono";
          ctx.textAlign = "left";
          ctx.fillText("RIGHT CLICK TO RELOAD", 70, H - 15);
        }
      }

      // วาดเป้าเล็ง (Crosshair) ตามตำแหน่งเมาส์
      ctx.beginPath();
      ctx.strokeStyle = GAME.konamiActive ? "#ffd23f" : ACC(); // เป้าทองคำถ้ารับบัฟ
      ctx.lineWidth = 2;
      ctx.arc(pointerX, pointerY, 20, 0, Math.PI * 2);
      ctx.moveTo(pointerX - 30, pointerY);
      ctx.lineTo(pointerX + 30, pointerY);
      ctx.moveTo(pointerX, pointerY - 30);
      ctx.lineTo(pointerX, pointerY + 30);
      ctx.stroke();

      if (GAME.paused) {
        ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff"; ctx.font = "600 38px JetBrains Mono, monospace"; ctx.textAlign = "center";
        ctx.fillText("|| PAUSED", W / 2, H / 2);
        ctx.font = "400 16px JetBrains Mono, monospace"; ctx.fillStyle = "#8b94a3";
        ctx.fillText("press P to resume", W / 2, H / 2 + 34);
      }
    }

    function loop(now: number) {
      if (!GAME.running) return;
      animationFrameId = requestAnimationFrame(loop);
      const dt = now - last;
      last = now;
      acc += dt;
      fpsT += dt;

      if (fpsT > 500) {
        setFps(Math.round(1000 / (dt || 16)));
        fpsT = 0;
      }

      while (acc >= STEP) {
        update();
        acc -= STEP;
      }
      render();
    }

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      GAME.running = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      cv.removeEventListener("pointermove", handlePointerMove);
      cv.removeEventListener("pointerdown", handlePointerDown);
      cv.removeEventListener("pointerup", handlePointerUp);
      cv.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("konamiActivated", handleKonamiEvent);
    };
  }, []);

  return (
    <section id="play" className="py-20 relative scroll-mt-10">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
          {language === "en" ? "runtime · interactive" : "รันไทม์ · อินเทอร์แอกทีฟ"}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-3 leading-[1.05]">
          {language === "en" ? "Play it. The code is the résumé." : "ทดลองเล่น โค้ดนี้คือเรซูเม่ของผม"}
        </h2>
        <p className="text-[var(--text-dim)] text-[1rem]">
          {language === "en"
            ? <>A live mini-game running in a canvas viewport. This demonstrates raw JavaScript logic and a simple state machine. The slot below is wired for a real <b>Unity WebGL</b> build when you want the full experience.</>
            : <>มินิเกมที่รันบน Viewport สร้างขึ้นเพื่อสาธิตการเขียน Logic และ State Machine แบบดิบๆ ด้วย JavaScript และเตรียม Slot ด้านล่างไว้สำหรับฝัง <b>Unity WebGL</b> เมื่อคุณต้องการประสบการณ์เต็มรูปแบบ</>
          }
        </p>
      </div>

      <div className="border border-[var(--edge)] rounded-md overflow-hidden bg-[var(--bg-panel)] shadow-xl">
        <div className="flex gap-[2px] px-2 bg-[var(--bg-panel-2)] border-b border-[var(--edge)] font-mono text-xs select-none">
          <span className="py-3 px-4 text-[var(--text)] border-b-2 border-[var(--accent)]">Game</span>
          <span className="py-3 px-4 text-[var(--text-dim)] border-b-2 border-transparent">Scene</span>
          <span className="py-3 px-4 text-[var(--text-dim)] border-b-2 border-transparent">Profiler</span>
          <span className="flex-1"></span>
          <span className="py-3 px-2 text-[var(--good)]">{fps} fps</span>
        </div>
        
        {/* 📌 ซ่อน Cursor ของ Windows เพื่อใช้เป้าเล็งใน Canvas แทน */}
        <canvas ref={canvasRef} width={1280} height={720} className="block w-full h-auto aspect-video bg-[#0c1424] cursor-none touch-none"></canvas>

        <div className="flex items-center justify-between gap-3 flex-wrap py-3 px-4 bg-[var(--bg-panel-2)] border-t border-[var(--edge)] font-mono text-xs text-[var(--text-dim)] select-none">
          <span>
            Aim <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] ml-2 mr-[2px]">Mouse</kbd> 
            · Shoot <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">Left Click</kbd> 
            · Reload <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">Right Click / R</kbd> 
            · Pause <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">P</kbd>
          </span>
          <span id="score-readout" className="font-bold text-[var(--accent)]">HR SCORE: 0 · WAVE 1 · AMMO: 3/3</span>
        </div>
      </div>

      <div className="mt-5 p-4 md:p-5 border border-dashed border-[var(--edge)] rounded-md font-mono text-sm text-[var(--text-dim)] bg-[var(--bg-panel)] leading-relaxed">
        {language === "en"
          ? <><b className="text-[var(--accent-2)]">{"// UNITY_WEBGL_SLOT"}</b> — Replace the canvas above with your real Unity build. Drop your <code>Build/</code> folder exported from Unity 2022.3 LTS into <code>/public/unity/</code>, export with <b>Brotli</b> compression, and mount with <code>react-unity-webgl</code>.</>
          : <><b className="text-[var(--accent-2)]">{"// UNITY_WEBGL_SLOT"}</b> — เปลี่ยน Canvas ด้านบนให้เป็นโปรเจกต์ Unity ของจริงของคุณ นำโฟลเดอร์ <code>Build/</code> ที่ Export จาก Unity 2022.3 LTS มาวางใน <code>/public/unity/</code> (ใช้การบีบอัด <b>Brotli</b>) แล้วโหลดผ่าน <code>react-unity-webgl</code></>
        }
      </div>
    </section>
  );
}