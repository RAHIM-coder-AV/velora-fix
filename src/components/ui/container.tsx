import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-5 md:px-8", className)}>{children}</div>
  );
}

export function SectionHeading({
  kicker,
  title,
  action,
}: {
  kicker?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
      <div className="min-w-0">
        {kicker ? (
          <p className="mb-2 text-[11px] tracking-[0.22em] uppercase text-sand">{kicker}</p>
        ) : null}
        <h2 className="break-words font-serif text-2xl sm:text-3xl md:text-4xl">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
