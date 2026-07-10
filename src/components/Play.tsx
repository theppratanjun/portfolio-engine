"use client";

import { useEffect, useRef, useState } from "react";

export default function Play() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = cv.width;
    const H = cv.height;

    // ดึงสีจาก Design Tokens
    const css = getComputedStyle(document.documentElement);
    const ACC = () => css.getPropertyValue("--accent").trim() || "#ff2e88";
    const CY = () => css.getPropertyValue("--accent-2").trim() || "#21e6c1";

    const GAME = {
      player: { x: W / 2, y: H - 70, w: 46, h: 18, speed: 6.2, cool: 0 },
      bullets: [] as any[],
      enemies: [] as any[],
      particles: [] as any[],
      keys: {} as Record<string, boolean>,
      score: 0,
      wave: 1,
      lives: 3,
      paused: false,
      running: true,
    };

    function spawnWave() {
      const n = 4 + GAME.wave * 2;
      for (let i = 0; i < n; i++) {
        GAME.enemies.push({
          x: 80 + Math.random() * (W - 160),
          y: -40 - Math.random() * 240,
          w: 34,
          h: 30,
          vy: 0.7 + Math.random() * 0.6 + GAME.wave * 0.12,
          vx: (Math.random() - 0.5) * 1.4,
          hp: 1,
        });
      }
    }
    spawnWave();

    function rect(x: number, y: number, w: number, h: number, c: string) {
      if (!ctx) return;
      ctx.fillStyle = c;
      ctx.fillRect(x - w / 2, y - h / 2, w, h);
    }

    function burst(x: number, y: number, c: string) {
      for (let i = 0; i < 10; i++) {
        GAME.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          c,
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        // ป้องกันหน้าจอเลื่อนตอนกดเล่นเกม (ถ้าเมาส์อยู่ในบริเวณเกม)
        if (cv.matches(":hover")) e.preventDefault(); 
      }
      GAME.keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === "p") GAME.paused = !GAME.paused;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      GAME.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function shoot() {
      if (GAME.player.cool <= 0) {
        GAME.bullets.push({ x: GAME.player.x, y: GAME.player.y - 14, vy: -11 });
        GAME.player.cool = 9;
      }
    }

    let last = performance.now();
    let acc = 0;
    let fpsT = 0;
    const STEP = 1000 / 60;
    let animationFrameId: number;

    function update() {
      if (GAME.paused) return;
      const p = GAME.player;

      if (GAME.keys["arrowleft"] || GAME.keys["a"]) p.x -= p.speed;
      if (GAME.keys["arrowright"] || GAME.keys["d"]) p.x += p.speed;
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

      // ระบบชน (Collisions)
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

      if (GAME.enemies.length === 0) {
        GAME.wave++;
        spawnWave();
      }

      GAME.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;
      });
      GAME.particles = GAME.particles.filter((pt) => pt.life > 0);

      // อัปเดต UI ข้อความนอก Canvas
      const scoreEl = document.getElementById("score-readout");
      if (scoreEl) {
        scoreEl.textContent = `SCORE ${GAME.score} · WAVE ${GAME.wave} · LIVES ${GAME.lives}`;
      }
    }

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      
      // วาด Grid พื้นหลัง
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 48) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // วาด Particles
      GAME.particles.forEach((pt) => {
        ctx.globalAlpha = pt.life;
        rect(pt.x, pt.y, 5, 5, pt.c);
        ctx.globalAlpha = 1;
      });

      // วาดกระสุน
      GAME.bullets.forEach((b) => rect(b.x, b.y, 4, 14, CY()));

      // วาดศัตรู
      GAME.enemies.forEach((en) => {
        rect(en.x, en.y, en.w, en.h, "#5a626f");
        rect(en.x, en.y - 2, en.w * 0.5, en.h * 0.4, ACC());
      });

      // วาดผู้เล่น (สามเหลี่ยม)
      const p = GAME.player;
      ctx.fillStyle = ACC();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.h);
      ctx.lineTo(p.x - p.w / 2, p.y + p.h);
      ctx.lineTo(p.x + p.w / 2, p.y + p.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = CY();
      rect(p.x, p.y + 4, 8, 8, CY());

      // วาดตอนหยุดเกม หรือ Game Over
      if (GAME.paused) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "600 38px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText("|| PAUSED", W / 2, H / 2);
        ctx.font = "400 16px JetBrains Mono, monospace";
        ctx.fillStyle = "#8b94a3";
        ctx.fillText("press P to resume", W / 2, H / 2 + 34);
      }
      
      if (GAME.lives <= 0) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = ACC();
        ctx.font = "700 44px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 10);
        ctx.fillStyle = "#e6e9ef";
        ctx.font = "400 16px JetBrains Mono, monospace";
        ctx.fillText(`score ${GAME.score} — click to restart`, W / 2, H / 2 + 28);
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

    const handleClick = () => {
      if (GAME.lives <= 0) {
        GAME.lives = 3;
        GAME.score = 0;
        GAME.wave = 1;
        GAME.enemies = [];
        GAME.bullets = [];
        spawnWave();
      }
    };
    cv.addEventListener("click", handleClick);

    animationFrameId = requestAnimationFrame(loop);

    // Cleanup ตอน Component ถูกถอดออก (สำคัญมากสำหรับ React)
    return () => {
      GAME.running = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cv.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section id="play" className="py-[84px] relative scroll-mt-10">
      <div className="mb-[48px] max-w-[640px]">
        <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-[0.6em] before:content-[''] before:w-[18px] before:h-[1px] before:bg-[var(--accent)]">
          runtime · interactive
        </span>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight mt-[14px] mb-[12px] leading-[1.05]">
          Play it. The code is the résumé.
        </h2>
        <p className="text-[var(--text-dim)] text-[1rem]">
          A live mini-game running in a canvas viewport styled like an engine editor. This is built with native JS to load instantly, but the slot below is wired for a real <b>Unity WebGL</b> build when you want the full experience.
        </p>
      </div>

      {/* Viewport Shell */}
      <div className="border border-[var(--edge)] rounded-md overflow-hidden bg-[var(--bg-panel)] shadow-xl">
        {/* Viewport Tabs */}
        <div className="flex gap-[2px] px-[8px] bg-[var(--bg-panel-2)] border-b border-[var(--edge)] font-mono text-[0.74rem]">
          <span className="py-[11px] px-[16px] text-[var(--text)] border-b-2 border-[var(--accent)] cursor-default">Game</span>
          <span className="py-[11px] px-[16px] text-[var(--text-dim)] border-b-2 border-transparent cursor-default">Scene</span>
          <span className="py-[11px] px-[16px] text-[var(--text-dim)] border-b-2 border-transparent cursor-default">Profiler</span>
          <span className="flex-1"></span>
          <span className="py-[11px] px-[4px] text-[var(--good)]">{fps} fps</span>
        </div>
        
        {/* Canvas Game */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="block w-full h-auto aspect-video bg-[#070809] cursor-crosshair touch-none"
        ></canvas>

        {/* Viewport Footer */}
        <div className="flex items-center justify-between gap-[12px] flex-wrap py-[12px] px-[16px] bg-[var(--bg-panel-2)] border-t border-[var(--edge)] font-mono text-[0.74rem] text-[var(--text-dim)]">
          <span>
            Move <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">A</kbd>
            <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">D</kbd> 
            · Shoot <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">Space</kbd> 
            · Pause <kbd className="bg-[var(--bg)] border border-[var(--edge)] border-b-2 rounded-[3px] py-[1px] px-[7px] text-[var(--text)] mx-[2px]">P</kbd>
          </span>
          <span id="score-readout">SCORE 0 · WAVE 1 · LIVES 3</span>
        </div>
      </div>

      {/* Unity Integration Note */}
      <div className="mt-[18px] p-[16px] md:p-[18px] border border-dashed border-[var(--edge)] rounded-[var(--radius)] font-mono text-[0.8rem] text-[var(--text-dim)] bg-[var(--bg-panel)] leading-relaxed">
        <b className="text-[var(--accent-2)]">// UNITY_WEBGL_SLOT</b> — Replace the canvas above with your real Unity build (e.g., your 2.5D Witch RPG or VR Mechanical Assembly). 
        Drop your <code>Build/</code> folder exported from Unity 2022.3 LTS into <code>/public/unity/</code>, export with <b>Brotli</b> compression, 
        and mount with <code>react-unity-webgl</code>.
      </div>
    </section>
  );
}