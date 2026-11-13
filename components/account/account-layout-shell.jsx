"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AccountCompactNavigation, AccountSidebar } from "@/components/account/account-sidebar";

function getActiveSection(pathname) {
  if (pathname === "/account/orders") return "orders";
  if (pathname === "/account/rentals") return "rentals";
  if (pathname === "/account/personal-information") return "personal-information";
  return "overview";
}

export default function AccountLayoutShell({ children }) {
  const pathname = usePathname();
  const shellRef = useRef(null);
  const activeSection = getActiveSection(pathname);

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
    };
  }, [pathname]);

  return (
    <>
      <SiteHeader />
      <div
        ref={shellRef}
        className="account-layout-shell"
        style={{ "--account-sidebar-flow-offset": `${activeSection === "orders" ? 136 : activeSection === "personal-information" ? 192 : 184}px` }}
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
