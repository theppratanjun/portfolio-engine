"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import dynamic from "next/dynamic"; 

// 📌 โหลด Component ย่อยแบบ Lazy Loading
const WitchGameBuild = dynamic(() => import("./vault-projects/WitchGameBuild"), {
  loading: () => <div className="p-10 text-center font-mono text-[var(--text-dim)]">Loading Component Data...</div>,
  ssr: false 
});

// 📌 โครงสร้างข้อมูลสำหรับแสดงหน้าไพ่สาธารณะ (Public Cards)
const VAULT_PROJECTS = [
  {
    id: "v01",
    // 📌 เปลี่ยนหัวข้อเป็น YouTube และ AI Content
    title: { en: "AI Content & YouTube Channels", th: "ผลงานวิดีโอ AI & คอนเทนต์" },
    type: "// Video Editing · Generative AI · YouTube",
    desc: {
      en: ["Creator of 'YarkRooMai' and 'InfinitySound365' channels. Producing high-quality videos and audio tracks using Generative AI tools.", "Showcasing multimedia generation, long-format video editing, and content optimization workflows."],
      th: ["ผู้สร้างช่อง 'YarkRooMai' และ 'InfinitySound365' ผลิตวิดีโอและแทร็กเสียงคุณภาพสูงด้วยเครื่องมือ Generative AI", "แสดงทักษะการสร้างสื่อมัลติมีเดีย, ตัดต่อวิดีโอความยาวหลายชั่วโมง และปรับแต่งคอนเทนต์"]
    },
    stageBig: "🎬",
    stageCap: { 
      en: "[ Multimedia showcase — Custom AI-generated video and audio workflows ]", 
      th: "[ พื้นที่แสดงผลงานมัลติมีเดีย — กระบวนการผลิตวิดีโอและเสียงด้วย AI ]" 
    }
  },
  {
    id: "v02",
    title: { en: "Witch 2.5D RPG (Web Build)", th: "ตัวเกม Witch 2.5D RPG" },
    type: "// Unity · WebGL · Active Development",
    desc: {
      en: ["An early build of my Witch 2.5D game — playable, but actively being updated.", "Shows gameplay systems, state management, and WebGL optimization."],
      th: ["ตัวเกมเวอร์ชันทดสอบที่กำลังพัฒนา — สามารถเล่นได้และมีการอัปเดตแพตช์อยู่เรื่อยๆ", "แสดงระบบเกมเพลย์, การจัดการสถานะ, และการปรับแต่งประสิทธิภาพ WebGL"]
    },
    stageBig: "🎮",
    stageCap: { 
      en: "[ Loading WitchGameBuild Component... ]", 
      th: "[ กำลังตรวจสอบสิทธิ์และโหลด Component: WitchGameBuild... ]" 
    }
  },
  {
    id: "v03",
    title: { en: "Coffee Shop Web App", th: "ระบบจัดการร้านกาแฟ (E-Commerce)" },
    type: "// Next.js · Prisma · Planned Sprint",
    desc: {
      en: ["A full-stack e-commerce simulation for a coffee shop. Features cart, checkout, and inventory.", "Scheduled for future release (Coming Soon...)."],
      th: ["ระบบจำลอง E-commerce สำหรับร้านกาแฟ มีระบบตะกร้าสินค้า การชำระเงิน และตัดสต๊อก", "เตรียมเปิดตัวในเร็วๆ นี้ (Coming Soon...)"]
    },
    stageBig: "☕",
    stageCap: { 
      en: "[ CoffeeShopApp Component scheduled for deployment ]", 
      th: "[ เตรียมอัปเดต CoffeeShopApp ลงในพื้นที่นี้ใน Sprint ถัดไป ]" 
    }
  }
];

