"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiHeart,
  FiHome,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

const navigationItems = [
  { label: "Home", href: "/", Icon: FiHome },
  { label: "Categories", href: "/products", Icon: FiGrid },
  { label: "Wishlist", disabled: true, Icon: FiHeart },
  { label: "Account", href: "/account", Icon: FiUser },
  { label: "Cart", href: "/cart", Icon: FiShoppingCart },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e3dc] bg-white/95 px-2 pt-2 shadow-[0_-6px_24px_rgba(37,41,37,0.09)] backdrop-blur xl:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {navigationItems.map(({ label, href, Icon, disabled }) => {
          const active =
            !disabled &&
            (href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`));
          const itemClassName = `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] ${
            active
              ? "bg-[#e9f1e9] text-[#124734]"
              : disabled
                ? "cursor-not-allowed text-[#7c827c]"
                : "text-[#424942] hover:bg-[#f3f5f0]"
          }`;

          return (
            <li key={label}>
              {disabled ? (
                <span
                  className={itemClassName}
                  aria-disabled="true"
                  title="Wishlist is not connected yet"
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span>{label}</span>
                </span>
              ) : (
                <Link
                  href={href}
                  className={itemClassName}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span>{label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileBottomNav;
