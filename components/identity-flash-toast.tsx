"use client";

import { useEffect, useState } from "react";
import { getIdentityFlashEventName, readIdentityFlashMessage } from "@/lib/identity-flash";

export function IdentityFlashToast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    function syncFlashMessage() {
      const nextMessage = readIdentityFlashMessage();
      if (nextMessage) {
        setMessage(nextMessage);
      }
    }

    syncFlashMessage();

    const eventName = getIdentityFlashEventName();
    window.addEventListener(eventName, syncFlashMessage);

    return () => {
      window.removeEventListener(eventName, syncFlashMessage);
    };
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] w-[min(420px,calc(100vw-2rem))]">
      <div className="rounded-[24px] border border-emerald-300/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.24),rgba(34,197,94,0.14))] px-5 py-4 text-sm text-emerald-50 shadow-[0_18px_60px_rgba(16,185,129,0.18)] backdrop-blur-md">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex size-2.5 shrink-0 rounded-full bg-emerald-200 animate-pulse" />
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-100/80">操作完成</div>
            <div className="mt-1 leading-6">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}