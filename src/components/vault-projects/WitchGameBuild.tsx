// src/components/vault-projects/WitchGameBuild.tsx
"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function WitchGameBuild() {
  const { language } = useLanguage();

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* ส่วนหัว */}
      <div className="text-center bg-[var(--bg-panel-2)] border border-[var(--edge)] rounded-lg p-6 shadow-sm">
        <h3 className="font-mono text-xl md:text-2xl font-bold text-[var(--text)] flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--good)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--good)]"></span>
          </span>
          {language === "en" ? "Game Design Document" : "เอกสารการออกแบบเกม (GDD)"}
        </h3>
        <p className="font-mono text-[0.85rem] text-[var(--text-dim)] mt-3 max-w-2xl mx-auto leading-relaxed">
          {language === "en" 
            ? "While the WebGL build is being optimized, you can review the complete Game Design Document (GDD) below." 
            : "ในระหว่างที่ WebGL กำลังปรับปรุงประสิทธิภาพ คุณสามารถอ่านเอกสารการออกแบบเกม (GDD) หรือ Pitch Deck ฉบับเต็มได้ที่นี่"}
        </p>
      </div>

      {/* ส่วนกรอบสำหรับแสดง PDF */}
      <div className="w-full rounded-xl overflow-hidden border border-[var(--edge)] shadow-lg bg-[var(--bg-panel)] h-[80vh] min-h-[600px] relative">
        <iframe 
          src="/Make%20a%20Witch.pdf#view=FitH" 
          className="w-full h-full border-none"
          title="Make a Witch Game Document"
        />
      </div>

    </div>
  );
}