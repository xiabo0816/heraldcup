import Image from "next/image";
import clsx from "clsx";

export type HeroChipData = {
  label: string;
  slug: string | null;
  iconUrl: string | null;
  imageUrl: string | null;
};

export function HeroChip({
  hero,
  compact = false,
  className
}: {
  hero: HeroChipData;
  compact?: boolean;
  className?: string;
}) {
  const imageSize = compact ? 24 : 30;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink/90 px-2.5 py-1.5 text-slate-100",
        compact ? "text-[11px]" : "text-xs",
        className
      )}
    >
      {hero.iconUrl ? (
        <Image
          src={hero.iconUrl}
          alt={hero.label}
          width={imageSize}
          height={imageSize}
          className="h-6 w-6 rounded-full border border-white/10 object-cover"
          unoptimized
        />
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold text-slate-300">
          {hero.label.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span>{hero.label}</span>
    </span>
  );
}