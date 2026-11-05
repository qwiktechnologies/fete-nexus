"use client";

import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

export function RowMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <div className="relative" ref={box}>
      <button
        type="button"
        aria-expanded={open}
        aria-label="More actions"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-9 items-center gap-1 rounded-full border border-navy-900/10 px-3 text-sm font-bold text-navy-900 hover:bg-paper"
      >
        More <FiMoreHorizontal />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-navy-900/10 bg-white p-1.5 shadow-[0_20px_50px_-28px_rgba(11,31,58,0.7)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}
