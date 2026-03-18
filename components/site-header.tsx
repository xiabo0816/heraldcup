import Link from "next/link";

const links = [
  { href: "/players", label: "选手" },
  { href: "/teams", label: "队伍" },
  { href: "/matches", label: "比赛" },
  { href: "/content", label: "内容" },
  { href: "/my", label: "我的" },
  { href: "/admin", label: "管理" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-gold text-sm font-bold text-ink shadow-glow">
            HC
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">Herald Cup</div>
            <div className="text-xs text-slate-400">Next.js 全栈赛事系统</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm text-slate-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-accent-cyan/60 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
