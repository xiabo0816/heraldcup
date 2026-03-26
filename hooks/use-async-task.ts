"use client";

import { useState, useTransition } from "react";

export function useAsyncTask() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function clearError() {
    setError(null);
  }

  function run(task: () => Promise<void>) {
    startTransition(async () => {
      await task();
    });
  }

  return {
    error,
    setError,
    clearError,
    isPending,
    run
  };
}