// src/components/AccountSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function AccountSettings() {
  const { language } = useLanguage();
  const { theme } = useTheme(); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"profile" | "security" | "danger">("profile");

  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isOAuth, setIsOAuth] = useState(false); 
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    
    const handleOpen = () => {
      setIsOpen(true);
      setTab("profile");
      setMessage(null);
      setIsFetching(true);
      
      fetch("/api/user/settings")
        .then(res => res.json())
        .then(data => {
          if (data.playerName) setDisplayName(data.playerName);
          setIsOAuth(data.isOAuth === true); 
        })
        .finally(() => setIsFetching(false));
    };

    window.addEventListener("openAccountSettings", handleOpen);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("openAccountSettings", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setMessage(null);
    setCurrentPassword("");
    setNewPassword("");
    setDeletePassword("");
    setIsOAuth(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 📌 เพิ่มหน้าต่าง Confirm ก่อนเปลี่ยนชื่อ
    if (!confirm(language === "en" ? "Are you sure you want to change your Display Name?" : "แน่ใจหรือไม่ว่าต้องการเปลี่ยนชื่อที่ใช้แสดงผล?")) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: displayName })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: language === "en" ? "Profile updated successfully." : "อัปเดตโปรไฟล์สำเร็จ", type: "success" });
        // 📌 ยิงสัญญาณบอกทุก Component ว่าเปลี่ยนชื่อสำเร็จแล้ว!
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: language === "en" ? "Password updated successfully." : "อัปเดตรหัสผ่านสำเร็จ", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(language === "en" ? "WARNING: This cannot be undone. Are you sure?" : "คำเตือน: การกระทำนี้ไม่สามารถย้อนกลับได้ แน่ใจหรือไม่?")) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }) 
      });
      
      if (res.ok) {
        window.dispatchEvent(new Event("triggerVaultLogout")); 
        handleClose();
        alert(language === "en" ? "Account deleted." : "ลบบัญชีเรียบร้อยแล้ว");
      } else {
        const data = await res.json();
        setMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 bg-black/65 backdrop-blur-[4px] flex items-center justify-center p-5 transition-all duration-250 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      style={{ zIndex: 99999 }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`w-full max-w-[420px] bg-[var(--bg-panel)] border border-[var(--edge)] rounded-lg overflow-hidden transition-transform duration-250 shadow-2xl ${isOpen ? "translate-y-0" : "translate-y-3.5"}`}>
        
        <div className="bg-[var(--bg-panel-2)] border-b border-[var(--edge)]">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--edge)]">
            <h3 className="font-bold text-[1.1rem] font-mono text-[var(--text)]">
              {language === "en" ? "Account Settings" : "ตั้งค่าบัญชีผู้ใช้"}
            </h3>
            <button onClick={handleClose} className="text-[var(--text-dim)] hover:text-[var(--accent)] text-2xl leading-none transition-colors">×</button>
          </div>
          <div className="flex font-mono text-[0.75rem]">
            <button 
              onClick={() => { setTab("profile"); setMessage(null); }} 
              className={`flex-1 py-3 text-center border-b-2 transition-all font-medium ${tab === "profile" ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-panel)]" : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)]"}`}
            >
              {language === "en" ? "Profile" : "โปรไฟล์"}
            </button>
            
            {!isOAuth && (
              <button 
                onClick={() => { setTab("security"); setMessage(null); }} 
                className={`flex-1 py-3 text-center border-b-2 transition-all font-medium ${tab === "security" ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-panel)]" : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)]"}`}
              >
                {language === "en" ? "Security" : "ความปลอดภัย"}
              </button>
            )}

            <button 
              onClick={() => { setTab("danger"); setMessage(null); }} 
              className={`flex-1 py-3 text-center border-b-2 transition-all font-medium ${tab === "danger" ? "border-[var(--danger)] text-[var(--danger)] bg-[var(--bg-panel)]" : "border-transparent text-[var(--text-dim)] hover:text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_5%,transparent)]"}`}
            >
              {language === "en" ? "Danger Zone" : "ลบบัญชี"}
            </button>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className={`mb-5 p-3 rounded text-[0.8rem] font-mono text-center border ${message.type === "success" ? "bg-[rgba(61,220,132,0.1)] border-[var(--good)] text-[var(--good)]" : "bg-[rgba(255,95,87,0.1)] border-[var(--danger)] text-[var(--danger)]"}`}>
              {message.text}
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-5">
                <label className="block font-mono text-[0.75rem] text-[var(--text-dim)] mb-1.5 font-medium">
                  {language === "en" ? "Display Name" : "ชื่อที่จะแสดงในระบบ"}
                </label>
                <input 
                  type="text" 
                  required 
                  maxLength={15}
                  disabled={isFetching}
                  placeholder={isFetching ? "Loading..." : ""}
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded py-2 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50" 
                />
                <p className="text-[0.7rem] text-[var(--text-faint)] mt-2 font-mono">
                  {language === "en" ? "* This name will appear on the Leaderboard." : "* ชื่อนี้จะไปปรากฏในกระดานคะแนน Leaderboard"}
                </p>
                {isOAuth && (
                  <p className="text-[0.7rem] text-[var(--accent-2)] mt-2 font-mono">
                    {language === "en" ? "✓ Connected via 3rd Party (OAuth)" : "✓ บัญชีเชื่อมต่อผ่าน Google/GitHub"}
                  </p>
                )}
              </div>
              <button type="submit" disabled={isLoading || isFetching} className="w-full bg-[var(--accent)] text-white font-mono text-[0.85rem] py-2.5 rounded hover:brightness-110 disabled:opacity-50 transition-all font-medium">
                {isLoading ? "Saving..." : (language === "en" ? "Save Changes" : "บันทึกชื่อใหม่")}
              </button>
            </form>
          )}

          {tab === "security" && !isOAuth && (
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block font-mono text-[0.75rem] text-[var(--text-dim)] mb-1.5 font-medium">{language === "en" ? "Current Password" : "รหัสผ่านเดิม"}</label>
                <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded py-2 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <div className="mb-5">
                <label className="block font-mono text-[0.75rem] text-[var(--text-dim)] mb-1.5 font-medium">{language === "en" ? "New Password" : "รหัสผ่านใหม่"}</label>
                <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--edge)] rounded py-2 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[var(--accent)] text-white font-mono text-[0.85rem] py-2.5 rounded hover:brightness-110 disabled:opacity-50 transition-all font-medium">
                {isLoading ? "Saving..." : (language === "en" ? "Update Password" : "เปลี่ยนรหัสผ่าน")}
              </button>
            </form>
          )}

          {tab === "danger" && (
            <form onSubmit={handleDeleteAccount}>
              {/* 📌 แก้ไขคำอธิบายให้ชัดเจนว่าลบออกจากฐานข้อมูล */}
              <p className="text-[0.85rem] text-[var(--text-dim)] mb-4 leading-relaxed">
                {language === "en" 
                  ? "Deleting your account will permanently remove your data, access rights, and High Scores from the database. This action cannot be undone." 
                  : "การลบบัญชีจะลบข้อมูลส่วนตัว สิทธิ์การเข้าถึง และสถิติคะแนนทั้งหมดของคุณออกจากฐานข้อมูลอย่างถาวร และไม่สามารถกู้คืนได้"}
              </p>
              
              {!isOAuth && (
                <div className="mb-5">
                  <label className="block font-mono text-[0.75rem] text-[var(--danger)] mb-1.5 font-medium">{language === "en" ? "Enter password to confirm" : "ใส่รหัสผ่านเพื่อยืนยันการลบ"}</label>
                  <input type="password" required value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--danger)] rounded py-2 px-3 text-[var(--text)] font-mono text-[0.85rem] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,95,87,0.2)] transition-all" />
                </div>
              )}

              {/* 📌 ปรับให้ตัวหนังสือเป็นสีแดงตลอดเวลา และมีกรอบสีแดง */}
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full bg-transparent border border-[var(--danger)] text-[var(--danger)] font-mono text-[0.85rem] py-2.5 rounded hover:bg-[var(--danger)] ${theme === 'light' ? 'hover:text-black' : 'hover:text-white'} disabled:opacity-10 transition-all font-medium`}
              >
                {isLoading ? "Processing..." : (language === "en" ? "Delete Account" : "ยืนยันการลบบัญชี")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}