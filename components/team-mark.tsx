import Image from "next/image";
import clsx from "clsx";

function getInitial(value: string) {
  return Array.from(value.trim())[0]?.toLocaleUpperCase("zh-CN") ?? "?";
}

export function TeamMark({
  name,
  logoUrl,
  size = "md",
  className
}: {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = {
    sm: "h-10 w-10 rounded-2xl text-sm",
    md: "h-14 w-14 rounded-[20px] text-lg",
    lg: "h-20 w-20 rounded-[28px] text-2xl"
  }[size];

  return logoUrl ? (
    <Image
      src={logoUrl}
      alt={name}
      width={80}
      height={80}
      unoptimized
      className={clsx(sizeClass, "border border-white/10 object-cover", className)}
    />
  ) : (
    <div
      className={clsx(
        sizeClass,
        "inline-flex items-center justify-center border border-amber-400/25 bg-gradient-to-br from-amber-400/20 via-white/5 to-cyan-400/15 font-semibold tracking-[0.14em] text-amber-100",
        className
      )}
    >
      {getInitial(name)}
    </div>
  );
}