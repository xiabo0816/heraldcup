import type { ReactNode } from "react";
import clsx from "clsx";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={clsx("mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10", className)}>{children}</main>;
}
