"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { soundEngine } from "@/utils/soundEngine";

export function AudioCleanupProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      soundEngine.stopAll();
    }
  }, [pathname]);

  return null;
}
