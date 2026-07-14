"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // 📌 แก้ไข Error: ใช้ setTimeout ครอบเพื่อไม่ให้เกิด Cascading Renders
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedLang = localStorage.getItem("portfolio_lang") as Language | null;
      if (savedLang) {
        setLanguage(savedLang);
      } else {
        //const browserLang = navigator.language.toLowerCase().startsWith("th") ? "th" : "en";
        // 📌 ลบการเช็ค navigator.language ออก แล้วบังคับเป็น "en" ทันที
        const initialLang = "en";
        
        setLanguage(initialLang);
        localStorage.setItem("portfolio_lang", initialLang);
      }
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "en" ? "th" : "en";
      localStorage.setItem("portfolio_lang", newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}