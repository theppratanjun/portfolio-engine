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

export default function Home() {
  return (
    <>
      <TopHUD />
      <main className="relative z-10">
        
        {/* 📌 หุ้ม Container คืนให้ส่วนบน เพื่อแก้ปัญหาหน้าเว็บชิดขอบ */}
        <div className="max-w-[1180px] mx-auto w-full px-6">
          <Hero />
          <Play />
          <Work />
          <Skills />
          <Console />
          <Vault />
        </div>
        
        {/* 📌 ส่วนติดต่อ (Contact) จัดการความกว้างและสีพื้นหลังในไฟล์ตัวเองแล้ว */}
        <Contact />

      </main>

      <Footer />
      <BackToTop />
    </>
  );
}