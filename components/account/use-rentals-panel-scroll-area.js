"use client";

import { useEffect } from "react";

export function useRentalsPanelScrollArea(areaRef) {
  useEffect(() => {
    const area = areaRef.current;
    const siteHeader = document.querySelector(".site-header");
    if (!area || !siteHeader) return undefined;

    const updateLayout = () => {
      const panel = area.querySelector(".account-rentals-panel");
      if (window.innerWidth < 1280 || !panel) {
        area.style.removeProperty("--account-rentals-area-height");
        area.classList.remove("account-rentals-scroll-active");
        return;
      }

      const headerRect = siteHeader.getBoundingClientRect();
      area.style.setProperty("--account-rentals-area-height", `${Math.max(320, window.innerHeight - headerRect.height)}px`);
      const areaTop = area.getBoundingClientRect().top;
      const paddingTop = Number.parseFloat(window.getComputedStyle(area).paddingTop) || 0;
      const wasActive = area.classList.contains("account-rentals-scroll-active");
      const isActive = areaTop + paddingTop <= headerRect.bottom + 1;
      area.classList.toggle("account-rentals-scroll-active", isActive);
      if (wasActive && !isActive) panel.scrollTop = 0;
    };

    updateLayout();
    window.addEventListener("scroll", updateLayout, { passive: true });
    window.addEventListener("resize", updateLayout);
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(siteHeader);

    return () => {
      window.removeEventListener("scroll", updateLayout);
      window.removeEventListener("resize", updateLayout);
      resizeObserver.disconnect();
      area.style.removeProperty("--account-rentals-area-height");
      area.classList.remove("account-rentals-scroll-active");
    };
  }, [areaRef]);
}
