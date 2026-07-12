import TopHUD from "@/components/TopHUD";
import Hero from "@/components/Hero";
import Play from "@/components/Play";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
import Console from "@/components/Console";
import Vault from "@/components/Vault";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AccountSettings from "@/components/AccountSettings"; // 📌 นำเข้าไฟล์ใหม่

export default function Home() {
  return (
    <>
      <TopHUD />
      <main className="relative z-10">
        <div className="max-w-[1180px] mx-auto w-full px-6">
          <Hero />
          <Play />
          <Work />
          <Skills />
          <Console />
          <Vault />
        </div>
        <Contact />
      </main>

      <Footer />
      <BackToTop />
      <AccountSettings /> {/* 📌 ใส่ไว้ล่างสุดของเว็บ เพื่อให้เรียกใช้ได้ตลอดเวลา */}
    </>
  );
}