export default function Vault() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
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
      
      if (savedSession !== "active") {
        setActiveProjectId(null);
        setIsAuthOpen(false);
      }
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (isRegisterMode && password !== confirmPassword) {
      setErrorMsg(language === "en" ? "Passwords do not match." : "รหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }) 
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegisterMode) {
          setSuccessMsg(language === "en" ? "Account created! Please sign in." : "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
          setIsRegisterMode(false);
          setPassword("");
          setConfirmPassword("");
        } else {
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

  const handleOAuthClick = (provider: string) => {
    setErrorMsg(
      language === "en" 
        ? `${provider} OAuth integration requires Supabase config. Please use email.` 
        : `ระบบล็อกอินด้วย ${provider} ต้องตั้งค่า API Key ก่อน กรุณาใช้อีเมล`
    );
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
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
                : (language === "en" ? "Unlock the vault. Authenticating with secure HttpOnly cookies." : "เข้าสู่ระบบเพื่อปลดล็อก สิทธิ์ เข้าใช้งานระบบ")}
            </p>

            <form onSubmit={handleAuthSubmit}>
              <div className="flex gap-2.5 mb-4">
                <button type="button" onClick={() => handleOAuthClick("GitHub")} className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text)] rounded-[var(--radius)] p-2.5 font-mono text-[0.78rem] cursor-pointer transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  ◐ GitHub
                </button>
                <button type="button" onClick={() => handleOAuthClick("Google")} className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text)] rounded-[var(--radius)] p-2.5 font-mono text-[0.78rem] cursor-pointer transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  G Google
                </button>
              </div>
              
              <div className="text-center text-[var(--text-faint)] font-mono text-[0.72rem] my-3.5 relative">— or —</div>
              
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

        {/* ===================== VAULT DETAIL PAGE (Modular Architecture) ===================== */}
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
            
            <div className="flex items-center gap-2">
              <button onClick={() => window.dispatchEvent(new Event("openAccountSettings"))} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-2 px-4 rounded-[var(--radius)] transition-all hover:text-[var(--text)] hover:border-[var(--text-dim)]">
                ⚙️ {language === "en" ? "SETTINGS" : "ตั้งค่า"}
              </button>
              <button onClick={handleLogout} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-2 px-4 rounded-[var(--radius)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]">
                ⏻ {language === "en" ? "LOG OUT" : "ออกจากระบบ"}
              </button>
            </div>
          </div>

          {activeProject && (
            <div className="max-w-[1180px] mx-auto py-12 px-6 pb-20 mt-4 relative" style={{ zIndex: 99998 }}>
              <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 mb-3.5 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
                {language === "en" ? "MEMBERS AREA" : "พื้นที่เฉพาะสมาชิก"}
              </span>
              <h1 className="text-[clamp(1.9rem,4vw,3rem)] font-bold tracking-tight mb-2.5 leading-tight">{activeProject.title[language]}</h1>
              <div className="font-mono text-[0.85rem] text-[var(--accent-2)] mb-7">{activeProject.type}</div>
              
              {/* 📌 หน้าจอจำลองที่กำลังเตรียมโหลดข้อมูล */}
              <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] min-h-[340px] flex flex-col items-center justify-center gap-3.5 text-center p-10 mb-7 shadow-sm">
                <div className="text-[2.4rem]">{activeProject.stageBig}</div>
                <div className="font-mono text-[0.8rem] text-[var(--text-dim)] max-w-[460px]">{activeProject.stageCap[language]}</div>
              </div>

              {/* 📌 Dynamic Component Rendering */}
              <div className="mt-10">
                {/* 📌 ส่วนแสดงผลงานสำหรับ V01 (YouTube Channels) */}
                {activeProjectId === "v01" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Channel 1 */}
                    <div className="p-6 border border-[var(--edge)] rounded bg-[var(--bg-panel-2)] text-left flex flex-col">
                      <h3 className="font-mono text-[1.1rem] text-[var(--text)] font-bold mb-3">🎬 YarkRooMai</h3>
                      <p className="font-mono text-[0.8rem] text-[var(--text-dim)] mb-6 flex-1">
                        {language === "en" 
                          ? "Content focusing on narrative storytelling and AI-generated visuals. Leveraging tools like Midjourney, Runway, and CapCut to optimize workflow." 
                          : "ช่องคอนเทนต์เน้นการเล่าเรื่องพร้อมภาพประกอบจาก AI ประยุกต์ใช้เครื่องมือสร้างภาพและตัดต่อด้วย CapCut แบบครบวงจร"}
                      </p>
                      <a 
                        href="https://www.youtube.com/@YarkRooMai" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-[#FF0000] text-white font-mono text-[0.8rem] py-3 rounded text-center transition-all hover:brightness-110 font-bold tracking-wide"
                      >
                        YouTube ↗
                      </a>
                    </div>

                    {/* Channel 2 */}
                    <div className="p-6 border border-[var(--edge)] rounded bg-[var(--bg-panel-2)] text-left flex flex-col">
                      <h3 className="font-mono text-[1.1rem] text-[var(--text)] font-bold mb-3">🎧 InfinitySound365</h3>
                      <p className="font-mono text-[0.8rem] text-[var(--text-dim)] mb-6 flex-1">
                        {language === "en" 
                          ? "A channel dedicated to audio experiences, utilizing AI audio generation tools (like Suno/Whisk) combined with long-format video editing techniques." 
                          : "ช่องสำหรับการฟังเสียง มุ่งเน้นการสร้างเสียงดนตรีและบรรยากาศด้วย AI (เช่น Suno/Whisk) ควบคู่กับการประมวลผลวิดีโอความยาวหลายชั่วโมง"}
                      </p>
                      <a 
                        href="https://www.youtube.com/@InfinitySound365" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-[#FF0000] text-white font-mono text-[0.8rem] py-3 rounded text-center transition-all hover:brightness-110 font-bold tracking-wide"
                      >
                        YouTube ↗
                      </a>
                    </div>
                  </div>
                )}

                {activeProjectId === "v02" && (
                  <div className="w-full">
                    <WitchGameBuild />
                  </div>
                )}

                {activeProjectId === "v03" && (
                  <div className="p-10 border border-dashed border-[var(--edge)] rounded bg-[var(--bg-panel-2)] text-center flex flex-col items-center justify-center min-h-[200px]">
                    <div className="text-3xl mb-3 animate-pulse opacity-80">🚧</div>
                    <h3 className="font-mono text-lg text-[var(--text)] font-bold mb-2">Module Scheduled for Deployment</h3>
                    <p className="font-mono text-[0.8rem] text-[var(--text-dim)] max-w-md">
                      {language === "en" ? "The E-Commerce module is scheduled for the next sprint. Coming soon!" : "โมดูล E-Commerce ถูกวางแผนไว้ใน Sprint ถัดไป กำลังเตรียมพร้อมสำหรับการติดตั้ง!"}
                    </p>
                  </div>
                )}
              </div>

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
            
            <p className="text-[var(--text-dim)] leading-relaxed">
              {language === "en" 
                ? <>The items above are for public display only. Full projects, source code, and works-in-progress are locked behind the authentication wall. This area is purpose-built to showcase secure user authentication and <b>protected routes</b>.</>
                : <>ผลงานด้านบนเป็นเพียงส่วนที่จัดแสดงสาธารณะ โปรเจกต์ตัวเต็ม, ซอร์สโค้ด, และผลงานที่กำลังอยู่ระหว่างการพัฒนา จะถูกป้องกันไว้หลังระบบล็อกอิน — พื้นที่ส่วนนี้ถูกออกแบบมาโดยเฉพาะเพื่อสาธิตระบบ <b>Authentication</b> ที่ปลอดภัยและการทำ <b>Protected routes</b></>}
            </p>
          </div>

          <div className="vault-container">
            <div className="font-mono text-[0.74rem] text-[var(--text-dim)] mb-5 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full border bg-[var(--bg-panel)] transition-colors ${isUnlocked ? "border-[var(--good)] text-[var(--good)]" : "border-[var(--edge)]"}`}>
                {isUnlocked ? "🔓 unlocked" : "🔒 locked"}
              </span>
              <span>
                {language === "en" 
                  ? (isUnlocked ? "welcome back · click a card to open it" : "hidden projects & works-in-progress · sign in to view")
                  : (isUnlocked ? "ยินดีต้อนรับกลับ · คลิกที่กล่องเพื่อเปิดดูโปรเจกต์" : "ผลงานที่ถูกซ่อน & โปรเจกต์ที่กำลังพัฒนา · ลงชื่อเข้าใช้เพื่อดูเนื้อหา")}
              </span>
              {isUnlocked && (
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => window.dispatchEvent(new Event("openAccountSettings"))} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-1.5 px-3 rounded-[var(--radius)] transition-all hover:text-[var(--text)] hover:border-[var(--text-dim)]">
                    ⚙️ {language === "en" ? "settings" : "ตั้งค่า"}
                  </button>
                  <button onClick={handleLogout} className="font-mono text-[0.72rem] cursor-pointer bg-[var(--bg-panel)] border border-[var(--edge)] text-[var(--text-dim)] py-1.5 px-3 rounded-[var(--radius)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]">
                    ⏻ {language === "en" ? "log out" : "ออกจากระบบ"}
                  </button>
                </div>
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