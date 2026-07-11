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
      th: "รางวัลชนะเลิศอันดับ 1 แก้โจทย์ปัญหาที่ได้รับภายใต้กรอบเวลาที่จำกัด ทำงานร่วมสมาชิกในทีมเพื่อออกแบบ พัฒนา และนำเสนอโครงการ ประยุกต์ใช้กระบวนการแก้ปัญหาและการพัฒนาซอฟต์แวร์"
    },
    tags: ["Hackathon", "Architecture", "Teamwork"],
    links: [{ label: { en: "↗ case study", th: "↗ กรณีศึกษา" }, url: "#" }],
  },
  {
    id: "PRJ_02",
    isFeatured: false,
    title: "G-Armed Forces Cyber 2024",
    type: { en: "// Cybersecurity · Network", th: "// ความปลอดภัยไซเบอร์ · เครือข่าย" },
    desc: {
      en: "Participated in the Royal Thai Armed Forces Cyber Skills Competition (University Level). Focused on network security, technical troubleshooting, and handling network vulnerabilities.",
      th: "เข้าร่วมการแข่งขันทักษะทางไซเบอร์ กองทัพไทย (ระดับอุดมศึกษา) เน้นความปลอดภัยของเครือข่าย การแก้ปัญหาทางเทคนิค และการรับมือช่องโหว่ของระบบเครือข่าย"
    },
    tags: ["Cybersecurity", "Network", "Vulnerability"],
    links: [{ label: { en: "↗ certificate", th: "↗ ใบประกาศนียบัตร" }, url: "#" }],
  },
  {
    id: "PRJ_03",
    isFeatured: false,
    title: "Hacker House Web3",
    type: { en: "// Blockchain · dApps", th: "// บล็อกเชน · dApps" },
    desc: {
      en: "Web3 development competition. Studied blockchain technology and decentralized application concepts, tackling software development challenges in a fast-paced team environment.",
      th: "การแข่งขันพัฒนา Web3 ศึกษาเทคโนโลยีบล็อกเชนและแนวคิดแอปพลิเคชันแบบกระจายศูนย์ ทำงานภายใต้ความท้าทายในสภาพแวดล้อมแบบทีม"
    },
    tags: ["Web3", "Blockchain", "Smart Contract"],
    links: [{ label: { en: "⌥ source", th: "⌥ ซอร์สโค้ด" }, url: "#" }],
  },
  {
    id: "PRJ_04",
    isFeatured: true,
    title: "Witch 2.5D RPG / VR Assembly",
    type: { en: "// Unity · C# · VR", th: "// Unity · C# · VR" },
    desc: {
      en: "The edge no other candidate has. Developed a 2.5D RPG game system (WASD Movement, Animation, Combat) and a VR Mechanical Assembly project connecting 3D CAD to Unity simulations.",
      th: "จุดเด่นที่แตกต่าง พัฒนาระบบเกม 2.5D RPG (WASD Movement, Animation, Combat) และโปรเจกต์ VR Mechanical Assembly เชื่อมต่อ 3D CAD สู่ระบบจำลองใน Unity"
    },
    tags: ["Unity", "C#", "Game Systems", "VR"],
    links: [
      { label: { en: "▶ play", th: "▶ เล่นเลย" }, url: "#play" }, 
      { label: { en: "↗ devlog", th: "↗ บันทึกการพัฒนา" }, url: "#" }
    ],
  },
];

export default function Work() {
  const { language } = useLanguage(); // 📌 ดึง state ภาษามาใช้

  return (
    <section id="work" className="py-20 relative scroll-mt-10">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
          {language === "en" ? "selected work" : "ผลงานที่คัดเลือก"}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-3 leading-[1.05]">
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
          <article key={proj.id} className="relative overflow-hidden bg-[var(--bg-panel)] border border-[var(--edge)] rounded-md p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--edge))] group">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)] scale-y-0 origin-top transition-transform duration-250 group-hover:scale-y-100"></div>
            <div className="font-mono text-xs text-[var(--text-faint)] tracking-widest">
              {proj.id} {proj.isFeatured && (language === "en" ? "· featured" : "· ผลงานเด่น")}
            </div>
            <h3 className="text-xl font-semibold mt-2 mb-1">{proj.title}</h3>
            <div className="font-mono text-xs text-[var(--accent-2)] mb-3">{proj.type[language]}</div>
            <p className="text-[var(--text-dim)] text-[0.95rem] mb-5 leading-relaxed">
              {proj.desc[language]}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {proj.tags.map(tag => (
                <span key={tag} className="font-mono text-[0.7rem] text-[var(--text-dim)] border border-[var(--edge)] rounded py-1 px-2">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 font-mono text-xs">
              {proj.links.map(link => (
                <a key={link.label.en} href={link.url} className="text-[var(--accent)] border-b border-transparent transition-colors hover:border-[var(--accent)]">
                  {link.label[language]}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}