import TopHUD from "@/components/TopHUD";
import Hero from "@/components/Hero";
import Play from "@/components/Play";

export default function Home() {
  return (
    <>
      <TopHUD />
      <main className="relative z-10 mx-auto max-w-[var(--maxw)] px-6">
        <Hero />
        <Play />
        
        {/* พื้นที่สำหรับ Component ถัดไป (Projects & Skills) */}
        <div className="h-[200px]"></div> 
      </main>
    </>
  );
}