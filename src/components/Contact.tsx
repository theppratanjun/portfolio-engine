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

          <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] p-6 md:p-12 text-center max-w-[640px] mx-auto shadow-lg transition-transform hover:-translate-y-1">
            <div className="text-4xl mb-4">🕊️</div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text)]">
              {language === "en" ? "Instead of buying me a coffee..." : "เปลี่ยนค่ากาแฟ เป็นรอยยิ้มของเด็กๆ"}
            </h3>
            <p className="text-[var(--text-dim)] text-[0.9rem] mb-6 leading-relaxed">
              {language === "en" 
                ? "If my work is valuable to you, or you wish to support me, please donate directly to the SOS Children's Villages Thailand Foundation. Every penny you donate will go directly to the children, without passing through me."
                : "หากผลงานของผมสร้างคุณค่าให้กับคุณ หรือต้องการสนับสนุนผม ขอเชิญร่วมบริจาคโดยตรงให้กับมูลนิธิเด็กโสสะแห่งประเทศไทยฯ ทุกการสนับสนุนที่ท่านร่วมทำบุญจะส่งตรงถึงเด็กๆ โดยไม่ผ่านผมครับ"}
            </p>

            {/* 📌 กล่องอธิบายเหตุผล (ซ้อนอยู่ข้างในให้ดูเรียบร้อย) */}
            <div className="bg-[var(--bg)] border border-[var(--edge)] rounded-md p-5 mb-6 text-left shadow-sm">
              <div className="font-mono text-[0.75rem] text-[var(--accent)] font-bold mb-3 uppercase tracking-wider">
                {language === "en" ? "// Why this foundation?" : "// ทำไมถึงควรบริจาคที่นี่?"}
              </div>
              <ul className="text-[0.8rem] space-y-2.5 text-[var(--text-dim)] font-mono">
                <li>
                  <strong className="text-[var(--text)] font-semibold">1. {language === "en" ? "Transparency" : "โปร่งใสตรวจสอบได้"}</strong> — {language === "en" ? "Audited annually with public financial reports." : "มีผู้สอบบัญชีและเปิดเผยงบการเงินสู่สาธารณะ"}
                </li>
                <li>
                  <strong className="text-[var(--text)] font-semibold">2. {language === "en" ? "Real Impact" : "ผลลัพธ์ยั่งยืน"}</strong> — {language === "en" ? "Builds a long-term 'substitute family' for orphans." : "สร้าง 'ครอบครัวทดแทน' ให้เด็กๆ เติบโตอย่างอบอุ่นในระยะยาว"}
                </li>
                <li>
                  <strong className="text-[var(--text)] font-semibold">3. {language === "en" ? "Tax Deductible" : "ลดหย่อนภาษีได้"}</strong> — {language === "en" ? "Registered charity (No. 38) supporting e-Donation." : "เป็นองค์กรสาธารณกุศล (ลำดับที่ 38) รองรับระบบ e-Donation"}
                </li>
              </ul>
            </div>
            
            {/* 📌 รูปภาพ QR Code TTB แนวนอน */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-[460px] overflow-hidden rounded-md border border-[var(--edge)] mb-5 shadow-sm bg-[#00a3e0]">
                <img 
                  src="https://www.sosthailand.org/getmedia/d6ec6171-c707-4cd6-aa85-71b15f8f51c4/AW-TTBQR04-Web-BankAcc.jpg" 
                  alt="SOS Foundation e-Donation QR Code" 
                  className="w-full h-auto block"
                />
              </div>
              
              <a 
                href="https://www.sosthailand.org/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.8rem] bg-[var(--accent-2)] text-[#04201b] font-semibold py-2.5 px-6 rounded-[var(--radius)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_color-mix(in_srgb,var(--accent-2)_35%,transparent)] inline-block w-full max-w-[320px]"
              >
                {language === "en" ? "Visit Official Website ↗" : "ไปที่เว็บไซต์ทางการของมูลนิธิ ↗"}
              </a>
            </div>

            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] flex items-center justify-center gap-1.5 mt-5">
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
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold mt-4 mb-3 text-[var(--text)]">
              {language === "en" ? "Bring me onto the team" : "เรียกผมเข้าทีมได้เลย"}
            </h2>
            <p className="text-[var(--text-dim)] max-w-[580px] mx-auto mb-8">
              {language === "en"
                ? "I'm looking for a software-engineering role where I can build products at scale and grow fast. If that's your team — let's talk."
                : "ผมกำลังมองหาตำแหน่ง Software Engineer ที่จะได้สร้างระบบจริงที่รองรับผู้คนจำนวนมากและเติบโตอย่างรวดเร็ว ถ้านี่คือทีมของคุณ — ทักมาคุยกันได้เลยครับ"}
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {/* 📌 อัปเดตอีเมลของคุณตรงนี้ (ทั้ง href และข้อความแสดงผล) */}
              <a 
                href="mailto:theppratanjun@gmail.com" 
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-3 px-6 rounded-[var(--radius)] transition-all bg-[var(--accent)] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)] inline-flex items-center gap-2"
              >
                ✉ theppratanjun@gmail.com
              </a>
              {/* 📌 อัปเดตลิงก์ LinkedIn ของคุณ */}
              <a 
                href="https://www.linkedin.com/in/theppratan-junpunya-b42717420" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.85rem] font-medium tracking-[0.03em] py-3 px-6 rounded-[var(--radius)] transition-all bg-transparent border border-[var(--edge)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] inline-flex items-center gap-2"
              >
                in/ linkedin
              </a>
              {/* 📌 อัปเดตลิงก์ GitHub ของคุณ */}
              <a 
                href="https://github.com/theppratanjun" 
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