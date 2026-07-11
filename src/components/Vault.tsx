"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";

const VAULT_PROJECTS = [
  {
    id: "v01",
    title: { en: "Interactive 3D Showreel", th: "ผลงาน 3D อินเทอร์แอกทีฟ" },
    type: "// React Three Fiber · GSAP ScrollTrigger · WebGL",
    desc: {
      en: ["A scrollytelling 3D experience — a model that assembles and rotates as you scroll, Iron-Man style. Proves I can do interactive/visual/3D on the web, not just CRUD.", "Built with R3F + GSAP ScrollTrigger + Draco-compressed GLB, with a 2D fallback for low-power devices."],
      th: ["ประสบการณ์ 3D แบบ Scrollytelling — โมเดล 3 มิติที่จะประกอบร่างและหมุนตามการเลื่อนหน้าจอของคุณสไตล์ Iron-Man เพื่อแสดงให้เห็นว่าผมสามารถทำระบบ 3D บนเว็บได้ ไม่ใช่แค่ระบบจัดการฐานข้อมูลทั่วไป", "พัฒนาด้วย R3F + GSAP ScrollTrigger + Draco-compressed GLB พร้อมระบบ 2D สำรองสำหรับอุปกรณ์สเปคต่ำ"]
    },
    stageBig: "🧊",
    stageCap: { 
      en: "[ 3D canvas mounts here — a Blender/SolidWorks model that assembles & rotates on scroll ]", 
      th: "[ พื้นที่สำหรับ 3D Canvas — โมเดลจาก Blender/SolidWorks จะหมุนและประกอบร่างที่นี่ ]" 
    },
    notes: {
      en: "<h3>What this proves</h3><p>Interactive/visual/3D on the web, not just CRUD. The model is exported from Blender as a Draco-compressed GLB and driven by GSAP ScrollTrigger.</p><h3>Why it lives behind login</h3><p>3D is heavy. Keeping it in the vault means the public homepage stays fast (Lighthouse green) while still showing this off to people who care enough to sign in.</p>",
      th: "<h3>สิ่งที่โปรเจกต์นี้พิสูจน์</h3><p>ทักษะการทำ Interactive/Visual/3D บนเว็บ โมเดลถูก Export จาก Blender ในรูปแบบ Draco-compressed GLB และควบคุมด้วย GSAP ScrollTrigger</p><h3>ทำไมถึงต้องล็อกอินเพื่อดู</h3><p>ระบบ 3D กินทรัพยากรเครื่องสูง การเก็บไว้ในคลังลับช่วยให้หน้าเว็บหลักโหลดได้รวดเร็ว (Lighthouse สีเขียว) แต่ยังคงโชว์ของได้สำหรับผู้ที่สนใจจริงๆ</p>"
    }
  },
  {
    id: "v02",
    title: { en: "[Unreleased Game Build]", th: "[ตัวเกมเวอร์ชันกำลังพัฒนา]" },
    type: "// Unity · WebGL · work in progress",
    desc: {
      en: ["An early build of my next game — playable, but not ready for the public yet. Sign in for the dev build + devlog.", "Shows gameplay systems, state management, and WebGL optimization in progress."],
      th: ["ตัวเกมเวอร์ชันทดสอบที่กำลังพัฒนา — สามารถเล่นได้แต่ยังไม่พร้อมเผยแพร่สู่สาธารณะ ล็อกอินเพื่อดูบิลด์และบันทึกการพัฒนา", "แสดงระบบเกมเพลย์, การจัดการสถานะ, และการปรับแต่งประสิทธิภาพ WebGL"]
    },
    stageBig: "🎮",
    stageCap: { 
      en: "[ Unity WebGL dev build embeds here — playable, pre-release ]", 
      th: "[ พื้นที่สำหรับฝัง Unity WebGL รุ่นทดสอบ — ทดลองเล่นก่อนปล่อยจริง ]" 
    },
    notes: {
      en: "<h3>What you get</h3><p>An early but playable build of the next game, plus the devlog. Shows gameplay systems, state management, and WebGL optimization in progress.</p><h3>Why gated</h3><p>It is unfinished — gating lets me share work-in-progress with recruiters without shipping it publicly.</p>",
      th: "<h3>สิ่งที่คุณจะได้เห็น</h3><p>ตัวเกมเวอร์ชันทดสอบที่เล่นได้จริงพร้อมบันทึกการพัฒนา แสดงให้เห็นถึงระบบเกม การจัดการสถานะ และการปรับแต่ง WebGL</p><h3>ทำไมถึงต้องซ่อนไว้</h3><p>เนื่องจากยังสร้างไม่เสร็จ การซ่อนไว้ทำให้ผมสามารถแชร์ความคืบหน้าให้ผู้สัมภาษณ์ดูได้โดยไม่ต้องนำไปเผยแพร่สาธารณะ</p>"
    }
  },
  {
    id: "v03",
    title: { en: "[Experiment / Deep-dive]", th: "[บันทึกการทดลองเชิงลึก]" },
    type: "// add more anytime — DB-driven",
    desc: {
      en: ["The vault is backed by a database, so I can keep adding hidden projects forever. Each new row automatically shows a teaser card out here on the public page.", "This card is the pattern: preview in public, full thing behind auth."],
      th: ["คลังข้อมูลนี้เชื่อมต่อกับฐานข้อมูล ผมสามารถเพิ่มโปรเจกต์ลับใหม่ๆ เข้ามาได้ตลอดเวลา ข้อมูลใหม่จะแสดงเป็นกล่องตัวอย่างในหน้านี้อัตโนมัติ", "นี่คือรูปแบบการนำเสนอ: โชว์ตัวอย่างในพื้นที่สาธารณะ และเก็บรายละเอียดตัวเต็มไว้หลังระบบล็อกอิน"]
    },
    stageBig: "🧪",
    stageCap: { 
      en: "[ Each new vault row becomes its own page automatically ]", 
      th: "[ ข้อมูลใหม่ในฐานข้อมูลจะสร้างหน้าแสดงผลของตัวเองอัตโนมัติ ]" 
    },
    notes: {
      en: "<h3>The pattern</h3><p>The vault is backed by a database. Each row renders a teaser card on the public page and a full protected page here — add projects forever without touching code.</p>",
      th: "<h3>รูปแบบการทำงาน</h3><p>คลังข้อมูลเชื่อมต่อกับฐานข้อมูล ทุกเรคคอร์ดจะสร้างกล่องตัวอย่างในหน้าสาธารณะและหน้าป้องกันในส่วนนี้ — เพิ่มโปรเจกต์ได้เรื่อยๆ โดยไม่ต้องแก้โค้ด</p>"
    }
  }
];

