"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const konamiCode = [
      "arrowup", "arrowup", "arrowdown", "arrowdown",
      "arrowleft", "arrowright", "arrowleft", "arrowright",
      "b", "a"
    ];
    let pos = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === konamiCode[pos]) {
        pos++;
        if (pos === konamiCode.length) {
          setShowEasterEgg(true);
          setTimeout(() => setShowEasterEgg(false), 4000);
          pos = 0;
          
          // 📌 ส่งสัญญาณ (Event) ออกไปทั่วทั้งเว็บไซต์ ว่ามีคนกดสูตร Konami สำเร็จแล้ว!
          window.dispatchEvent(new CustomEvent("konamiActivated"));
        }
      } else {
        pos = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <footer className="border-t border-[var(--edge)] pt-10 pb-8 mt-8 bg-[var(--bg)] relative z-10">
      <div className="max-w-[1180px] mx-auto w-full px-6 relative">
        
        <div className="flex flex-col items-center mb-10">
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[var(--text-faint)] mb-4 text-center">
            {language === "en" ? "System Certifications & Compliance" : "การรับรองมาตรฐานระบบและความปลอดภัย"}
          </span>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 border border-[var(--edge)] rounded bg-[var(--bg-panel)] py-1.5 px-3 transition-colors hover:border-[var(--accent-2)] select-none">
              <span className="text-[1rem] leading-none">🔒</span>
              <div className="flex flex-col">
                <span className="font-mono text-[0.6rem] text-[var(--text-faint)] leading-tight uppercase">Security</span>
                <span className="font-mono text-[0.7rem] text-[var(--text)] font-semibold leading-tight uppercase">TLS/SSL Secured</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border border-[var(--edge)] rounded bg-[var(--bg-panel)] py-1.5 px-3 transition-colors hover:border-[#28c840] select-none">
              <span className="text-[1rem] leading-none">⚡</span>
              <div className="flex flex-col">
                <span className="font-mono text-[0.6rem] text-[var(--text-faint)] leading-tight uppercase">Performance</span>
                <span className="font-mono text-[0.7rem] text-[var(--text)] font-semibold leading-tight uppercase">Lighthouse 100</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border border-[var(--edge)] rounded bg-[var(--bg-panel)] py-1.5 px-3 transition-colors hover:border-[var(--good)] select-none">
              <span className="text-[1rem] leading-none">🛡️</span>
              <div className="flex flex-col">
                <span className="font-mono text-[0.6rem] text-[var(--text-faint)] leading-tight uppercase">Compliance</span>
                <span className="font-mono text-[0.7rem] text-[var(--text)] font-semibold leading-tight uppercase">Zero Tracking</span>
              </div>
            </div>

            <a 
              href="https://www.thegreenwebfoundation.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[var(--edge)] rounded bg-[var(--bg-panel)] py-1.5 px-3 transition-colors hover:border-[#8dc63f] cursor-pointer"
            >
              <span className="text-[1rem] leading-none">🌱</span>
              <div className="flex flex-col">
                <span className="font-mono text-[0.6rem] text-[var(--text-faint)] leading-tight uppercase">Sustainability</span>
                <span className="font-mono text-[0.7rem] text-[var(--text)] font-semibold leading-tight uppercase">Green Hosted</span>
              </div>
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[0.74rem] text-[var(--text-faint)] border-t border-[var(--edge)] pt-6">
          <span className="text-center md:text-left">
            © {new Date().getFullYear()} Theppratan Junpanya — {language === "en" ? "Built from scratch. Zero templates." : "เขียนขึ้นมาเองทั้งหมด ไม่ใช้เทมเพลต"}
          </span>
          <span className="hover:text-[var(--accent)] transition-colors cursor-default select-none" title="Konami Code">
            ↑↑↓↓←→←→ B A
          </span>
        </div>

      </div>

      {/* 📌 เปลี่ยนบรรทัด className ของ Easter Egg ตรง translate ให้เพิ่ม opacity และ pointer-events เข้าไปครับ */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[var(--accent)] text-white font-mono text-[0.82rem] py-[13px] px-[22px] rounded-[var(--radius)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-400 ${showEasterEgg ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-[120px] opacity-0 pointer-events-none"}`}
      >
        🎮 {language === "en" ? "Konami detected — extra life granted. (You found the easter egg.)" : "พบสูตร Konami — เพิ่มชีวิตพิเศษ 1 EA (คุณพบ Easter Egg แล้ว)"}
      </div>
    </footer>
  );
}