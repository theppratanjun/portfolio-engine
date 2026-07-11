"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. ลองหาดูว่าเคยบันทึก Theme ไว้ใน localStorage ไหม?
      const savedTheme = localStorage.getItem("portfolio_theme") as Theme | null;
      
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        // 2. ถ้าไม่เคยเข้าเว็บนี้มาก่อน ให้เช็คว่ามือถือ/คอมพิวเตอร์ตั้ง Dark Mode ไว้ไหม
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = prefersDark ? "dark" : "light";
        
        setThemeState(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
      }

      setMounted(true);
    }, 10); 
    
    return () => clearTimeout(timer);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio_theme", newTheme); 
    document.documentElement.setAttribute("data-theme", newTheme); 
  };

  // 📌 ลบ if (!mounted) ทิ้ง เพื่อให้ Provider ครอบคลุมแอปเสมอตั้งแต่ฝั่ง Server
  // ป้องกัน Error "useTheme must be used within a ThemeProvider" 100%
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* 📌 ซ่อนเนื้อหา 10 มิลลิวินาทีแรกเพื่อรอให้ CSS Theme โหลดเสร็จ จะได้ไม่กระพริบสว่างวาบ */}
      <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.25s ease-in-out" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}