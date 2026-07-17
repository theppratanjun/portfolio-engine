// src/components/Vault.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 📌 เก็บ Component ไว้เผื่ออนาคตกลับมาใช้
const WitchGameBuild = dynamic(() => import("./vault-projects/WitchGameBuild"), {
  loading: () => <div className="p-10 text-center font-mono text-[var(--text-dim)]">Loading Component Data...</div>,
  ssr: false 
});

// 📌 แทรกบรรทัดนี้เพิ่มเข้าไปเพื่อดึงไฟล์ VR มาใช้งาน
const VrAssemblyBuild = dynamic(() => import("./vault-projects/VrAssemblyBuild"), {
  loading: () => <div className="p-10 text-center font-mono text-[var(--text-dim)]">Loading Component Data...</div>,
  ssr: false 
});

const VAULT_PROJECTS = [
  {
    id: "v01",
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
    title: { en: "VR Motorcycle Assembly", th: "ระบบจำลองการประกอบรถมอเตอร์ไซค์ (VR)" },
    type: "// Unity · VR (Meta Quest) · Web Dashboard",
    desc: {
      en: ["A Virtual Reality simulation for learning how to assemble and disassemble motorcycles.", "Includes a connected web dashboard for user management, real-time analytics, and progress tracking."],
      th: ["ระบบจำลองเสมือนจริง (VR) สำหรับฝึกการถอดประกอบชิ้นส่วนรถมอเตอร์ไซค์", "มาพร้อมระบบ Web Dashboard สำหรับผู้ดูแล เพื่อจัดการผู้ใช้และดูสถิติความคืบหน้าแบบเรียลไทม์"]
    },
    stageBig: "🥽",
    stageCap: {
      en: "[ Loading VrAssemblyBuild Component... ]",
      th: "[ กำลังโหลด Component: VrAssemblyBuild... ]"
    }
  },
  {
    id: "v04",
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
  // 📌 State สำหรับระบบ Idle Timeout (5 นาที)
  const [isIdleWarningOpen, setIsIdleWarningOpen] = useState(false);
  const [idleCountdown, setIdleCountdown] = useState(30);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isUnlocked) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      return;
    }

    //หลักการคำนวณคือ: เวลารอให้ป๊อปอัปเด้ง (IDLE_LIMIT) + เวลานับถอยหลัง (COUNTDOWN_SECONDS) = เวลาเตะออกรวมทั้งหมด
    // // เปลี่ยนจาก 4.5 * 60 * 1000 เป็นตัวเลขมิลลิวินาทีของ 4 นาที 20 วินาที
    // const IDLE_LIMIT = 260000; // (4 นาที 20 วินาที = 260,000 ms)
    // const COUNTDOWN_SECONDS = 40; // นับถอยหลัง 40 วิ (รวมเป็น 5 นาทีเป๊ะ)

    // 📌 ตั้งค่าสำหรับทดสอบ: เตะออกใน 1 นาที (ป๊อปอัปเด้งตอน 30 วิ)
    const IDLE_LIMIT = 30000; // รอ 30 วินาที (30,000 มิลลิวินาที) ให้ป๊อปอัปเด้ง
    const COUNTDOWN_SECONDS = 30; // ให้นับถอยหลังอีก 30 วินาที (รวมเป็น 60 วินาทีเป๊ะ)

    const resetIdleTimer = () => {
      if (isIdleWarningOpen) return; // ถ้าเตือนอยู่ บังคับให้ต้องกดปุ่มเท่านั้น
      
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdleWarningOpen(true);
        setIdleCountdown(COUNTDOWN_SECONDS);
      }, IDLE_LIMIT);
    };

    // ตรวจจับทุกการกระทำของผู้ใช้
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isUnlocked, isIdleWarningOpen]);

  // 📌 ระบบนับถอยหลังตอนป๊อปอัปเด้ง
  useEffect(() => {
    if (isIdleWarningOpen) {
      countdownTimerRef.current = setInterval(() => {
        setIdleCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            window.dispatchEvent(new Event("triggerVaultLogout"));
            setIsIdleWarningOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isIdleWarningOpen]);

  const handleStayLoggedIn = () => {
    setIsIdleWarningOpen(false);
    // แอบยิงไปบอกหลังบ้านว่ายังอยู่ เพื่อต่ออายุ Cookie เงียบๆ
    fetch("/api/user/settings").catch(() => {});
  };

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true);
      
      const savedScroll = localStorage.getItem("oauth_return_scroll");
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10)); 
        localStorage.removeItem("oauth_return_scroll"); 
      }
    }, 150); 
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const syncRes = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email
            })
          });

          if (!syncRes.ok) {
            const errData = await syncRes.json();
            throw new Error(errData.error || "Backend Sync Failed");
          }

          const pendingScore = localStorage.getItem("pending_score");
          const pendingPlayer = localStorage.getItem("pending_player");

          if (pendingScore) {
            const scoreRes = await fetch("/api/leaderboard", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                playerName: pendingPlayer || "HR_Guest", 
                score: parseInt(pendingScore, 10) 
              })
            });

            if (scoreRes.ok) {
              localStorage.removeItem("pending_score");
              localStorage.removeItem("pending_player");
            } else {
              console.error("Failed to auto-save score to backend.");
            }
          }

          sessionStorage.setItem("vault_session", "active");
          setIsUnlocked(true);
          setIsAuthOpen(false);
          window.dispatchEvent(new Event("authStateChanged"));
          
        } catch (error: unknown) {
          console.error("Auth Sync Error:", error);
          await supabase.auth.signOut();
          sessionStorage.removeItem("vault_session");
          setIsUnlocked(false);
          
          if (error instanceof Error) {
            setErrorMsg(language === "en" ? `Authentication Error: ${error.message}` : `การซิงค์ข้อมูลล้มเหลว: ${error.message}`);
          }
        }
      } else if (event === "SIGNED_OUT") {
        await fetch("/api/auth/logout", { method: "POST" });
        sessionStorage.removeItem("vault_session");
        setIsUnlocked(false);
        window.dispatchEvent(new Event("authStateChanged"));
      }
    });

    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener("openVaultAuthModal", handleOpenAuth);

    const doMasterLogout = async () => {
      await fetch("/api/auth/logout", { method: "POST" }); 
      await supabase.auth.signOut(); 
      sessionStorage.removeItem("vault_session"); 
      setIsUnlocked(false);
      setIsIdleWarningOpen(false); // 📌 ย้ายมาสั่งปิดป๊อปอัปตรงนี้แทน!
      window.dispatchEvent(new Event("authStateChanged"));
    };
    window.addEventListener("triggerVaultLogout", doMasterLogout);

    const checkSession = async () => {
      const isSessionActive = sessionStorage.getItem("vault_session") === "active";
      
      // 📌 ตรวจจับเพิ่ม: ถ้ากำลัง "Redirect กลับมา" จากการล็อกอินผ่าน GitHub/Google
      const isOAuthCallback = window.location.hash.includes("access_token") || window.location.search.includes("code=");

      if (!isSessionActive && !isOAuthCallback) {
        // 🚨 1. ปิดแท็บไปแล้วเปิดใหม่ หรือปิดเบราว์เซอร์ (ความจำหายไป) -> เตะออก 100%
        await doMasterLogout();
      } else if (isSessionActive) {
        // 🔄 2. การกด F5 รีเฟรชหน้าเว็บ (sessionStorage ยังอยู่)
        try {
          // ยิงไปถาม API ของเราแทนว่า Cookie ยังอยู่ดีไหม (รองรับทั้ง Email และ OAuth)
          const res = await fetch("/api/user/settings");
          if (res.ok) {
            // ✅ คุกกี้ยังอยู่ ปลดล็อกหน้าเว็บได้เลย
            setIsUnlocked(true);
            
            // แอบต่ออายุให้บัญชีกลุ่ม OAuth แบบเงียบๆ เบื้องหลัง
            const { data: { session } } = await supabase.auth.getSession();
            if (session) supabase.auth.refreshSession();
          } else {
            // ❌ คุกกี้หมดอายุ หรือโดนลบไปแล้ว
            await doMasterLogout();
          }
        } catch (error) {
          console.error("Session check error", error);
        }
      }
    };
    checkSession();

    const handleAuthStateChanged = () => {
      const savedSession = sessionStorage.getItem("vault_session");
      setIsUnlocked(savedSession === "active");
      if (savedSession !== "active") {
        setActiveProjectId(null);
        setIsAuthOpen(false);
        setIsIdleWarningOpen(false); // 📌 และสั่งปิดเผื่อไว้ตรงนี้ด้วย
      }
    };
    window.addEventListener("authStateChanged", handleAuthStateChanged);
    
    return () => {
      clearTimeout(mountTimer);
      authListener.subscription.unsubscribe();
      window.removeEventListener("openVaultAuthModal", handleOpenAuth);
      window.removeEventListener("triggerVaultLogout", doMasterLogout);
      window.removeEventListener("authStateChanged", handleAuthStateChanged);
    };
  }, []);

  useEffect(() => {
    if (isAuthOpen || activeProjectId) {
      window.history.pushState({ vaultModal: true }, "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
          const pendingScore = localStorage.getItem("pending_score");
          const pendingPlayer = localStorage.getItem("pending_player");
          
          if (pendingScore) {
            await fetch("/api/leaderboard", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                playerName: pendingPlayer || "HR_Guest", 
                score: parseInt(pendingScore, 10) 
              })
            });
            localStorage.removeItem("pending_score");
            localStorage.removeItem("pending_player");
          }

          setIsUnlocked(true);
          sessionStorage.setItem("vault_session", "active");
          window.dispatchEvent(new Event("authStateChanged"));
          handleCloseModal(); 
        }
      } else {
        setErrorMsg(data.error || "Authentication failed.");
      }
    } catch (error) {
      setErrorMsg("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthClick = async (provider: "github" | "google") => {
    setErrorMsg("");
    try {
      localStorage.setItem("oauth_return_scroll", window.scrollY.toString());

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin, 
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg("OAuth Error: " + error.message);
      } else {
        setErrorMsg("OAuth Error: Connection failed.");
      }
    }
  };

  const handleLogout = () => {
    window.dispatchEvent(new Event("triggerVaultLogout"));
    handleCloseModal(); 
  };

  const activeProject = VAULT_PROJECTS.find(p => p.id === activeProjectId);

  const renderModals = () => {
    if (!mounted) return null;

    return createPortal(
      <>
        {/* 📌 ป๊อปอัปเตือนผู้ใช้หากไม่มีกิจกรรมเคลื่อนไหวในหน้าเว็บ (Idle Timeout) */}
        {isIdleWarningOpen && (
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-[6px] flex items-center justify-center p-5 animate-fade-in pointer-events-auto"
            style={{ zIndex: 999999 }}
          >
            <div className="w-full max-w-[340px] bg-[var(--bg-panel)] border border-[var(--danger)] rounded-lg p-6 text-center shadow-[0_0_40px_rgba(239,68,68,0.15)]">
              <div className="text-4xl mb-4 animate-bounce">⚠️</div>
              <h3 className="text-[1.1rem] font-bold font-mono text-[var(--text)] mb-2">
                {language === "en" ? "Are you still there?" : "คุณยังใช้งานอยู่หรือไม่?"}
              </h3>
              <p className="text-[var(--text-dim)] text-[0.8rem] font-mono mb-6 leading-relaxed">
                {language === "en" 
                  ? "For your security, you will be logged out in "
                  : "เพื่อความปลอดภัย ระบบจะทำการล็อกเอาท์อัตโนมัติใน "}
                <span className="text-[var(--danger)] font-bold text-[1.2rem] mx-1">{idleCountdown}</span>
                {language === "en" ? " seconds." : " วินาที"}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleLogout}
                  className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text-dim)] font-mono text-[0.75rem] py-2.5 rounded hover:text-[var(--danger)] hover:border-[var(--danger)] transition-all"
                >
                  {language === "en" ? "LOG OUT" : "ออกจากระบบ"}
                </button>
                <button 
                  onClick={handleStayLoggedIn}
                  className="flex-1 bg-[var(--accent)] text-white font-mono text-[0.75rem] py-2.5 rounded hover:brightness-110 transition-all font-bold tracking-wide"
                >
                  {language === "en" ? "STAY LOGGED IN" : "ใช้งานต่อ"}
                </button>
              </div>
            </div>
          </div>
        )}
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
                <button type="button" onClick={() => handleOAuthClick("github")} className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text)] rounded-[var(--radius)] p-2.5 font-mono text-[0.78rem] cursor-pointer transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  ◐ GitHub
                </button>
                <button type="button" onClick={() => handleOAuthClick("google")} className="flex-1 bg-[var(--bg-panel-2)] border border-[var(--edge)] text-[var(--text)] rounded-[var(--radius)] p-2.5 font-mono text-[0.78rem] cursor-pointer transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
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
              
              {/* 📌 โปรเจกต์ v01 แสดงผลภาพ Dr. V */}
              {activeProject.id === "v01" && (
                <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] min-h-[340px] flex flex-col items-center justify-center gap-3.5 text-center p-6 mb-7 shadow-sm overflow-hidden relative">
                  <img src="/Dr%20V.png" alt="Dr. V Character" onError={(e) => { e.currentTarget.src = "/Dr V.png" }} className="h-[280px] md:h-[320px] w-auto object-contain drop-shadow-xl" />
                </div>
              )}

              {/* 📌 โปรเจกต์ v02 แสดงผลภาพปกเกม (maw.jpg) เดี่ยวๆ เหมือน Dr. V */}
              {activeProject.id === "v02" && (
                <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] min-h-[340px] flex flex-col items-center justify-center gap-3.5 text-center p-6 mb-7 shadow-sm overflow-hidden relative">
                  <img src="/maw.jpg" alt="Make A Witch Poster" onError={(e) => { e.currentTarget.src = "/maw.png" }} className="h-[280px] md:h-[320px] w-auto object-contain drop-shadow-xl rounded-md" />
                </div>
              )}

              {/* 📌 โปรเจกต์ v03 แสดงผลภาพ LOGO.png เหมือนเกม Witch */}
              {activeProject.id === "v03" && (
                <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] min-h-[340px] flex flex-col items-center justify-center gap-3.5 text-center p-6 mb-7 shadow-sm overflow-hidden relative">
                  <img src="/LOGO.png" alt="VR Motorcycle Assembly Logo" onError={(e) => { e.currentTarget.src = "/LOGO.png" }} className="h-[280px] md:h-[320px] w-auto object-contain drop-shadow-xl rounded-md" />
                </div>
              )}

              {/* 📌 โปรเจกต์อื่นๆ ที่ไม่ได้กำหนดรูป (กรณีเผื่ออนาคต) เพิ่ม v03 เข้าไปในเงื่อนไข */}
              {activeProject.id !== "v01" && activeProject.id !== "v02" && activeProject.id !== "v03" && (
                <div className="border border-[var(--edge)] rounded-lg bg-[var(--bg-panel)] min-h-[340px] flex flex-col items-center justify-center gap-3.5 text-center p-10 mb-7 shadow-sm">
                  <div className="text-[2.4rem]">{activeProject.stageBig}</div>
                  <div className="font-mono text-[0.8rem] text-[var(--text-dim)] max-w-[460px]">{activeProject.stageCap[language]}</div>
                </div>
              )}

              <div className="mt-10">
                {activeProjectId === "v01" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 border border-[var(--edge)] rounded bg-[var(--bg-panel-2)] text-left flex flex-col">
                      <h3 className="font-mono text-[1.1rem] text-[var(--text)] font-bold mb-3">🎬 YarkRooMai</h3>
                      <p className="font-mono text-[0.8rem] text-[var(--text-dim)] mb-6 flex-1">
                        {language === "en" 
                          ? "Content focusing on narrative storytelling and AI-generated visuals. Leveraging tools like Midjourney, Runway, and CapCut to optimize workflow." 
                          : "ช่องคอนเทนต์เน้นการเล่าเรื่องพร้อมภาพประกอบจาก AI ประยุกต์ใช้เครื่องมือสร้างภาพและตัดต่อด้วย CapCut แบบครบวงจร"}
                      </p>
                      <a href="https://www.youtube.com/@YarkRooMai" target="_blank" rel="noopener noreferrer" className="bg-[#FF0000] text-white font-mono text-[0.8rem] py-3 rounded text-center transition-all hover:brightness-110 font-bold tracking-wide">YouTube ↗</a>
                    </div>
                    <div className="p-6 border border-[var(--edge)] rounded bg-[var(--bg-panel-2)] text-left flex flex-col">
                      <h3 className="font-mono text-[1.1rem] text-[var(--text)] font-bold mb-3">🎧 InfinitySound365</h3>
                      <p className="font-mono text-[0.8rem] text-[var(--text-dim)] mb-6 flex-1">
                        {language === "en" 
                          ? "A channel dedicated to audio experiences, utilizing AI audio generation tools (like Suno/Whisk) combined with long-format video editing techniques." 
                          : "ช่องสำหรับการฟังเสียง มุ่งเน้นการสร้างเสียงดนตรีและบรรยากาศด้วย AI ควบคู่กับการประมวลผลวิดีโอความยาวหลายชั่วโมง"}
                      </p>
                      <a href="https://www.youtube.com/@InfinitySound365" target="_blank" rel="noopener noreferrer" className="bg-[#FF0000] text-white font-mono text-[0.8rem] py-3 rounded text-center transition-all hover:brightness-110 font-bold tracking-wide">YouTube ↗</a>
                    </div>
                  </div>
                )}

                {/* 📌 โปรเจกต์ v02: นำภาพ 5 ภาพมาเรียงต่อกันเป็น Gallery ด้านล่าง */}
                {activeProjectId === "v02" && (
                  <div className="w-full flex flex-col gap-8 animate-fade-in">
                    <div className="text-center bg-[var(--bg-panel-2)] border border-[var(--edge)] rounded-lg p-6 shadow-sm">
                      <h3 className="font-mono text-xl md:text-2xl font-bold text-[var(--text)] flex items-center justify-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--good)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--good)]"></span>
                        </span>
                        {language === "en" ? "Development Progress Gallery" : "แกลเลอรีความคืบหน้าการพัฒนาเกม"}
                      </h3>
                      <p className="font-mono text-[0.85rem] text-[var(--text-dim)] mt-3 max-w-2xl mx-auto leading-relaxed">
                        {language === "en" 
                          ? "The interactive WebGL build is currently being optimized for web deployment. In the meantime, explore these latest gameplay and editor screenshots showcasing the combat system, UI integration, and AI behavior." 
                          : "ตัวเกมเวอร์ชัน WebGL กำลังอยู่ในขั้นตอนปรับแต่งประสิทธิภาพสำหรับการรันบนเว็บ ระหว่างนี้สามารถรับชมภาพตัวอย่างระบบต่อสู้ การจัดวาง UI และพฤติกรรม AI จากเอนจินได้ที่นี่"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* ภาพถ่ายหน้าจอที่ 1 (ใหญ่เต็มกรอบ) */}
                      <div className="md:col-span-2 group relative border border-[var(--edge)] rounded-xl overflow-hidden bg-[var(--bg-panel)] shadow-md">
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-[0.65rem] px-2 py-1 rounded z-10 pointer-events-none">
                          {language === "en" ? "SCENE VIEW // COMBAT" : "มุมมอง SCENE // ระบบต่อสู้"}
                        </div>
                        <div className="overflow-hidden">
                          <img src="/WitchGamePlay1.jpg" alt="Witch Game Play 1" onError={(e) => { e.currentTarget.src = "/WitchGamePlay1.png" }} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.03]" />
                        </div>
                      </div>

                      {/* ภาพถ่ายหน้าจอที่ 2 - 5 */}
                      {[2, 3, 4, 5].map((num) => (
                        <div key={num} className="group relative border border-[var(--edge)] rounded-xl overflow-hidden bg-[var(--bg-panel)] shadow-sm">
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-[0.65rem] px-2 py-1 rounded z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {language === "en" ? `SCREENSHOT // 0${num}` : `ภาพถ่ายหน้าจอ // 0${num}`}
                          </div>
                          <div className="overflow-hidden h-full">
                            <img src={`/WitchGamePlay${num}.jpg`} alt={`Witch Game Play ${num}`} onError={(e) => { e.currentTarget.src = `/WitchGamePlay${num}.png` }} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-[1.05]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 📌 คืนค่า v02 ให้กลับไปเรียกใช้ WitchGameBuild */}
                {activeProjectId === "v02" && (
                  <div className="w-full">
                    <WitchGameBuild />
                  </div>
                )}
                
                {/* 📌 เรียกใช้ Component ใหม่สำหรับ v03 */}
                {activeProjectId === "v03" && (
                  <div className="w-full">
                    <VrAssemblyBuild />
                  </div>
                )}
                
                {/* 📌 Coffee Shop Web App ถูกย้ายมาเป็น v04 */}
                {activeProjectId === "v04" && (
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
                : <>ผลงานด้านบนเป็นเพียงส่วนที่จัดแสดงสาธารณะ โปรเจกต์ตัวเต็ม, ซอร์สโค้ด, และผลงานที่กำลังอยู่ระหว่างการพัฒนา จะถูกป้องกันไว้หลังระบบล็อกอิน — พื้นที่ส่วนนี้ถูกออกแบบมาโดยเฉพาะเพื่อสาธิตระบบ <b>Authentication</b> ที่ปลอดภัยและการทำ <b>Protected routes</b> ครับ</>}
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
                  : (isUnlocked ? "ยินดีต้อนรับกลับ · คลิกที่กล่องเพื่อเปิดดูโปรเจกต์" : "ผลงานที่ถูกซ่อน & ระบบที่กำลังพัฒนา · ลงชื่อเข้าใช้เพื่อดูเนื้อหา")}
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