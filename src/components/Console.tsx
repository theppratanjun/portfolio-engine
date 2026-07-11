"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

type HistoryLine = { id: number; content: ReactNode };

export default function Console() {
  const { language } = useLanguage();
  const { setTheme } = useTheme();
  
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 📌 เปลี่ยนมาอ้างอิง "ตัวกล่อง" แทนการอ้างอิง "บรรทัดล่างสุด"
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [lastActivity, setLastActivity] = useState(() => Date.now());
  const timeoutDuration = 30000; 
  
  const hasBooted = useRef(false);
  const isInitialized = useRef(false);

  const print = (content: ReactNode) => {
    const uniqueId = Math.random() + Date.now();
    setHistory((prev) => [...prev, { id: uniqueId, content }]);
  };

  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    const timer = setTimeout(() => {
      setHistory([
        { 
          id: 1, 
          content: language === "en" ? "theppratan-os v1.0.0 — type \"help\"" : "ระบบ theppratan-os v1.0.0 — พิมพ์ \"help\"" 
        }, 
        {
          id: 2,
          content: <span className="text-[#8b94a3]">last login: today · session: guest</span>
        }
      ]);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 📌 แก้ไขจุดนี้: สั่งให้ Scroll เฉพาะกล่องด้านใน ไม่กวนหน้าเว็บหลัก
  useEffect(() => {
    if (!isInitialized.current) {
      if (history.length > 0) {
        isInitialized.current = true;
      }
      return; 
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [history]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const timer = setTimeout(() => {
      setIsLoggedIn(false);
      print(
        <span className="text-[#ff2e88]">
          [SECURITY NOTICE] Session timed out due to 30s of inactivity. Logged out securely.
        </span>
      );
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [lastActivity, isLoggedIn]);

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    
    setLastActivity(Date.now());

    print(
      <>
        <span className="text-[#21e6c1]">{"➜ "}</span>
        <span className="text-[#e6e9ef]">{raw}</span>
      </>
    );

    const parts = raw.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase(); 

    switch (cmd) {
      case "help":
        print(
          <>
            available: <span className="text-[#3ddc84]">about skills projects stack</span><br />
            {isLoggedIn && <><span className="text-[#3ddc84]">status</span><br /></>}
            {!isLoggedIn ? (
              <>
                command: <span className="text-[#ff2e88]">{"login [password]"}</span>
              </>
            ) : (
              <>
                command: <span className="text-[#ff2e88]">logout</span>
              </>
            )}
            <br />
            utility: <span className="text-[#3ddc84]">{"clear theme"}</span>
          </>
        );
        break;

      case "login":
        if (arg === "admin123") {
          setIsLoggedIn(true);
          setLastActivity(Date.now());
          print(<span className="text-[#3ddc84]">Login successful. Session authenticated via secure handshake.</span>);
        } else {
          print(<span className="text-[#ff2e88]">Invalid password. Usage: login [password]</span>);
        }
        break;

      case "logout":
        setIsLoggedIn(false);
        print("Logged out successfully. Cryptographic session destroyed.");
        break;

      case "status":
        if (!isLoggedIn) {
          print(<span className="text-[#ff2e88]">{"Access Denied: Secure connection required. Please 'login' first."}</span>);
        } else {
          print(<span className="text-[#8b94a3]">Fetching metrics from secure API gateway...</span>);
          
          fetch("/api/system-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionToken: "secret-valid-token-123" }) // 📌 คีย์ยืนยันตัวตน
          })
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((data) => {
            // 📌 เมื่อได้รับข้อมูลจริงจาก Backend ให้นำมาพิมพ์ลงหน้าจอ
            print(
              <>
                System: <span className="text-[#3ddc84]">{data.status}</span><br />
                Latency: <span className="text-[#21e6c1]">{data.latency}</span> · Uptime: {data.uptime}<br />
                Memory: <span className="text-[#ffd23f]">{data.memory}</span><br />
                Database: <span className="text-[#8b94a3]">{data.db}</span>
              </>
            );
          })
          .catch(() => {
            // 📌 ถ้าระบบหลังบ้านล่ม หน้าบ้านต้องไม่พัง (Graceful Degradation)
            print(<span className="text-[#ff2e88]">Error: Failed to fetch secure gateway metrics. API Offline.</span>);
          });
        }
        break;

      case "theme":
        if (arg === "light" || arg === "dark") {
          setTheme(arg);
          print(`Theme configuration updated: ${arg === "light" ? "Light" : "Dark"}`);
        } else {
          print(
            <>
              <span className="text-[#ff2e88]">{"Usage: theme Light , Dark | light , dark"}</span>
            </>
          );
        }
        break;

      case "sudo":
        print(<span className="text-[#ffd23f]">Nice try. User is not in the sudoers file. This incident will be reported.</span>);
        break;

      case "about":
        print(
          language === "en"
            ? "Theppratan Junpanya — Computer engineering graduate. Full-stack engineer building scalable systems and interactive mechanics."
            : "เทพประทาน จันทร์ปัญญา — บัณฑิตวิศวกรรมคอมพิวเตอร์ นักพัฒนาฟูลสแต็กผู้สร้างระบบที่รองรับการขยายตัวและเกมอินเทอร์แอกทีฟ"
        );
        break;

      case "skills":
        print("Next.js · Node.js · MySQL · TypeScript · Unity · C# · Git · Docker · CyberSecurity Foundations");
        break;

      case "projects":
        print("01 [Hackathon] DPU Business 2022 (1st Place) · 02 G-Armed Forces Cyber 2024 · 03 Hacker House Web3 · 04 Witch 2.5D RPG / VR Assembly");
        break;

      case "stack":
        print("Architecture: Next.js + Tailwind CSS v3 (Stable) + React Context API for i18n + Secure Backend API Layer.");
        break;

      case "clear":
        setHistory([]);
        break;

      default:
        print(`Command not found: ${cmd} — type "help" for available options.`);
    }
  };

  return (
    <section id="console" className="py-20 relative scroll-mt-10">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[var(--accent)]">
          {language === "en" ? "debug console" : "ดีบัก คอนโซล"}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-3 leading-[1.05]">
          {language === "en" ? "Or just ask the console" : "พิมพ์ถามผ่านคอนโซลได้เลย"}
        </h2>
        <p className="text-[var(--text-dim)]">
          {language === "en"
            ? "Try 'login admin123' then 'status' to test real API connectivity."
            : "ลองพิมพ์ 'login admin123' แล้วตามด้วย 'status' เพื่อทดสอบการเชื่อมต่อ API ของจริง"}
        </p>
      </div>

      <div 
        className="border border-[var(--edge)] rounded-md bg-[#070809] overflow-hidden font-mono shadow-2xl cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 py-2.5 px-4 bg-[#181c24] border-b border-[#262c36] text-xs text-[#8b94a3] select-none">
          <span className="flex gap-1.5">
            <i className="w-3 h-3 rounded-full bg-[#ff5f57] block"></i>
            <i className="w-3 h-3 rounded-full bg-[#febc2e] block"></i>
            <i className="w-3 h-3 rounded-full bg-[#28c840] block"></i>
          </span>
          <span className="ml-2">
            {isLoggedIn ? "admin@theppratan-secure" : "guest@theppratan-os"} — zsh
          </span>
        </div>

        {/* 📌 ผูก ref ไว้ที่กล่องนี้ เพื่อให้มันเลื่อนแค่ข้างใน */}
        <div 
          ref={scrollContainerRef}
          className="p-5 text-[0.85rem] leading-[1.75] h-[300px] overflow-y-auto"
        >
          {history.map((line) => (
            <div key={line.id} className="text-[#8b94a3] whitespace-pre-wrap break-words">
              {line.content}
            </div>
          ))}
          <div className="flex items-center mt-1">
            <span className="text-[#21e6c1] mr-2">{"➜"}</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-[#e6e9ef] font-mono text-[0.85rem] w-full caret-[#21e6c1]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommand(inputValue);
                  setInputValue("");
                } 
                else if (e.key === "ArrowUp") {
                  e.preventDefault(); 
                  if (commandHistory.length > 0) {
                    const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                    setHistoryIndex(nextIndex);
                    setInputValue(commandHistory[nextIndex]);
                  }
                } 
                else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (historyIndex !== -1) {
                    const nextIndex = historyIndex + 1;
                    if (nextIndex >= commandHistory.length) {
                      setHistoryIndex(-1);
                      setInputValue(""); 
                    } else {
                      setHistoryIndex(nextIndex);
                      setInputValue(commandHistory[nextIndex]);
                    }
                  }
                }
              }}
              autoComplete="off"
              spellCheck="false"
              placeholder={history.length < 3 ? "type 'help' and hit enter" : ""}
            />
          </div>
        </div>
      </div>
    </section>
  );
}