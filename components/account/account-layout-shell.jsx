"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AccountCompactNavigation, AccountSidebar } from "@/components/account/account-sidebar";

function getActiveSection(pathname) {
  if (pathname === "/account/orders" || pathname === "/dev/orders-preview") return "orders";
  if (pathname?.startsWith("/account/rentals")) return "rentals";
  if (pathname?.startsWith("/account/addresses")) return "addresses";
  if (pathname?.startsWith("/account/payments")) return "payments";
  if (pathname === "/account/personal-information") return "personal-information";
  return "overview";
}

export default function AccountLayoutShell({ children, hideUtilityBar = false, showAccountBanner = true, showAccountCategories = true }) {
  const pathname = usePathname();
  const shellRef = useRef(null);
  const activeSection = getActiveSection(pathname);
  const isRentalPreview = pathname === "/account/rentals/preview";

  useEffect(() => {
    const shell = shellRef.current;
    const content = shell?.querySelector(".account-layout-content");
    if (!shell || !content) return undefined;

    const updateSidebarFlowOffset = () => {
      const banner = content.querySelector(".account-welcome-banner");
      const main = content.querySelector("main");
      const bannerHeight = banner?.getBoundingClientRect().height ?? 0;
      const mainInset = main ? Number.parseFloat(window.getComputedStyle(main).paddingTop) || 0 : 0;
      shell.style.setProperty("--account-sidebar-flow-offset", `${bannerHeight + mainInset}px`);
      shell.style.setProperty("--account-viewport-width", `${document.documentElement.clientWidth}px`);
    };

    updateSidebarFlowOffset();
    window.addEventListener("resize", updateSidebarFlowOffset);
    const mutationObserver = new MutationObserver(updateSidebarFlowOffset);
    mutationObserver.observe(content, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(updateSidebarFlowOffset);
    resizeObserver.observe(content);

    return () => {
      window.removeEventListener("resize", updateSidebarFlowOffset);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      shell.style.removeProperty("--account-sidebar-flow-offset");
      shell.style.removeProperty("--account-viewport-width");
    };
  }, [pathname]);

  return (
    <>
      <SiteHeader hideUtilityBar={hideUtilityBar} showCategories={showAccountCategories} />
      <div
        ref={shellRef}
        className={`account-layout-shell${isRentalPreview ? " account-layout-shell--rental-preview" : ""}${showAccountBanner ? "" : " account-layout-shell--hide-banner"}`}
        style={{ "--account-sidebar-flow-offset": `${showAccountBanner ? (activeSection === "orders" ? 136 : activeSection === "personal-information" ? 192 : 184) : 0}px` }}
      >
        <AccountSidebar activeSection={activeSection} className="account-layout-sidebar" />
        <div className="account-layout-content">
          <AccountCompactNavigation activeSection={activeSection} />
          {children}
        </div>
      </div>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
