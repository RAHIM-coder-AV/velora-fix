import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary:
      "bg-ink text-cream hover:bg-black disabled:bg-muted",
    secondary:
      "bg-cream-2 text-ink hover:bg-line",
    ghost: "bg-transparent text-ink hover:bg-cream-2",
    outline: "border border-ink text-ink hover:bg-ink hover:text-cream",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none px-5 py-3 text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-200 disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
