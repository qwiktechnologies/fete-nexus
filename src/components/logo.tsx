"use client";

import Image from "next/image";
import { useState } from "react";

export function Mark({ className = "h-10 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 86 64" className={className} aria-hidden>
      <path fill="#12355B" d="M40 4 22 4 4 32l18 28h18L22 32 40 4Z" />
      <path fill="#12355B" d="M46 10 34 32l12 22-8 6L20 32 38 4l8 6Z" />
      <path fill="#F28C28" d="M46 4h18l18 28-18 28H46l18-28L46 4Z" />
      <path fill="#F28C28" d="M40 10 52 32 40 54l8 6 18-28L48 4l-8 6Z" />
    </svg>
  );
}

function FigmaLogo({ light }: { light?: boolean }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="flex items-center gap-3">
        <Mark className="h-11 w-14 shrink-0" />
        <span>
          <span className={`block font-display text-lg font-bold leading-none tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
            FETE NEXUS
          </span>
          <span className={`mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] ${light ? "text-gold-400" : "text-navy-700"}`}>
            Logistics &amp; Removals
          </span>
        </span>
      </span>
    );
  }

  return (
    <Image
      src="/figma/brand/logo.png"
      alt="Fete Nexus Logistics and Removals"
      width={220}
      height={48}
      className="h-11 w-auto max-w-[220px]"
      priority
      unoptimized
      onError={() => setMissing(true)}
    />
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return <FigmaLogo light={light} />;
}