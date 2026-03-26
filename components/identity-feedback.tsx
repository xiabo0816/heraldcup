import type { IdentityFeedbackTone } from "@/lib/identity-client-types";

function getFeedbackClassName(tone: IdentityFeedbackTone) {
  if (tone === "success") {
    return "rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm leading-7 text-emerald-50 whitespace-pre-wrap";
  }

  if (tone === "error") {
    return "rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm leading-7 text-rose-50 whitespace-pre-wrap";
  }

  return "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300 whitespace-pre-wrap";
}

export function IdentityFeedbackMessage({ message, tone }: { message: string; tone: IdentityFeedbackTone }) {
  if (!message.trim()) {
    return null;
  }

  return <div className={getFeedbackClassName(tone)}>{message}</div>;
}

export function IdentityPendingNotice({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
      <span className="inline-flex items-center gap-3">
        <span className="inline-flex size-2 rounded-full bg-cyan-200 animate-pulse" />
        <span>{label}</span>
      </span>
    </div>
  );
}

export function IdentityPendingSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 animate-pulse">
      <div className="h-3 w-1/3 rounded-full bg-white/10" />
      <div className="h-3 w-5/6 rounded-full bg-white/10" />
      <div className="h-3 w-2/3 rounded-full bg-white/10" />
    </div>
  );
}

export function IdentityFieldError({ message }: { message?: string }) {
  if (!message?.trim()) {
    return null;
  }

  return <div className="text-xs leading-6 text-rose-300">{message}</div>;
}