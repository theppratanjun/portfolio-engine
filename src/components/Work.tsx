"use client";

import { useLanguage } from "@/context/LanguageContext";

const PROJECTS_DATA = [
  {
    id: "PRJ_01",
    isFeatured: true,
    title: "[Hackathon] DPU Business 2022",
    type: { en: "// Systems Design · Problem Solving", th: "// การออกแบบระบบ · การแก้ปัญหา" },
    desc: {
      en: "1st Place Winner. Solved problems under strict time limits, collaborated with a team to design, develop, and present the project using agile software development processes.",
      th: "รางวัลชนะเลิศอันดับ 1 แก้โจทย์ปัญหาที่ได้รับภายใต้กรอบเวลาที่จำกัด ทำงานร่วมกับสมาชิกในทีมเพื่อออกแบบ พัฒนา และนำเสนอโครงการแบรนด์กระเป๋าจากขยะเสื้อผ้า (PANNUS) ประยุกต์ใช้กระบวนการแก้ปัญหาอย่างเป็นระบบ"
    },
    tags: ["Hackathon", "Architecture", "Teamwork", "Pitching"],
    links: [
      // 📌 ปรับสถานะ disabled ให้เป็น true เพื่อให้กดไม่ได้และแสดงเฉยๆ
      { label: { en: "↗ pitch deck (.pdf)", th: "↗ pitch-deck.pdf" }, url: "/pitch-deck.pdf", disabled: false },
      { label: { en: "↗ 1st place photo", th: "↗ ภาพรับรางวัล" }, url: "/1stWinner.jpg", disabled: false }
    ],
  },
  {
    id: "PRJ_02",
    isFeatured: true,
    title: "G-Armed Forces Cyber 2024",
    type: { en: "// Cybersecurity · Network", th: "// ความปลอดภัยไซเบอร์ · เครือข่าย" },
    desc: {
      en: "Participated in the Royal Thai Armed Forces Cyber Skills Competition (University Level). Focused on network security, technical troubleshooting, and handling network vulnerabilities.",
      th: "เข้าร่วมการแข่งขันทักษะทางไซเบอร์ กองทัพไทย ประจำปี 2567 (ระดับอุดมศึกษา) เน้นความปลอดภัยของเครือข่าย การแก้ปัญหาทางเทคนิค และการรับมือช่องโหว่ของระบบเครือข่าย"
    },
    tags: ["Cybersecurity", "Network", "Vulnerability"],
    links: [
      { label: { en: "↗ certificate (.pdf)", th: "↗ ใบประกาศนียบัตร (.pdf)" }, url: "/DPU CYBER GUARDIANS TEAM.pdf", disabled: false }
    ],
  },
  {
    id: "PRJ_03",
    isFeatured: false,
    title: "Witch 2.5D RPG / VR Assembly",
    type: { en: "// Unity · C# · VR", th: "// Unity · C# · VR" },
    desc: {
      en: "The edge no other candidate has. Developed a 2.5D RPG game system (WASD Movement, Animation, Combat) and a VR Mechanical Assembly project connecting 3D CAD to Unity simulations.",
      th: "จุดเด่นที่แตกต่าง พัฒนาระบบเกม 2.5D RPG (WASD Movement, Animation, Combat) และโปรเจกต์ VR Mechanical Assembly เชื่อมต่อ 3D CAD สู่ระบบจำลองใน Unity"
    },
    tags: ["Unity", "C#", "Game Systems", "VR"],
    links: [
      // 📌 ปรับสถานะ disabled ให้เป็น true ตามที่คุณต้องการ
      { label: { en: "▶ play", th: "▶ เล่นเลย" }, url: "#", disabled: true }, 
      { label: { en: "↗ devlog", th: "↗ บันทึกการพัฒนา" }, url: "#", disabled: true }
    ],
  },
];

export default function Work() {
  const { language } = useLanguage();

  return (
    <section id="work" className="py-20 relative scroll-mt-10">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
          {language === "en" ? "selected work" : "ผลงานที่คัดเลือก"}
        </span>
        
        <h2 className={`font-bold mt-4 mb-3 ${language === "en" ? "text-4xl md:text-5xl tracking-tight leading-[1.05]" : "text-[1.8rem] sm:text-3xl md:text-[2.4rem] lg:text-[2.8rem] tracking-normal leading-[1.4] md:whitespace-nowrap"}`}>
          {language === "en" ? "Things I made and shipped" : "ผลงานที่ผมพัฒนาและใช้งานจริง"}
        </h2>
        
        <p className="text-[var(--text-dim)]">
          {language === "en" 
            ? "Selected projects reflecting Full-Stack, Cybersecurity, and Game Engineering skills. The core concept is engineering problem-solving and practical implementation."
            : "ผลงานที่คัดเลือกมาเพื่อสะท้อนทักษะ Full-Stack, Cybersecurity และ Game Engineering กรอบแนวคิดคือการแก้ปัญหาทางวิศวกรรมและการนำไปใช้งานได้จริง"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PROJECTS_DATA.map((proj) => (
          <article key={proj.id} className="relative overflow-hidden bg-[var(--bg-panel)] border border-[var(--edge)] rounded-md p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--edge))] group flex flex-col">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)] scale-y-0 origin-top transition-transform duration-250 group-hover:scale-y-100"></div>
            <div className="font-mono text-xs text-[var(--text-faint)] tracking-widest">
              {proj.id} {proj.isFeatured && (language === "en" ? "· featured" : "· ผลงานเด่น")}
            </div>
            <h3 className="text-xl font-semibold mt-2 mb-1">{proj.title}</h3>
            <div className="font-mono text-xs text-[var(--accent-2)] mb-3">{proj.type[language]}</div>
            <p className="text-[var(--text-dim)] text-[0.95rem] mb-5 leading-relaxed flex-1">
              {proj.desc[language]}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {proj.tags.map(tag => (
                <span key={tag} className="font-mono text-[0.7rem] text-[var(--text-dim)] border border-[var(--edge)] rounded py-1 px-2">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4 font-mono text-xs flex-wrap mt-auto">
              {proj.links.map(link => (
                // 📌 ถ้า disabled เป็น true ให้เรนเดอร์เป็นตัวหนังสือสีเทาๆ พร้อม Tooltip
                link.disabled ? (
                  <span 
                    key={link.label.en} 
                    title={language === "en" ? "Coming soon..." : "ปิดปรับปรุงชั่วคราว (Coming soon...)"}
                    className="text-[var(--text-faint)] border-b border-transparent cursor-not-allowed select-none opacity-50"
                  >
                    {link.label[language]}
                  </span>
                ) : (
                  // 📌 ถ้า disabled เป็น false (หรือไม่ได้ใส่ไว้) ให้เรนเดอร์เป็นปุ่มกดปกติ
                  <a 
                    key={link.label.en} 
                    href={link.url} 
                    target={link.url.startsWith("/") ? "_blank" : "_self"} 
                    rel={link.url.startsWith("/") ? "noopener noreferrer" : ""} 
                    className="text-[var(--accent)] border-b border-transparent transition-colors hover:border-[var(--accent)]"
                  >
                    {link.label[language]}
                  </a>
                )
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}