"use client";

import { useState, useEffect } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ปุ่มจะแสดงก็ต่อเมื่อเลื่อนหน้าจอลงมาเกิน 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // เลื่อนขึ้นแบบนุ่มนวล
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-300 backdrop-blur-sm
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-1 hover:shadow-[0_8px_16px_color-mix(in_srgb,var(--accent)_25%,transparent)]
      `}
    >
      <span className="font-mono text-[1.2rem] leading-none -mt-1">↑</span>
    </button>
  );
}