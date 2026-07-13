"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState("");

  const textToType = language === "en"
    ? "Theppratan Junpanya — Computer Engineering & Business Administration Graduate"
    : "เทพประทาน จันทร์ปัญญา — บัณฑิตวิศวกรรมคอมพิวเตอร์ และ บริหารธุรกิจบัณฑิต";

  useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), 100);
    
    const checkAuth = () => {
      const session = sessionStorage.getItem("vault_session");
      setIsLoggedIn(session === "active");
    };
    
    checkAuth();
    window.addEventListener("authStateChanged", checkAuth);
    
    return () => {
      clearTimeout(mountTimer);
      window.removeEventListener("authStateChanged", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let i = 0;
    let typingInterval: NodeJS.Timeout;

    const resetTimer = setTimeout(() => {
      setTypedText(""); 
      
      typingInterval = setInterval(() => {
        if (i < textToType.length) {
          setTypedText(textToType.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 45); 
    }, 10);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(typingInterval);
    };
  }, [textToType, mounted]);

  const handleLockedResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("openVaultAuthModal"));
  };

  // 📌 แก้ไขตรงนี้: ให้ส่งสัญญาณ Master Logout ไปให้ Vault.tsx จัดการเคลียร์ทั้งระบบ
  const handleLogout = () => {
    window.dispatchEvent(new Event("triggerVaultLogout"));
  };

  return (
    <section className="pt-[140px] pb-[70px] relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sharp-blink {
          0%, 49% { opacity: 1; }
          50%, 99% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-sharp-blink {
          animation: sharp-blink 1.1s infinite;
        }
        @keyframes text-glow-pulse {
          0%, 100% { opacity: 1; text-shadow: 0 0 12px currentColor; }
          50% { opacity: 0.5; text-shadow: 0 0 3px currentColor; }
        }
        .animate-glow-pulse {
          animation: text-glow-pulse 2s ease-in-out infinite;
        }
      `}} />

      {/* 📌 เปลี่ยน transition-all เป็น transition ปกติ เพื่อไม่ให้ขนาดฟอนต์ถูก animate */}
      <div 
        className={`font-mono text-[0.74rem] text-[var(--text-dim)] flex gap-[18px] flex-wrap mb-[30px] transition duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <span><b className="text-[var(--good)] font-medium animate-glow-pulse">●</b> {language === "en" ? "open to work" : "เปิดรับงาน"}</span>
        <span>{language === "en" ? "target" : "เป้าหมาย"}: <span className="text-[var(--accent-2)] animate-glow-pulse">{language === "en" ? "full-stack / system core / gameplay developer" : "วิศวกรซอฟต์แวร์ / สร้างระบบ / พัฒนาเกม"}</span></span>
        <span>{language === "en" ? "loc: nonthaburi · remote-ready" : "พื้นที่: นนทบุรี · พร้อมทำงานทางไกล"}</span>
      </div>
      
      <span 
        className={`font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-[0.6em] before:content-[''] before:w-[18px] before:h-[1px] before:bg-[var(--accent)] transition duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '100ms' }}
      >
        {language === "en" ? "double degree · product-minded engineer" : "วิศวกรรมคอมพิวเตอร์ · บริหารธุรกิจบัณฑิต"}
      </span>
      
      <h1 
        className={`font-bold tracking-[-0.02em] mb-2 mt-4 transition duration-1000 ${
          language === "en" 
            ? "text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.98]" 
            : "text-[clamp(2rem,5vw,4rem)] leading-[1.1]" 
        } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '200ms' }}
      >
        {language === "en" ? "I build " : "ผมสร้าง "}
        <em className="not-italic text-[var(--accent)]">
          {language === "en" ? "systems" : "ระบบ"}
          <span className="animate-sharp-blink">_</span>
        </em>
        {language === "en" ? " that ship" : " ที่ใช้งานได้จริง"}
        
        <span className={`block text-[var(--text-faint)] font-medium font-mono tracking-[0.04em] mt-[18px] ${
          language === "en" ? "text-[clamp(1rem,2.4vw,1.5rem)]" : "text-[clamp(0.9rem,1.8vw,1.25rem)]"
        }`}>
          — {language === "en" ? "real-time platforms, products at scale, and games" : "ข้อมูลเวลาจริง, ผลิตภัณฑ์ที่รองรับผู้ใช้งานจำนวนมหาศาล, และเกม"}
        </span>
      </h1>
      
      <div 
        className={`mt-7 mb-3 font-mono text-[0.85rem] md:text-[0.95rem] min-h-[24px] flex items-center flex-wrap transition duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '300ms' }}
      >
        <span className="text-[var(--accent-2)] mr-2 font-bold">{">"}</span>
        <span className="font-semibold text-[var(--text)]">{typedText}</span>
        <span className="inline-block w-[8px] h-[1.2em] ml-1.5 bg-[var(--accent-2)] opacity-80 animate-sharp-blink"></span>
      </div>

      <p 
        className={`max-w-[560px] text-[var(--text-dim)] text-[1.08rem] mb-[36px] leading-relaxed transition duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '400ms' }}
      >
        {language === "en" ? (
          <>I build <strong className="text-[var(--text)] font-semibold">full-stack systems that handle real users at scale</strong> — typed APIs, databases, real-time pipelines, the deploy stack. I think about <strong className="text-[var(--text)] font-semibold">the product, not just the code</strong>, and I ship games in <strong className="text-[var(--text)] font-semibold">Unity / C#</strong> on the side. Everything below is live. Some of it you can play right now.</>
        ) : (
          <>ผมคือผู้พัฒนา <strong className="text-[var(--text)] font-semibold">ระบบ Full-Stack ที่รองรับผู้ใช้งานจริงระดับสากล</strong> — ทั้ง API, ฐานข้อมูล, และระบบเรียลไทม์ ผมคำนึงถึง <strong className="text-[var(--text)] font-semibold">ตัวผลิตภัณฑ์ ไม่ใช่แค่การเขียนโค้ด</strong> และผมยังพัฒนาเกมด้วย <strong className="text-[var(--text)] font-semibold">Unity / C#</strong> อีกด้วย ผลงานด้านล่างนี้รันอยู่บนระบบจริง และคุณสามารถทดลองเล่นได้ทันที</>
        )}
      </p>
      
      <div 
        className={`flex gap-[14px] flex-wrap items-center transition duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '500ms' }}
      >
        <a className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[13px] px-[22px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-transparent bg-[var(--accent)] text-white hover:-translate-y-[2px] hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)]" href="#play">
          ▶ {language === "en" ? "Play Now" : "ลองเล่นเลย"}
        </a>
        <a className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[13px] px-[22px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-[var(--edge)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]" href="#work">
          {language === "en" ? "Browse work" : "ดูผลงาน"}
        </a>

        <div className="flex items-center gap-2 ml-2">
          {isLoggedIn ? (
            <>
              <a 
                href="/api/files/resume" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-[12px] px-[20px] rounded-[var(--radius)] cursor-pointer transition-all duration-200 inline-flex items-center gap-[0.6em] border border-[var(--good)] bg-[rgba(61,220,132,0.1)] text-[var(--good)] hover:bg-[var(--good)] hover:text-[#04201b]"
              >
                ↗ resume.pdf
              </a>
              <button 
                onClick={() => window.dispatchEvent(new Event("openAccountSettings"))}
                className="font-mono text-[0.65rem] text-[var(--text-faint)] hover:text-[var(--text)] transition-colors border border-transparent hover:border-[var(--edge)] px-2 py-1 rounded"
              >
                [ {language === "en" ? "SETTINGS" : "ตั้งค่า"} ]
              </button>
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
              <span className="font-mono text-[0.6rem] text-[var(--accent-3)] border border-[var(--accent-3)] bg-[rgba(255,210,63,0.1)] px-2 py-[2px] rounded-[3px] pointer-events-none select-none hidden sm:inline-block">
                {language === "en" ? "LOGIN REQUIRED" : "ต้องเข้าสู่ระบบ"}
              </span>
            </>
          )}
        </div>
      </div>
      
      <div 
        className={`mt-[64px] border border-[var(--edge)] rounded-md bg-[linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2))] overflow-hidden transition duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '600ms' }}
      >
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
            <div className="text-[1.15rem] font-bold mt-[4px] text-[var(--good)] animate-glow-pulse">READY <small className="text-[0.8rem] font-medium font-mono">to ship</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}