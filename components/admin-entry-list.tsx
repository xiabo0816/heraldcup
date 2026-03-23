import Link from "next/link";

export function AdminEntryList({
  title,
  description,
  fields,
  createLabel
}: {
  title: string;
  description: string;
  fields: string[];
  createLabel: string;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-accent-cyan">Admin Resource</div>
          <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{description}</p>
        </div>
        <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
          返回后台首页
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">一期范围</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {fields.map((field) => (
            <span key={field} className="rounded-full border border-white/10 bg-ink px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-200">
              {field}
            </span>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-accent-gold/40 bg-accent-gold/5 px-4 py-4 text-sm leading-7 text-slate-300">
          当前页会先承接字段整理和资源梳理，后续再补充更完整的维护流程。
        </div>
        <button type="button" className="mt-5 rounded-full bg-accent-gold px-5 py-3 text-sm font-semibold text-ink">
          {createLabel}
        </button>
      </div>
    </section>
  );
}
