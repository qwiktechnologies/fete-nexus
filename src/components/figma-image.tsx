"use client";

import Image from "next/image";
import { useState } from "react";

export function FigmaImage({
  src,
  alt,
  className,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-surface-100 text-center text-xs text-muted ${className}`}>
        Export <code className="mx-1">{src}</code> from Figma (see public/figma/EXPORT.md)
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}