export default function Vault() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // 📌 State สำหรับฟอร์ม
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // สำหรับสมัครสมาชิก
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // 📌 State สลับโหมด (ล็อกอิน <-> สมัครสมาชิก)
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const savedSession = sessionStorage.getItem("vault_session");
      if (savedSession === "active") setIsUnlocked(true);
    }, 10);

    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener("openVaultAuthModal", handleOpenAuth);

    const handleAuthStateChanged = () => {
      const savedSession = sessionStorage.getItem("vault_session");
      setIsUnlocked(savedSession === "active");
    };
    window.addEventListener("authStateChanged", handleAuthStateChanged);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("openVaultAuthModal", handleOpenAuth);
      window.removeEventListener("authStateChanged", handleAuthStateChanged);
    };
  }, []);

  useEffect(() => {
    if (isAuthOpen || activeProjectId) {
      window.history.pushState({ vaultModal: true }, "");
    }
  }, [isAuthOpen, activeProjectId]);

  useEffect(() => {
    const handlePopState = () => {
      if (activeProjectId) setActiveProjectId(null);
      if (isAuthOpen) setIsAuthOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeProjectId, isAuthOpen]);

  const handleCloseModal = () => {
    if (window.history.state?.vaultModal) {
      window.history.back(); 
    } else {
      setActiveProjectId(null);
      setIsAuthOpen(false);
    }
    // เคลียร์ฟอร์ม
    setErrorMsg("");
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsRegisterMode(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (isAuthOpen || activeProjectId)) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthOpen, activeProjectId]);

  useEffect(() => {
    if (isAuthOpen || activeProjectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isAuthOpen, activeProjectId]);

  const handleCardClick = (id: string) => {
    if (isUnlocked) setActiveProjectId(id);
    else setIsAuthOpen(true);
  };

  // 📌 ฟังก์ชันจัดการทั้ง สมัครสมาชิก และ ล็อกอิน
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // เช็ครหัสผ่านให้ตรงกันในโหมดสมัครสมาชิก
    if (isRegisterMode && password !== confirmPassword) {
      setErrorMsg(language === "en" ? "Passwords do not match." : "รหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }

    try {
      // 📌 แยก API ตามโหมด (Login หรือ Register)
      const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }) // ใช้ email เป็น username
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegisterMode) {
          // ถ้าสมัครสำเร็จ ให้สลับกลับมาหน้า Login
          setSuccessMsg(language === "en" ? "Account created! Please sign in." : "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
          setIsRegisterMode(false);
          setPassword("");
          setConfirmPassword("");
        } else {
          // ถ้าล็อกอินสำเร็จ
          setIsUnlocked(true);
          sessionStorage.setItem("vault_session", "active");
          window.dispatchEvent(new Event("authStateChanged"));
          handleCloseModal(); 
        }
      } else {
        setErrorMsg(data.error || "Authentication failed.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 📌 โครงสร้างเตรียมพร้อมสำหรับเชื่อมต่อ Google / GitHub OAuth (Supabase)
  const handleOAuthClick = (provider: string) => {
    // โค้ดสำหรับอนาคต: await supabase.auth.signInWithOAuth({ provider: 'github' })
    setErrorMsg(
      language === "en" 
        ? `${provider} OAuth integration requires Supabase config. Please use email.` 
        : `ระบบล็อกอินด้วย ${provider} ต้องตั้งค่า API Key ก่อน กรุณาใช้อีเมล`
    );
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem("vault_session");
    window.dispatchEvent(new Event("authStateChanged"));
    handleCloseModal(); 
  };

  const activeProject = VAULT_PROJECTS.find(p => p.id === activeProjectId);

  const renderModals = () => {
    if (!mounted) return null;

    return createPortal(
      <>
        {/* ===================== AUTH MODAL ===================== */}
        <div 
          className={`fixed inset-0 bg-black/65 backdrop-blur-[4px] flex items-center justify-center p-5 transition-all duration-250 ${isAuthOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          style={{ zIndex: 99998 }}
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className={`w-full max-w-[380px] bg-[var(--bg-panel)] border border-[var(--edge)] rounded-lg p-[30px] relative transition-transform duration-250 ${isAuthOpen ? "translate-y-0" : "translate-y-3.5"}`}>
            <button onClick={handleCloseModal} className="absolute top-4 right-[18px] bg-transparent border-none text-[var(--text-dim)] text-[1.3rem] cursor-pointer leading-none hover:text-[var(--accent)]">×</button>
            
            <h3 className="text-[1.25rem] font-bold mb-1 flex items-center">
              {isRegisterMode 
                ? (language === "en" ? "Create Account" : "สมัครสมาชิก") 
                : (language === "en" ? "Sign in" : "เข้าสู่ระบบ")} 
              <span className="ml-2 font-mono text-[0.66rem] text-[var(--accent-3)] border border-[var(--accent-3)] rounded-[3px] py-[2px] px-[7px]">SECURE</span>
            </h3>
            
            <p className="text-[var(--text-dim)] text-[0.85rem] mb-5">
              {isRegisterMode 
                ? (language === "en" ? "Register to access secured case studies." : "สมัครสมาชิกเพื่อเข้าถึงข้อมูลระดับสูง") 
                : (language === "en" ? "Unlock the vault. Authenticating with secure HttpOnly cookies." : "เข้าสู่ระบบเพื่อปลดล็อค ยืนยันตัวตนผ่าน HttpOnly Cookie")}
            </p>

            <form onSubmit={handleAuthSubmit}>
              {/* 📌 ปุ่ม OAuth สำหรับอนาคต */}
              <div className="flex gap-2.5 mb-4">
                <button type="button" onClick={() => handleOAuthClick("GitHub")} className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text)] rounded-[var(--radius)] p-2.5 font-mono text-[0.78rem] cursor-pointer transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  ◐ GitHub
                </button>
                <button type="button" onClick={() => handleOAuthClick("Google")} className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text)] rounded-[var(--radius)] p-2.5 font-mono text-[0.78rem] cursor-pointer transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  G Google
                </button>
              </div>
              
              <div className="text-center text-[var(--text-faint)] font-mono text-[0.72rem] my-3.5 relative">— or —</div>
              
              {/* ข้อความแจ้งเตือน */}
              {errorMsg && (
                <div className="mb-4 p-2 bg-[rgba(255,95,87,0.1)] border border-[var(--danger)] text-[var(--danger)] text-[0.75rem] font-mono rounded text-center">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-2 bg-[rgba(40,200,64,0.1)] border border-[var(--good)] text-[var(--good)] text-[0.75rem] font-mono rounded text-center">
                  {successMsg}
                </div>
              )}

              <div className="mb-3.5">
                <label className="block font-mono text-[0.72rem] text-[var(--text-dim)] mb-1.5">email</label>
                <input 
                  type="email" 
                  placeholder="you@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded-[var(--radius)] py-2.5 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:border-[var(--accent)]" 
                />
              </div>

              <div className="mb-4">
                <label className="block font-mono text-[0.72rem] text-[var(--text-dim)] mb-1.5">password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded-[var(--radius)] py-2.5 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:border-[var(--accent)]" 
                />
              </div>

              {/* 📌 ช่องยืนยันรหัสผ่าน (แสดงเฉพาะตอนสมัครสมาชิก) */}
              {isRegisterMode && (
                <div className="mb-4">
                  <label className="block font-mono text-[0.72rem] text-[var(--text-dim)] mb-1.5">confirm password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded-[var(--radius)] py-2.5 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:border-[var(--accent)]" 
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center items-center font-mono text-[0.85rem] font-medium tracking-wide py-3 px-6 rounded-[var(--radius)] transition-all ${isLoading ? 'bg-[var(--text-faint)] cursor-not-allowed' : 'bg-[var(--accent)] text-white hover:-translate-y-1 hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)]'}`}
              >
                {isLoading 
                  ? (language === "en" ? "Processing..." : "กำลังดำเนินการ...") 
                  : (isRegisterMode 
                      ? (language === "en" ? "Sign Up →" : "ยืนยันการสมัคร →")
                      : (language === "en" ? "Unlock vault →" : "ปลดล็อคคลังข้อมูล →")
                    )
                }
              </button>
            </form>

            {/* 📌 ปุ่มสลับโหมด Login / Register */}
            <div className="mt-5 text-center font-mono text-[0.75rem]">
              <span className="text-[var(--text-faint)]">
                {isRegisterMode 
                  ? (language === "en" ? "Already have an account? " : "มีบัญชีอยู่แล้ว? ")
                  : (language === "en" ? "Need an account? " : "ยังไม่มีบัญชีใช่ไหม? ")}
              </span>
              <button 
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-[var(--accent)] hover:underline border-none bg-transparent cursor-pointer"
              >
                {isRegisterMode 
                  ? (language === "en" ? "Sign in" : "เข้าสู่ระบบ")
                  : (language === "en" ? "Sign up" : "สมัครสมาชิก")}
              </button>
            </div>

          </div>
        </div>

        {/* ===================== VAULT DETAIL PAGE ===================== */}
        <div 
          className={`fixed inset-0 bg-[var(--bg)] overflow-y-auto transition-all duration-300 ${activeProject ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-2.5"}`}
          style={{ zIndex: 99997 }} 
        >
          <div 
            className="sticky top-0 w-full flex items-center justify-between py-4 px-6 bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-xl border-b border-[var(--edge)] shadow-sm"
            style={{ zIndex: 99999 }} 
          >
            <button 
              onClick={handleCloseModal} 
              className="flex items-center gap-2 font-mono text-[0.85rem] font-bold cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] rounded-[var(--radius)] text-[var(--text)] py-2 px-4 transition-all hover:text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-md"
            >
              <span className="text-[1.2rem] leading-none">←</span> 
              {language === "en" ? "BACK TO VAULT" : "กลับไปที่คลังข้อมูล"}
            </button>
            
            <span className="font-mono text-[0.74rem] text-[var(--text-faint)] hidden sm:block">
              {"// vault / "}<b className="text-[var(--accent)]">{activeProject?.id}</b>
            </span>
            
            <button onClick={handleLogout} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-2 px-4 rounded-[var(--radius)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]">
              ⏻ {language === "en" ? "LOG OUT" : "ออกจากระบบ"}
            </button>
          </div>

          {activeProject && (
            <div className="max-w-[1180px] mx-auto py-12 px-6 pb-20 mt-4 relative" style={{ zIndex: 99998 }}>
              <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 mb-3.5 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
                {language === "en" ? "MEMBERS AREA" : "พื้นที่เฉพาะสมาชิก"}
              </span>
              <h1 className="text-[clamp(1.9rem,4vw,3rem)] font-bold tracking-tight mb-2.5 leading-tight">{activeProject.title[language]}</h1>
              <div className="font-mono text-[0.85rem] text-[var(--accent-2)] mb-7">{activeProject.type}</div>
              
              <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] min-h-[340px] flex flex-col items-center justify-center gap-3.5 text-center p-10 mb-7 shadow-sm">
                <div className="text-[2.4rem]">{activeProject.stageBig}</div>
                <div className="font-mono text-[0.8rem] text-[var(--text-dim)] max-w-[460px]">{activeProject.stageCap[language]}</div>
              </div>

              <div 
                className="text-[var(--text-dim)] max-w-[680px] leading-relaxed [&>h3]:text-[1.1rem] [&>h3]:text-[var(--text)] [&>h3]:mt-5 [&>h3]:mb-2 [&>p]:mb-4"
                dangerouslySetInnerHTML={{ __html: activeProject.notes[language] }} 
              />
            </div>
          )}
        </div>
      </>,
      document.body
    );
  };

  return (
    <>
      <section id="vault" className="py-20 relative scroll-mt-10">
        <div className="max-w-[1180px] mx-auto w-full">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
              {language === "en" ? "members area · access control" : "พื้นที่สมาชิก · ระบบควบคุมการเข้าถึง"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-3 leading-[1.05]">
              {language === "en" ? "The vault — sign in to unlock" : "คลังข้อมูลลับ — ลงชื่อเข้าใช้เพื่อปลดล็อค"}
            </h2>
            <p className="text-[var(--text-dim)]">
              {language === "en" 
                ? <>The work above is the public preview. The full case studies, source, and my interactive <b>3D experiments</b> live behind auth — partly because some are unfinished, but mostly because this whole section <i>is</i> a demo: real <b>authentication</b> + <b>protected routes</b>. New projects get added here over time; each one auto-shows a teaser out here.</>
                : <>ผลงานด้านบนคือพรีวิวสาธารณะ กรณีศึกษาฉบับเต็ม, ซอร์สโค้ด และ <b>โปรเจกต์ทดลอง 3D</b> จะถูกเก็บไว้หลังระบบล็อกอิน — เหตุผลส่วนหนึ่งเพราะบางอันยังไม่เสร็จสมบูรณ์ แต่เหตุผลหลักคือพื้นที่ส่วนนี้ <i>คือ</i> การเดโม่ระบบ <b>Authentication</b> + <b>Protected routes</b> ของจริง</>}
            </p>
          </div>

          <div className="vault-container">
            <div className="font-mono text-[0.74rem] text-[var(--text-dim)] mb-5 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full border bg-[var(--bg-panel)] transition-colors ${isUnlocked ? "border-[var(--good)] text-[var(--good)]" : "border-[var(--edge)]"}`}>
                {isUnlocked ? "🔓 unlocked" : "🔒 locked"}
              </span>
              <span>
                {language === "en" 
                  ? (isUnlocked ? "welcome back · click a card to open it" : "3 hidden projects · sign in to view")
                  : (isUnlocked ? "ยินดีต้อนรับกลับ · คลิกที่กล่องเพื่อเปิดอ่าน" : "ซ่อนอยู่ 3 โปรเจกต์ · ลงชื่อเข้าใช้เพื่อดูเนื้อหา")}
              </span>
              {isUnlocked && (
                <button onClick={handleLogout} className="ml-auto font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-1.5 px-3 rounded-[var(--radius)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]">
                  ⏻ {language === "en" ? "log out" : "ออกจากระบบ"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              {VAULT_PROJECTS.map((proj) => (
                <article 
                  key={proj.id} 
                  onClick={() => handleCardClick(proj.id)}
                  className={`relative border border-[var(--edge)] rounded-md bg-[var(--bg-panel)] p-6 overflow-hidden min-h-[190px] transition-all duration-200 cursor-pointer group ${isUnlocked ? "hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--edge))] hover:-translate-y-1" : ""}`}
                >
                  <div className="flex items-center justify-between font-mono text-[0.72rem] text-[var(--text-faint)] tracking-[0.08em]">
                    <span>VAULT_{proj.id.replace('v', '')}</span>
                    <span className={isUnlocked ? "text-[var(--text-dim)]" : "text-[var(--accent-3)]"}>{isUnlocked ? "🔓" : "🔒"}</span>
                  </div>
                  <h3 className="text-[1.15rem] font-semibold mt-2.5 mb-1.5">{proj.title[language]}</h3>
                  <div className="font-mono text-[0.72rem] text-[var(--accent-2)]">{proj.type}</div>
                  
                  <div className={`mt-3 transition-all duration-500 ${isUnlocked ? "filter-none opacity-100" : "blur-[4px] opacity-55 select-none"}`}>
                    <p className="text-[var(--text-dim)] text-[0.9rem] mb-2">{proj.desc[language][0]}</p>
                    <p className="text-[var(--text-dim)] text-[0.9rem] mb-2">{proj.desc[language][1]}</p>
                  </div>

                  {!isUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--bg-panel)_55%,transparent),var(--bg-panel)_80%)] font-mono transition-opacity duration-400">
                      <div className="text-[1.6rem]">🔒</div>
                      <div className="text-[0.78rem] text-[var(--text-dim)]">members only</div>
                      <button className="font-mono text-[0.78rem] bg-[var(--accent)] text-white border-none rounded-[var(--radius)] py-[9px] px-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--accent)_40%,transparent)]">
                        {language === "en" ? "Sign in to unlock" : "ลงชื่อเข้าใช้เพื่อปลดล็อค"}
                      </button>
                    </div>
                  )}

                  {isUnlocked && (
                    <div className="absolute bottom-3.5 right-4 font-mono text-[0.7rem] text-[var(--accent-2)] opacity-0 group-hover:opacity-100 transition-opacity">
                      open ↗
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {renderModals()}
    </>
  );
}