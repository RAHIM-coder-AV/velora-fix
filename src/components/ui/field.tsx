import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs tracking-[0.16em] uppercase text-muted">{label}</span>
      {children}
      {error ? <span className="block text-sm text-red-800">{error}</span> : null}
    </label>
  );
}

const control =
  "w-full border border-line bg-white px-3 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-ink";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-28", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, "public-select", className)} {...props} />;
}
