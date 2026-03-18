import type { ReactNode } from "react";
import clsx from "clsx";

export function SectionCard({
  title,
  eyebrow,
  children,
  className
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur",
        className
      )}
    >
      {eyebrow ? <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">{eyebrow}</div> : null}
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
