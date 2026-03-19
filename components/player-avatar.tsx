import Image from "next/image";
import clsx from "clsx";

function getInitial(value: string) {
  return Array.from(value.trim())[0]?.toLocaleUpperCase("zh-CN") ?? "?";
}

export function PlayerAvatar({
  src,
  alt,
  size = "md",
  className
}: {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const pixels = size === "sm" ? 40 : size === "lg" ? 64 : 48;

  if (!src) {
    return (
      <span className={clsx("inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300", sizeClass, className)}>
        {getInitial(alt)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={pixels}
      height={pixels}
      className={clsx("rounded-2xl border border-white/10 object-cover", sizeClass, className)}
      unoptimized
    />
  );
}