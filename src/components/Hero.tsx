import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-[150px] pb-[90px] relative">
      {/* Status Bar */}
      <div className="font-mono text-[0.74rem] text-[var(--text-dim)] flex gap-[18px] flex-wrap mb-[30px]">
        <span><b className="text-[var(--good)] font-medium">●</b> open to work</span>
        <span>target: <span className="text-[var(--accent-2)] animate-pulse">full-stack / backend / gameplay eng</span></span>
        <span>loc: nonthaburi · remote-ready</span>
      </div>

      {/* Eyebrow & Title */}
      <span className="font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[var(--accent)] font-medium inline-flex items-center gap-[0.6em] before:content-[''] before:w-[18px] before:h-[1px] before:bg-[var(--accent)]">
        computer engineering · product-minded
      </span>
      
      <h1 className="text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.98] font-bold tracking-tight mt-3 mb-2">
        I build <em className="not-italic text-[var(--accent)] relative after:content-['_'] after:animate-pulse">systems</em> that ship
        <span className="block text-[var(--text-faint)] text-[clamp(1rem,2.4vw,1.5rem)] font-medium font-mono tracking-wide mt-[18px]">
          — robust web applications, apis, and interactive games
        </span>
      </h1>

      {/* Lede (Introduction) */}
      <p className="max-w-[560px] text-[var(--text-dim)] text-[1.08rem] my-[28px] leading-relaxed">
        I'm <strong>Theppratan Junpanya</strong>, a Computer Engineering graduate who builds <strong>full-stack systems</strong> — integrating robust backend APIs, databases, and cybersecurity principles. I think about <strong>the architecture, not just the code</strong>, and I engineer interactive systems in <strong>Unity / C#</strong> on the side. Everything below is live.
      </p>

      {/* Call to Action Buttons */}
      <div className="flex gap-[14px] flex-wrap items-center">
        <Link href="#play" className="font-mono text-[0.85rem] font-medium tracking-wide py-[13px] px-[22px] rounded-[var(--radius)] transition-all flex items-center gap-[0.6em] border border-transparent bg-[var(--accent)] text-white hover:-translate-y-[2px] hover:shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
          ▶ Play a demo
        </Link>
        <Link href="#work" className="font-mono text-[0.85rem] font-medium tracking-wide py-[13px] px-[22px] rounded-[var(--radius)] transition-all flex items-center gap-[0.6em] bg-transparent border border-[var(--edge)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
          Browse work
        </Link>
        <Link href="/resume.pdf" target="_blank" className="font-mono text-[0.85rem] font-medium tracking-wide py-[13px] px-[22px] rounded-[var(--radius)] transition-all flex items-center gap-[0.6em] bg-transparent border border-transparent text-[var(--text)] hover:text-[var(--accent)]">
          ↓ resume.pdf
        </Link>
      </div>

      {/* Engine Inspector Card (Tech Stack Summary) */}
      <div className="mt-[64px] border border-[var(--edge)] rounded-md bg-gradient-to-b from-[var(--bg-panel)] to-[var(--bg-panel-2)] overflow-hidden max-w-[800px]">
        <div className="flex items-center gap-[8px] py-[10px] px-[14px] border-b border-[var(--edge)] font-mono text-[0.72rem] text-[var(--text-dim)] bg-[var(--bg-panel)]">
          <span className="flex gap-[6px]">
            <i className="w-[11px] h-[11px] rounded-full block bg-[#ff5f57]"></i>
            <i className="w-[11px] h-[11px] rounded-full block bg-[#febc2e]"></i>
            <i className="w-[11px] h-[11px] rounded-full block bg-[#28c840]"></i>
          </span>
          <span className="ml-2">inspector — entity: "Candidate_Profile"</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[var(--edge)]">
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Core Stack</div>
            <div className="text-[1.15rem] font-bold mt-[4px]">Next.js <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">Node</small></div>
          </div>
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Database</div>
            <div className="text-[1.15rem] font-bold mt-[4px]">MySQL <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">DB Design</small></div>
          </div>
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Game / 3D</div>
            <div className="text-[1.15rem] font-bold mt-[4px]">Unity <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">C# / Blender</small></div>
          </div>
          <div className="bg-[var(--bg-panel)] py-[18px] px-[16px]">
            <div className="font-mono text-[0.68rem] text-[var(--text-faint)] uppercase tracking-[0.12em]">Status</div>
            <div className="text-[1.15rem] font-bold mt-[4px] text-[var(--good)]">READY <small className="text-[0.8rem] text-[var(--accent-2)] font-medium font-mono">to deploy</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}