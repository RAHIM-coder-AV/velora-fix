"use client";

import { useEffect, useState } from "react";

export function ToastHost() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      setMessage(detail);
      const t = setTimeout(() => setMessage(null), 2400);
      return () => clearTimeout(t);
    }
    window.addEventListener("velora-toast", onToast as EventListener);
    return () => window.removeEventListener("velora-toast", onToast as EventListener);
  }, []);

  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8">
      <p className="rounded-full bg-ink px-4 py-2 text-sm text-cream shadow-lg">{message}</p>
    </div>
  );
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("velora-toast", { detail: message }));
}
