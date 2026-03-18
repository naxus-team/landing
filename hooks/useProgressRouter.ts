"use client";

import { useRouter }   from "next/navigation";
import { useCallback } from "react";

export function triggerProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("naxus:progress:start"));
  }
}

export function useProgressRouter() {
  const router = useRouter();

  const push = useCallback((href: string) => {
    triggerProgress();
    router.push(href);
  }, [router]);

  const replace = useCallback((href: string) => {
    triggerProgress();
    router.replace(href);
  }, [router]);

  const back = useCallback(() => {
    triggerProgress();
    router.back();
  }, [router]);

  return { push, replace, back };
}