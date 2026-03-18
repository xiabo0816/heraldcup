"use client";

import { useFormStatus } from "react-dom";

export function AdminFormSubmit({
  idleLabel,
  pendingLabel,
  variant = "primary"
}: {
  idleLabel: string;
  pendingLabel: string;
  variant?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();

  const className =
    variant === "danger"
      ? "rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100 disabled:opacity-60"
      : "rounded-full bg-accent-gold px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60";

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
