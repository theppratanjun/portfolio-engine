"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function TopHUD() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 📌 เพิ่ม State ตรวจจับการล็อกอิน
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 📌 ดักฟัง Event ว่ามีการล็อกอินอยู่หรือไม่ เพื่ออัปเดตปุ่มบน HUD แบบเรียลไทม์
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(sessionStorage.getItem("vault_session") === "active");
    };
    checkAuth();
    window.addEventListener("authStateChanged", checkAuth);
    return () => window.removeEventListener("authStateChanged", checkAuth);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 📌 แก้ไขตรงนี้: ให้ยิงสัญญาณ Master Logout แทนการลบแค่ Cookie ฝั่งเดียว
  const handleLogout = () => {
    window.dispatchEvent(new Event("triggerVaultLogout"));
  };

  const navItems = ["play", "work", "skills", "console", "vault", "contact"];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  // 📌 ฟังก์ชันจัดการเมื่อกดปุ่มโลโก้ (Theppratan.dev)
  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // สั่งปิดเมนูมือถือ
    window.scrollTo({ top: 0, behavior: "smooth" }); // เลื่อนขึ้นบนสุด
    window.history.pushState(null, "", window.location.pathname); // เคลียร์ # ออกจาก URL
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 backdrop-blur-md border-b ${
          isScrolled ? "bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] border-[#2c333f] shadow-[0_4px_20px_rgba(0,0,0,0.4)]" : "bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] border-[var(--edge)]"
        }`}>
        <div className={`max-w-[1180px] mx-auto w-full px-6 flex items-center justify-between transition-all duration-250 ${isScrolled ? "h-[52px]" : "h-[58px]"}`}>
          
          <button 
            className="font-mono font-bold text-[0.95rem] tracking-wide flex items-center gap-2 text-[var(--text)] bg-transparent border-none cursor-pointer" 
            onClick={handleLogoClick}
          >
            <span className="w-[9px] h-[9px] bg-[var(--accent)] rounded-full shadow-[0_0_12px_var(--accent)] animate-pulse"></span>
            Theppratan<span className="text-[var(--text-faint)]">.dev</span>
          </button>

          <nav className="hidden md:flex gap-1 items-center">
            {navItems.map((item) => (
              <a 
                key={item} 
                href={`#${item}`} 
                onClick={(e) => handleNavClick(e, item)} 
                className="font-mono text-[0.78rem] text-[var(--text-dim)] py-2 px-3 rounded-[var(--radius)] transition-all tracking-wider border-b-2 border-transparent hover:text-[var(--text)] hover:bg-[var(--bg-panel-2)] hover:outline hover:outline-1 hover:outline-[var(--edge)] cursor-pointer"
              >
                {"// " + item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            <button onClick={toggleLanguage} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel-2)] border border-[var(--edge)] py-[7px] px-[10px] rounded-[var(--radius)] transition-all tracking-wider hover:text-[var(--accent)] hover:border-[var(--accent)]">
              <span className={language === 'th' ? "text-[var(--text)]" : "text-[var(--text-faint)]"}>TH</span>
              <span className="text-[var(--text-faint)]"> / </span>
              <span className={language === 'en' ? "text-[var(--text)]" : "text-[var(--text-faint)]"}>EN</span>
            </button>
            <button onClick={toggleTheme} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text-dim)] py-[7px] px-[10px] rounded-[var(--radius)] transition-all tracking-wider hover:text-[var(--accent)] hover:border-[var(--accent)]">
              {theme === "light" ? "[ LIGHT ]" : "[ DARK ]"}
            </button>

            {/* 📌 ถ้าระบบล็อกอินผ่าน จะโชว์ปุ่มจัดการ User ที่มุมขวาบนสุด (เหมือนเว็บแอปของจริง) */}
            {isLoggedIn && (
              <div className="flex items-center gap-1 ml-2 pl-3 border-l border-[var(--edge)]">
                <button 
                  onClick={() => window.dispatchEvent(new Event("openAccountSettings"))}
                  className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-[7px] px-[10px] rounded-[var(--radius)] transition-all hover:text-[var(--text)] hover:border-[var(--text-dim)]"
                  title={language === "en" ? "Account Settings" : "ตั้งค่าบัญชี"}
                >
                  ⚙️
                </button>
                <button 
                  onClick={handleLogout}
                  className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--danger)] py-[7px] px-[10px] rounded-[var(--radius)] transition-all hover:bg-[var(--danger)] hover:text-white"
                  title={language === "en" ? "Log Out" : "ออกจากระบบ"}
                >
                  ⏻
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50 cursor-pointer bg-transparent border-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className={`block w-6 h-[2px] rounded-full bg-[var(--text)] transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[8px] !bg-[var(--accent)]" : ""}`}></span>
            <span className={`block w-6 h-[2px] rounded-full bg-[var(--text)] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-[2px] rounded-full bg-[var(--text)] transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[8px] !bg-[var(--accent)]" : ""}`}></span>
          </button>
        </div>
      </header>

      <div className={`fixed top-0 left-0 right-0 z-40 bg-[var(--bg)] border-b border-[var(--edge)] pt-[70px] pb-4 px-4 flex flex-col font-mono transition-transform duration-300 shadow-xl md:hidden ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        {navItems.map((item, index) => (
          <a 
            key={item} 
            href={`#${item}`} 
            onClick={(e) => handleNavClick(e, item)} 
            className="text-[0.9rem] text-[var(--text)] py-[13px] px-[14px] border-b border-[var(--bg-panel)] flex items-center active:bg-[var(--bg-panel-2)] cursor-pointer"
          >
            <span className="text-[var(--text-faint)] mr-3">0{index + 1}</span>{"// " + item}
          </a>
        ))}
        <div className="flex gap-2 pt-3 mt-1 border-t border-[var(--edge)] px-[14px]">
          <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="flex-1 font-mono text-[0.78rem] cursor-pointer bg-[var(--bg-panel-2)] border border-[var(--edge)] py-[10px] rounded-[var(--radius)] transition-all active:border-[var(--accent)]">
            <span className={language === 'th' ? "text-[var(--text)]" : "text-[var(--text-faint)]"}>TH</span>
            <span className="text-[var(--text-faint)]"> / </span>
            <span className={language === 'en' ? "text-[var(--text)]" : "text-[var(--text-faint)]"}>EN</span>
          </button>
          <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="flex-1 font-mono text-[0.78rem] cursor-pointer bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text-dim)] py-[10px] rounded-[var(--radius)] transition-all active:border-[var(--accent)]">
            {theme === "light" ? "[ LIGHT ]" : "[ DARK ]"}
          </button>
        </div>
        
        {/* 📌 เมนูมือถือ: แสดงปุ่มจัดการระบบถ้ายืนยันตัวตนแล้ว */}
        {isLoggedIn && (
          <div className="flex gap-2 pt-2 px-[14px]">
            <button onClick={() => { window.dispatchEvent(new Event("openAccountSettings")); setIsMobileMenuOpen(false); }} className="flex-1 font-mono text-[0.78rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text)] py-[10px] rounded-[var(--radius)] transition-all active:border-[var(--text-dim)]">
              ⚙️ {language === "en" ? "SETTINGS" : "ตั้งค่าบัญชี"}
            </button>
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex-1 font-mono text-[0.78rem] cursor-pointer bg-[var(--danger)] border border-[var(--danger)] text-white py-[10px] rounded-[var(--radius)] transition-all active:brightness-90">
              ⏻ {language === "en" ? "LOG OUT" : "ออกจากระบบ"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}