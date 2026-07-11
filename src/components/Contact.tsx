"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();

  return (
    <div className="relative">
      {/* ===================== DONATE / PAY IT FORWARD ===================== */}
      <section id="support" className="pt-20 pb-10 relative scroll-mt-10">
        <div className="max-w-[1180px] mx-auto w-full px-6">
          <div className="text-center mb-10">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 justify-center before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
              {language === "en" ? "pay it forward" : "ส่งต่อสิ่งดีๆ ให้สังคม"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-4 mb-3">
              {language === "en" ? "Support a greater cause" : "สนับสนุนมูลนิธิเด็กกำพร้า"}
            </h2>
          </div>

          <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] p-8 md:p-12 text-center max-w-[560px] mx-auto shadow-lg transition-transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🕊️</div>
            <h3 className="text-xl font-bold mb-2">
              {language === "en" ? "Instead of buying me a coffee..." : "เปลี่ยนค่ากาแฟ เป็นรอยยิ้มของเด็กๆ"}
            </h3>
            <p className="text-[var(--text-dim)] text-[0.9rem] mb-6 leading-relaxed">
              {language === "en" 
                ? "If my portfolio inspired you or you'd like to support my journey, I ask for nothing but a direct donation to the Foundation for Orphaned Children. Every single baht goes directly to them."
                : "หากพอร์ตโฟลิโอของผมเป็นประโยชน์หรือคุณอยากสนับสนุนผม ผมขอเพียงการบริจาคโดยตรงให้กับมูลนิธิเด็กกำพร้า เงินทุกบาทของคุณจะส่งตรงถึงเด็กๆ โดยไม่ผ่านผมครับ"}
            </p>
            
            <div className="bg-[var(--bg)] border border-[var(--edge)] rounded-md p-6 mb-4 flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-white rounded flex items-center justify-center mb-3">
                <span className="text-gray-400 font-mono text-xs border-2 border-dashed border-gray-300 w-[90%] h-[90%] flex items-center justify-center text-center px-2">
                  [ OFFICIAL<br/>QR ]
                </span>
              </div>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.8rem] bg-[var(--accent-2)] text-[#04201b] font-semibold py-2.5 px-6 rounded-[var(--radius)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_color-mix(in_srgb,var(--accent-2)_35%,transparent)] inline-block w-full max-w-[280px]"
              >
                {language === "en" ? "Visit Foundation Website ↗" : "ไปที่เว็บไซต์ทางการของมูลนิธิ ↗"}
              </a>
            </div>

            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] flex items-center justify-center gap-1.5 mt-4">
              <span>🔒</span>
              {language === "en" 
                ? "Verifiable direct routing. I do not process or collect any funds."
                : "รับประกันความโปร่งใส ผมไม่มีส่วนเกี่ยวข้องกับการรับเงินใดๆ ทั้งสิ้น"}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT ===================== */}
      <section id="contact" className="py-16 relative scroll-mt-10 mb-8">
        <div className="max-w-[1180px] mx-auto w-full px-6">
          <div className="border border-[var(--edge)] rounded-lg bg-[linear-gradient(140deg,var(--bg-panel),var(--bg-panel-2))] p-10 md:p-14 text-center shadow-xl">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 justify-center before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
              {language === "en" ? "let's ship something" : "มาร่วมสร้างสิ่งดีๆ ด้วยกัน"}
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold mt-4 mb-3">
              {language === "en" ? "Bring me onto the team" : "เรียกผมเข้าทีมได้เลย"}
            </h2>
            <p className="text-[var(--text-dim)] max-w-[580px] mx-auto mb-8">
              {language === "en"
                ? "I'm looking for a software-engineering role where I can build products at scale and grow fast. If that's your team — let's talk."
                : "ผมกำลังมองหาตำแหน่ง Software Engineer ที่จะได้สร้างระบบจริงที่รองรับผู้คนจำนวนมากและเติบโตอย่างรวดเร็ว ถ้านี่คือทีมของคุณ — ทักมาคุยกันได้เลยครับ"}
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="mailto:your.email@example.com" 
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-3 px-6 rounded-[var(--radius)] transition-all bg-[var(--accent)] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)] inline-flex items-center gap-2"
              >
                ✉ your.email@example.com
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-3 px-6 rounded-[var(--radius)] transition-all bg-transparent border border-[var(--edge)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] inline-flex items-center gap-2"
              >
                in/ linkedin
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-3 px-6 rounded-[var(--radius)] transition-all bg-transparent border border-[var(--edge)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] inline-flex items-center gap-2"
              >
                ⌥ github
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}