"use client";

import React from "react";
import type { TrafficSource } from "@/types";
import { cn } from "@/lib/utils";

interface TrafficSourceBadgeProps {
  source?: TrafficSource;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function TrafficSourceBadge({
  source = "meta",
  size = "sm",
  showLabel = false,
  className,
}: TrafficSourceBadgeProps) {
  const normalized = (source || "direct").toLowerCase();

  const sizeClasses = {
    sm: "w-4 h-4 text-[9px]",
    md: "w-5 h-5 text-[10px]",
    lg: "w-6 h-6 text-xs",
  }[size];

  // TikTok Logo Badge (Black circle with white note)
  if (normalized.includes("tiktok") || normalized === "tt") {
    return (
      <div
        className={cn("inline-flex items-center gap-1.5", className)}
        title="طلب من TikTok Ads"
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-black text-white shadow-sm ring-1 ring-white/20 flex-shrink-0",
            sizeClasses
          )}
        >
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.9-4.49V8.55a8.28 8.28 0 0 0 4.87 1.57V6.69z" />
          </svg>
        </span>
        {showLabel && <span className="font-semibold text-zinc-300">TikTok</span>}
      </div>
    );
  }

  // Meta / Facebook / Instagram Logo Badge (Blue circle with Meta infinity)
  if (
    normalized.includes("meta") ||
    normalized.includes("facebook") ||
    normalized.includes("instagram") ||
    normalized === "fb" ||
    normalized === "ig"
  ) {
    return (
      <div
        className={cn("inline-flex items-center gap-1.5", className)}
        title="طلب من Meta Ads (Facebook / Instagram)"
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-[#0081FB] text-white shadow-sm ring-1 ring-white/20 flex-shrink-0",
            sizeClasses
          )}
        >
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4.5C7.305 4.5 3.5 8.082 3.5 12.5c0 2.222.955 4.237 2.508 5.696L5.5 21l3.023-.974C9.52 20.34 10.737 20.5 12 20.5c4.695 0 8.5-3.582 8.5-8S16.695 4.5 12 4.5zm-1.85 10.45c-1.125 0-2.036-.92-2.036-2.054 0-1.134.911-2.054 2.036-2.054 1.124 0 2.035.92 2.035 2.054 0 1.134-.911 2.054-2.035 2.054zm3.7 0c-1.124 0-2.035-.92-2.035-2.054 0-1.134.911-2.054 2.035-2.054 1.125 0 2.036.92 2.036 2.054 0 1.134-.911 2.054-2.036 2.054z" />
          </svg>
        </span>
        {showLabel && <span className="font-semibold text-blue-400">Meta</span>}
      </div>
    );
  }

  // Snapchat Logo Badge (Yellow circle with ghost)
  if (normalized.includes("snap") || normalized === "sc") {
    return (
      <div
        className={cn("inline-flex items-center gap-1.5", className)}
        title="طلب من Snapchat Ads"
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-[#FFFC00] text-black shadow-sm ring-1 ring-black/20 flex-shrink-0",
            sizeClasses
          )}
        >
          <svg className="w-2.5 h-2.5 fill-black" viewBox="0 0 24 24">
            <path d="M12.028 2.001c-3.535 0-6.4 2.766-6.4 6.177 0 .546.075 1.077.217 1.58-.598.118-1.036.439-1.036.837 0 .428.508.777 1.189.878-.066.368-.104.75-.104 1.144 0 1.258.489 2.404 1.282 3.256-.479.467-1.128.84-1.921 1.055-.264.072-.44.295-.44.567 0 .393.364.697.873.742 1.488.132 2.748.742 3.535 1.705.518.633 1.25.992 2.046.992.427 0 .858-.105 1.26-.307.399.202.83.307 1.258.307.795 0 1.528-.359 2.046-.992.787-.963 2.047-1.573 3.535-1.705.509-.045.873-.349.873-.742 0-.272-.176-.495-.44-.567-.793-.215-1.442-.588-1.921-1.055.793-.852 1.282-1.998 1.282-3.256 0-.394-.038-.776-.104-1.144.681-.101 1.189-.45 1.189-.878 0-.398-.438-.719-1.036-.837.142-.503.217-1.034.217-1.58 0-3.411-2.865-6.177-6.4-6.177z" />
          </svg>
        </span>
        {showLabel && <span className="font-semibold text-yellow-300">Snapchat</span>}
      </div>
    );
  }

  // Google Logo Badge
  if (normalized.includes("google") || normalized === "gads") {
    return (
      <div
        className={cn("inline-flex items-center gap-1.5", className)}
        title="طلب من Google Ads / Search"
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-300 flex-shrink-0 font-bold text-[8px]",
            sizeClasses
          )}
        >
          <span className="text-blue-500 font-black">G</span>
        </span>
        {showLabel && <span className="font-semibold text-zinc-300">Google</span>}
      </div>
    );
  }

  // Direct / Default
  return showLabel ? (
    <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 font-medium">
      مباشر
    </span>
  ) : null;
}
