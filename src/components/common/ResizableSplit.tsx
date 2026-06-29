// File: src/components/common/ResizableSplit.tsx
//
// Horizontal split: a flexible LEFT panel (map) and a resizable RIGHT panel
// (analytics), separated by a draggable vertical divider — ArcGIS style.
// - drag the divider to resize in real time
// - min / max width limits on the right panel
// - width persists across reloads (localStorage)
// - double-click the divider to reset to default

import { useCallback, useEffect, useRef, useState } from "react";

interface ResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  storageKey?: string;
  minRight?: number;
  maxRight?: number;
  defaultRight?: number;
}

export default function ResizableSplit({
  left,
  right,
  storageKey = "cl-split-width",
  minRight = 320,
  maxRight = 700,
  defaultRight = 420,
}: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clamp = useCallback(
    (w: number) => Math.min(Math.max(w, minRight), maxRight),
    [minRight, maxRight]
  );

  const [rightWidth, setRightWidth] = useState<number>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
    const n = saved ? parseInt(saved, 10) : NaN;
    return Number.isFinite(n) ? Math.min(Math.max(n, minRight), maxRight) : defaultRight;
  });
  const [dragging, setDragging] = useState(false);

  const onMove = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setRightWidth(clamp(rect.right - clientX));
    },
    [clamp]
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => onMove(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [dragging, onMove]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, String(Math.round(rightWidth)));
    } catch {
      /* ignore */
    }
  }, [rightWidth, storageKey]);

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      {/* LEFT — flexible (map) */}
      <div className="min-w-0 flex-1 overflow-hidden">{left}</div>

      {/* DIVIDER */}
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDoubleClick={() => setRightWidth(defaultRight)}
        className={`group relative flex w-2 shrink-0 cursor-col-resize items-center justify-center
          ${dragging ? "bg-amber-400/20" : "hover:bg-white/10"}`}
        title="Drag to resize · double-click to reset"
      >
        <span
          className={`h-10 w-[3px] rounded-full transition-colors
            ${dragging ? "bg-amber-300" : "bg-white/20 group-hover:bg-teal-300/70"}`}
        />
      </div>

      {/* RIGHT — resizable (analytics) */}
      <div
        style={{ width: rightWidth, transition: dragging ? "none" : "width 120ms ease" }}
        className="shrink-0 overflow-y-auto"
      >
        {right}
      </div>
    </div>
  );
}