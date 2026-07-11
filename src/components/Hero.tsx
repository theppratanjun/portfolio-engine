"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const session = sessionStorage.getItem("vault_session");
      setIsLoggedIn(session === "active");
    };
    
    checkAuth();
    window.addEventListener("authStateChanged", checkAuth);
    return () => window.removeEventListener("authStateChanged", checkAuth);
  }, []);

  const handleLockedResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("openVaultAuthModal"));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vault_session");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authStateChanged"));
  };

  return (
    <section className="pt-[140px] pb-[70px] relative">
      <div className="font-mono text-[0.74rem] text-[var(--text-dim)] flex gap-[18px] flex-wrap mb-[30px]">
        <span><b className="text-[var(--good)] font-medium">●</b> {language === "en" ? "open to work" : "เปิดรับงาน"}</span>
        <span>{language === "en" ? "target" : "เป้าหมาย"}: <span className="text-[var(--accent-2)]">{language === "en" ? "full-stack / backend / gameplay eng" : "วิศวกรซอฟต์แวร์ / แบ็กเอนด์ / เกมเพลย์"}</span></span>
        <span>{language === "en" ? "loc: nonthaburi · remote-ready" : "พื้นที่: นนทบุรี · พร้อมทำงานทางไกล"}</span>
      </div>
      
      <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-[0.6em] before:content-[''] before:w-[18px] before:h-[1px] before:bg-[var(--accent)]">
        {language === "en" ? "computer engineering · product-minded engineer" : "วิศวกรรมคอมพิวเตอร์ · นักพัฒนาที่เข้าใจโปรดักต์"}
      </span>
      
      <h1 className="text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.98] font-bold tracking-[-0.02em] mb-2 mt-4">
        {language === "en" ? "I build " : "ผมสร้าง "}
        <em className="not-italic text-[var(--accent)] relative after:content-['_'] after:text-[var(--accent)] after:animate-[blink_1.1s_steps(1)_infinite]">
          {language === "en" ? "systems" : "ระบบ"}
        </em>
        {language === "en" ? " that ship" : " ที่ใช้งานได้จริง"}
        <span className="block text-[var(--text-faint)] text-[clamp(1rem,2.4vw,1.5rem)] font-medium font-mono tracking-[0.04em] mt-[18px]">
          — {language === "en" ? "real-time platforms, products at scale, and games" : "แพลตฟอร์มเรียลไทม์, โปรดักต์สเกลใหญ่, และเกม"}
        </span>
      </h1>
      
      <p className="max-w-[560px] text-[var(--text-dim)] text-[1.08rem] my-[28px] mb-[36px] leading-relaxed">
        {language === "en" ? (
          <>I&apos;m <strong className="text-[var(--text)] font-semibold">Theppratan Junpanya</strong>, a computer-engineering graduate who builds <strong className="text-[var(--text)] font-semibold">full-stack systems that handle real users at scale</strong> — typed APIs, databases, real-time pipelines, the deploy stack. I think about <strong className="text-[var(--text)] font-semibold">the product, not just the code</strong>, and I ship games in <strong className="text-[var(--text)] font-semibold">Unity / C#</strong> on the side. Everything below is live. Some of it you can play right now.</>
        ) : (
          <>ผมคือ <strong className="text-[var(--text)] font-semibold">เทพประทาน จันทร์ปัญญา</strong> บัณฑิตวิศวกรรมคอมพิวเตอร์ผู้สร้าง <strong className="text-[var(--text)] font-semibold">ระบบ Full-Stack ที่รองรับผู้ใช้งานจริงระดับสเกล</strong> — ทั้ง API, ฐานข้อมูล, และระบบเรียลไทม์ ผมคำนึงถึง <strong className="text-[var(--text)] font-semibold">ตัวโปรดักต์ ไม่ใช่แค่การเขียนโค้ด</strong> และผมยังพัฒนาเกมด้วย <strong className="text-[var(--text)] font-semibold">Unity / C#</strong> อีกด้วย ผลงานด้านล่างนี้รันอยู่บนระบบจริง และคุณสามารถทดลองเล่นได้ทันที</>
        )}
      </p>
      
      <div className="flex gap-[14px] flex-wrap items-center">
        <a className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[13px] px-[22px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-transparent bg-[var(--accent)] text-white hover:-translate-y-[2px] hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)]" href="#play">
          ▶ {language === "en" ? "Play a demo" : "ลองเล่นเดโม่"}
        </a>
        <a className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[13px] px-[22px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-[var(--edge)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]" href="#work">
          {language === "en" ? "Browse work" : "ดูผลงาน"}
        </a>

        <div className="flex items-center gap-3 ml-2">
          {isLoggedIn ? (
            <>
              {/* 📌 เปลี่ยน href กลับไปหา API ด่านตรวจของเรา แต่ยังคง target="_blank" เพื่อเปิดแท็บใหม่ */}
              <a 
                href="/api/files/resume" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[12px] px-[20px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-[var(--good)] bg-[rgba(61,220,132,0.1)] text-[var(--good)] hover:bg-[var(--good)] hover:text-[#04201b]"
              >
                ↗ resume.pdf
              </a>
              <button 
                onClick={handleLogout}
                className="font-mono text-[0.65rem] text-[var(--text-faint)] hover:text-[var(--danger)] transition-colors border border-transparent hover:border-[var(--danger)] px-2 py-1 rounded"
              >
                [ {language === "en" ? "LOGOUT" : "ออกจากระบบ"} ]
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleLockedResumeClick}
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[12px] px-[20px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-[var(--edge)] bg-transparent text-[var(--text-faint)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                🔒 resume.pdf
              </button>
              <span className="font-mono text-[0.6rem] text-[var(--accent-3)] border border-[var(--accent-3)] bg-[rgba(255,210,63,0.1)] px-2 py-[2px] rounded-[3px] pointer-events-none select-none">
                {language === "en" ? "LOGIN REQUIRED" : "ต้องเข้าสู่ระบบ"}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* ===================== INSPECTOR BOX ===================== */}
      <div className="mt-[64px] border border-[var(--edge)] rounded-md bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2))] overflow-hidden">
        <div className="flex items-center gap-[8px] py-[10px] px-[14px] border-b border-[var(--edge)] font-mono text-[0.72rem] text-[var(--text-dim)]">
          <span className="flex gap-[6px]">
            <i className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] block"></i>
            <i className="w-[11px] h-[11px] rounded-full bg-[#febc2e] block"></i>
            <i className="w-[11px] h-[11px] rounded-full bg-[#28c840] block"></i>
          </span>
          <span>inspector — entity: &quot;Candidate_Profile&quot;</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[var(--edge)]">
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Core stack</div>
            <div className="text-[1.15rem] font-bold mt-[4px]">TS · Node <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">+ Go</small></div>
          </div>
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Also ships</div>
            <div className="text-[1.15rem] font-bold mt-[4px]">Unity <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">C#</small></div>
          </div>
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Edge</div>
            <div className="text-[1.15rem] font-bold mt-[4px]">Product <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">+ scale</small></div>
          </div>
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Status</div>
            <div className="text-[1.15rem] font-bold mt-[4px] text-[var(--good)]">READY <small className="text-[0.8rem] font-medium font-mono">to ship</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}