import Image from "next/image";
import LetterGlitch from "./components/LetterGlitch";
import PageFooter from "./components/PageFooter";
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 opacity-80">
        <LetterGlitch
          glitchColors={["#6ee7ff", "#9f7aea", "#22c55e"]}
          glitchSpeed={45}
          outerVignette={true}
          centerVignette={false}
          smooth={true}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%),linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.82))]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex flex-1 items-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-4xl">
            <div className="max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-10">
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                Seedha Cut
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                Sharper links, cleaner sharing.
              </h1>
             
            </div>
          </div>
        </main>

        <PageFooter />
      </div>
    </div>
  );
}
