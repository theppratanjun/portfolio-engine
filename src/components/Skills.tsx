"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const SKILL_CATEGORIES = [
  {
    title: { en: "Full-Stack & Database", th: "ฟูลสแต็ก และ ฐานข้อมูล" },
    skills: [
      { name: "MySQL / SQL", level: { en: "strong", th: "ชำนาญ" }, w: 84 },
      { name: "Node.js / APIs", level: { en: "working", th: "ใช้งานได้ดี" }, w: 78 },
      { name: "Next.js / React", level: { en: "working", th: "ใช้งานได้ดี" }, w: 75 },
      { name: "DB Design", level: { en: "strong", th: "ชำนาญ" }, w: 80 },
    ],
  },
  {
    title: { en: "Software Engineering", th: "วิศวกรรมซอฟต์แวร์" },
    skills: [
      { name: "OOP", level: { en: "core", th: "เชี่ยวชาญ" }, w: 88 },
      { name: "Data Structures", level: { en: "strong", th: "ชำนาญ" }, w: 82 },
      { name: "API Design", level: { en: "strong", th: "ชำนาญ" }, w: 80 },
      { name: "Agile / Scrum", level: { en: "working", th: "ใช้งานได้ดี" }, w: 70 },
    ],
  },
  {
    title: { en: "Game / Engine / IoT", th: "เกม / เอนจิน / IoT" },
    skills: [
      { name: "Unity", level: { en: "core", th: "เชี่ยวชาญ" }, w: 90 },
      { name: "C#", level: { en: "core", th: "เชี่ยวชาญ" }, w: 88 },
      { name: "Gameplay Systems", level: { en: "strong", th: "ชำนาญ" }, w: 82 },
      { name: "IoT (Raspberry Pi)", level: { en: "working", th: "ใช้งานได้ดี" }, w: 65 },
    ],
  },
  {
    title: { en: "Security & Foundations", th: "ความปลอดภัย และ พื้นฐาน" },
    skills: [
      { name: "Cybersecurity", level: { en: "strong", th: "ชำนาญ" }, w: 80 },
      { name: "Network Security", level: { en: "working", th: "ใช้งานได้ดี" }, w: 75 },
      { name: "Git / GitHub", level: { en: "core", th: "เชี่ยวชาญ" }, w: 85 },
      { name: "Docker / Linux", level: { en: "working", th: "ใช้งานได้ดี" }, w: 70 },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage(); // 📌 ดึง state ภาษา

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-20 relative scroll-mt-10">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
          {language === "en" ? "capabilities" : "ความสามารถ"}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-3 leading-[1.05]">
          {language === "en" ? "The toolset" : "เครื่องมือและทักษะ"}
        </h2>
        <p className="text-[var(--text-dim)]">
          {language === "en" 
            ? "Proficiency levels in each technology, reflecting real-world experience and hands-on implementation."
            : "ระดับความเชี่ยวชาญในแต่ละเทคโนโลยี สะท้อนจากประสบการณ์จริงและการลงมือทำ"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.title.en} className="bg-[var(--bg-panel)] border border-[var(--edge)] rounded-md p-6">
            <h4 className="font-mono text-[0.8rem] tracking-widest uppercase text-[var(--accent)] mb-5">
              {cat.title[language]}
            </h4>
            {cat.skills.map((skill) => (
              <div key={skill.name} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5 font-mono">
                  <span>{skill.name}</span>
                  <span className="text-[var(--text-faint)] text-xs">{skill.level[language]}</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-panel-2)] rounded overflow-hidden">
                  <i 
                    className="block h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    style={{ width: isVisible ? `${skill.w}%` : "0%" }}
                  ></i>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}