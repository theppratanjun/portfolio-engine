// src/components/vault-projects/VrAssemblyBuild.tsx
"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function VrAssemblyBuild() {
  const { language } = useLanguage();

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* ส่วนกล่องข้อความอธิบาย */}
      <div className="text-center bg-[var(--bg-panel-2)] border border-[var(--edge)] rounded-lg p-6 shadow-sm mb-2">
        <h3 className="font-mono text-xl md:text-2xl font-bold text-[var(--text)] flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]"></span>
          </span>
          {language === "en" ? "VR Gameplay & Dashboard Showcase" : "วิดีโอสาธิตการใช้งาน VR และระบบหลังบ้าน"}
        </h3>
        <p className="font-mono text-[0.85rem] text-[var(--text-dim)] mt-3 max-w-2xl mx-auto leading-relaxed">
          {language === "en" 
            ? "Press play to view the complete system demonstration, including in-game VR mechanics and the real-time admin web dashboard." 
            : "กดเล่นวิดีโอเพื่อรับชมการทำงานของระบบแบบเต็มรูปแบบ ครอบคลุมทั้งระบบการโต้ตอบภายในเกม VR และระบบจัดการหลังบ้านสำหรับ Admin"}
        </p>
      </div>
      
      {/* ส่วนเครื่องเล่นวิดีโอ */}
      <div className="relative border border-[var(--edge)] rounded-xl overflow-hidden bg-black shadow-2xl w-full max-w-5xl mx-auto flex justify-center items-center">
        <video 
          src="/0524.mp4" 
          controls 
          preload="metadata"
          controlsList="nodownload"
          className="w-full h-auto max-h-[70vh] outline-none"
        >
          {language === "en" ? "Your browser does not support the video tag." : "เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ"}
        </video>
      </div>
    </div>
  );
}