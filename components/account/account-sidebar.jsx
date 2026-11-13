"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiBox,
  FiChevronDown,
  FiCreditCard,
  FiHeadphones,
  FiHeart,
  FiHome,
  FiMapPin,
  FiSettings,
  FiTruck,
  FiUser,
} from "react-icons/fi";

const sidebarItems = [
  { label: "Overview", Icon: FiHome, href: "/account", section: "overview" },
  { label: "Personal Information", Icon: FiUser, href: "/account/personal-information", section: "personal-information" },
  { label: "My Orders", Icon: FiBox, href: "/account/orders", section: "orders" },
  { label: "My Rentals", Icon: FiTruck, href: "/account/rentals", section: "rentals" },
  { label: "Wishlist", Icon: FiHeart },
  { label: "My Addresses", Icon: FiMapPin },
  { label: "Payments & Invoices", Icon: FiCreditCard },
  { label: "Help & Support", Icon: FiHeadphones },
  { label: "Account Settings", Icon: FiSettings },
];

export function AccountSidebar({ activeSection = "overview", className = "" }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const siteHeader = document.querySelector(".site-header");
    if (!sidebar || !siteHeader) return undefined;

    const updateOffset = () => {
      const stickyTop = window.innerWidth >= 1280
        ? Math.max(0, Math.round(siteHeader.getBoundingClientRect().bottom))
        : 0;
      sidebar.style.setProperty("--account-sidebar-top", `${stickyTop}px`);
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);
    const resizeObserver = new ResizeObserver(updateOffset);
    resizeObserver.observe(siteHeader);

    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
      resizeObserver.disconnect();
      sidebar.style.removeProperty("--account-sidebar-top");
    };
  }, []);

  return (
    <aside ref={sidebarRef} className={`account-sidebar-sticky hidden xl:block ${className}`}>
      <nav
        aria-label="Account sections"
        className="account-sidebar-nav overflow-y-auto overscroll-contain rounded-2xl border border-[#e8e6df] bg-white p-2.5 shadow-[0_5px_22px_rgba(37,41,37,0.05)]"
      >
        <ul className="space-y-0">
          {sidebarItems.map(({ label, Icon, href, section }) => (
            <li key={label} className="border-b border-[#eceae4] last:border-b-0">
              {href ? (
                <Link
                  href={href}
                  aria-current={activeSection === section ? "page" : undefined}
                  prefetch
                  scroll={false}
                  className={`flex min-h-[40px] items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] ${
                    activeSection === section
                      ? "my-0.5 bg-[#08763b] font-bold !text-white"
                      : "font-semibold text-[#303731] hover:bg-[#f3f6f1] hover:text-[#124734]"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                  {label}
                </Link>
              ) : (
                <span
                  className="flex min-h-[40px] cursor-not-allowed items-center gap-2.5 px-2.5 text-[13px] text-[#687169]"
                  aria-disabled="true"
                  title={`${label} is not connected yet`}
                >
                  <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                  <span className="min-w-0 flex-1">{label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8b928b]">Soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function AccountCompactNavigation({ activeSection = "overview" }) {
  const activeItem = sidebarItems.find((item) => item.section === activeSection);

  return (
    <nav aria-label="Account sections" className="account-compact-navigation mx-auto hidden w-full max-w-[1560px] px-4 pt-3 sm:block xl:hidden sm:px-7 lg:px-8">
      <details className="group rounded-xl border border-[#e5e3dc] bg-white shadow-[0_3px_14px_rgba(37,41,37,0.04)]">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 text-sm font-semibold text-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-2.5">
            {activeItem?.Icon && <activeItem.Icon aria-hidden="true" className="size-5 shrink-0" />}
            <span className="truncate">{activeItem?.label ?? "My Account"}</span>
            <span className="text-xs font-normal text-[#69736b]">Account menu</span>
          </span>
          <FiChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="grid gap-1 border-t border-[#eceae4] p-2 sm:grid-cols-2 lg:grid-cols-4">
          {sidebarItems.map(({ label, Icon, href, section }) => (
            <li key={label}>
              {href ? (
                <Link
                  href={href}
                  aria-current={activeSection === section ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#017f36] ${activeSection === section ? "bg-[#08763b] font-bold text-white" : "text-[#303731] hover:bg-[#f3f6f1]"}`}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />{label}
                </Link>
              ) : (
                <span aria-disabled="true" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-[#687169]">
                  <Icon aria-hidden="true" className="size-4 shrink-0" />{label}<span className="ml-auto text-[10px] uppercase text-[#8b928b]">Soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
