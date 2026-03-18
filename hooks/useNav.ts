"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNav() {
  const router = useRouter();

  const go = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const replace = useCallback((path: string) => {
    router.replace(path);
  }, [router]);

  const back = useCallback(() => {
    router.back();
  }, [router]);

  return { go, replace, back, router };
}