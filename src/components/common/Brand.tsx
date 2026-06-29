// File: src/components/common/Brand.tsx
import logo from "../../assets/tarutium-logo.png";

// "Climatium IND".
// showLogo: render the Tarutium logo in front of the title (Landing only).
export function Wordmark({ showLogo = false }: { showLogo?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {showLogo && (
        <>
          <img
            src={logo}
            alt="Tarutium Global Consulting"
            className="h-7 w-auto opacity-95 drop-shadow-[0_2px_8px_rgba(99,102,241,0.5)]"
          />
          <span className="h-6 w-px bg-white/20" />
        </>
      )}
      <span
        style={{ fontFamily: "var(--font-display)" }}
        className="text-lg font-semibold tracking-tight text-slate-50"
      >
        Climatium <span className="text-amber-300">IND</span>
      </span>
    </div>
  );
}

// Bottom-right Tarutium logo (Dashboard + Analytics).
// Faded by default; brightens + solidifies on hover.
export function CornerLogo() {
  return (
    <div
      className="fixed bottom-4 right-5 z-[1100] rounded-xl border border-white/10 bg-[#0b1220]/45 px-3 py-2
        opacity-60 backdrop-blur-md transition-all duration-300
        hover:opacity-100 hover:border-white/25 hover:bg-[#0b1220]/85 hover:shadow-xl"
    >
      <img src={logo} alt="Tarutium Global Consulting" className="h-7 w-auto" />
    </div>
  );
}
