"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function GTMPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && window.dataLayer) {
      window.dataLayer.push({
        event: "pageview",
        page: pathname,
      });
    }
  }, [pathname]);

  return null;
}