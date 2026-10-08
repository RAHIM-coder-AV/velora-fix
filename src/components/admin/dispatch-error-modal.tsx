"use client";

import { X } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

interface DispatchErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  details?: string;
}

export function DispatchErrorModal({
  isOpen,
  onClose,
  title,
  message,
  details,
}: DispatchErrorModalProps) {
  const { locale } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-zinc-900 dark:text-zinc-100">
        {/* Red X Icon Circle */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500/30 text-red-500 dark:border-red-500/40">
          <X className="h-8 w-8 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-extrabold text-zinc-900 dark:text-white">
          {title || (locale === "ar" ? "خطأ" : "Erreur")}
        </h3>

        {/* Message */}
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {message || (locale === "ar" ? "حدث خطأ أثناء الإرسال" : "Une erreur est survenue lors de l'envoi.")}
        </p>

        {details ? (
          <p className="mt-3 break-words rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300">
            {details}
          </p>
        ) : null}

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-28 rounded-lg bg-purple-600 py-2 text-sm font-bold text-white shadow-md shadow-purple-600/30 transition hover:bg-purple-700 active:scale-95"
          >
            {locale === "ar" ? "حسناً" : "D'accord"}
          </button>
        </div>
      </div>
    </div>
  );
}
