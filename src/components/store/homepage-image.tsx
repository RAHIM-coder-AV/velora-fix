"use client";

import { useState } from "react";
import Image from "next/image";

interface HomepageImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

export function HomepageImage({
  src,
  alt,
  className = "",
  imageClassName = "",
}: HomepageImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex h-full min-h-40 items-center justify-center bg-stone-200 text-sm text-stone-600 ${className}`}
        role="img"
        aria-label={alt}
      >
        {alt}
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <Image
        fill
        unoptimized
        src={src}
        alt={alt}
        className={`object-cover ${imageClassName}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
