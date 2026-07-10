"use client"; // ระบุว่านี่คือ Client Component เพราะมีการใช้ State และ Effect ตรวจจับการ Scroll

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopHUD() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect สำหรับตรวจจับการ Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // เช็คค่าเริ่มต้น
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 backdrop-blur-md border-b ${
        isScrolled
          ? "bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] border-[#2c333f] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          : "bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] border-[var(--edge)]"
      }`}
    >
      <div className={`max-w-[var(--maxw)] mx-auto px-6 flex items-center justify-between transition-all duration-250 ${isScrolled ? "h-[52px]" : "h-[58px]"}`}>
        
        {/* Brand / Logo */}
        <button className="font-mono font-bold text-[0.95rem] tracking-wide flex items-center gap-2 text-[var(--text)] bg-transparent border-none cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <span className="w-[9px] h-[9px] bg-[var(--accent)] rounded-full shadow-[0_0_12px_var(--accent)] animate-pulse"></span>
          Theppratan<span className="text-[var(--text-faint)]">.dev</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 items-center">
          {["play", "work", "skills", "console", "vault", "contact"].map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="font-mono text-[0.78rem] text-[var(--text-dim)] py-2 px-3 rounded-[var(--radius)] transition-all tracking-wider border-b-2 border-transparent hover:text-[var(--text)] hover:bg-[var(--bg-panel-2)] hover:outline hover:outline-1 hover:outline-[var(--edge)]"
            >
              // {item}
            </Link>
          ))}
        </nav>

        {/* HUD Controls (Theme / Lang) */}
        <div className="hidden md:flex gap-2 items-center">
          <button className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text-dim)] py-[7px] px-[10px] rounded-[var(--radius)] transition-all tracking-wider hover:text-[var(--accent)] hover:border-[var(--accent)]">
            <span className="text-[var(--text)]">TH</span><span className="text-[var(--text-faint)]"> / EN</span>
          </button>
          <button className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text-dim)] py-[7px] px-[10px] rounded-[var(--radius)] transition-all tracking-wider hover:text-[var(--accent)] hover:border-[var(--accent)]">
            [ DARK ]
          </button>
        </div>

      </div>
    </header>
  );
}