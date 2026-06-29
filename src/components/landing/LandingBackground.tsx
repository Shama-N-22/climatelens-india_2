// File: src/components/landing/LandingBackground.tsx
//
// Yellow heat image as the landing background with controlled opacity.
// Layer order (back -> front):
//   1. base navy ink           (so the page never washes out to pure yellow)
//   2. the yellow image        (opacity-controlled, slow ken-burns drift)
//   3. dark gradient scrim      (keeps hero text readable)
//   4. {children}  -> your hero content
//
// Drop image 8 at: src/assets/landing-bg.jpg

import bg from "../../assets/landing-bg.jpg";

interface LandingBackgroundProps {
  children: React.ReactNode;
  /** image opacity, 0..1 — 0.35 keeps it atmospheric, not loud */
  imageOpacity?: number;
}

export default function LandingBackground({
  children,
  imageOpacity = 0.35,
}: LandingBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1220]">
      {/* yellow heat image */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center will-change-transform animate-[kenburns_24s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${bg})`, opacity: imageOpacity }}
      />

      {/* readability scrim: darker at edges + bottom, amber glow up top */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(245,158,11,0.10), transparent 55%)," +
            "linear-gradient(to bottom, rgba(11,18,32,0.55) 0%, rgba(11,18,32,0.35) 40%, rgba(11,18,32,0.92) 100%)",
        }}
      />

      {/* subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 220px 60px rgba(11,18,32,0.65)" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

/*
Add this keyframe once (e.g. in src/styles/index.css). Tailwind v4:

@theme {
  --animate-kenburns: kenburns 24s ease-in-out infinite alternate;
}
@keyframes kenburns {
  from { transform: scale(1) translate3d(0,0,0); }
  to   { transform: scale(1.08) translate3d(-1.5%, -1%, 0); }
}
*/
