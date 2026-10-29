"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight, FiChevronDown, FiGrid, FiHeart, FiMapPin, FiMenu,
  FiSearch, FiShoppingCart, FiTruck, FiTv, FiUser, FiX,
  FiBox, FiHome, FiBriefcase, FiWind, FiDroplet, FiLayers, FiArrowUpRight,
  FiShield,
} from "react-icons/fi";
import { useCart } from "@/components/cart-provider";

// Primary Links: Strictly "Rent" and "Buy"
const primaryLinks = [
  { label: "Rent", href: "#rentals" },
  { label: "Buy", href: "#buy" },
];

const menuTabs = [
  { id: "furniture", label: "Furniture", icon: FiHome },
  { id: "appliances", label: "Appliances", icon: FiGrid },
  { id: "combos", label: "Combos", icon: FiBox },
  { id: "packers", label: "Packers & Movers", icon: FiTruck },
];

const menuContent = {
  furniture: {
    groups: [
      { heading: "Living Room", icon: FiHome, links: [{ label: "Sofas", href: "#cat-sofas" }] },
      { heading: "Bedroom", icon: FiLayers, links: [{ label: "Beds", href: "#cat-beds" }, { label: "Wardrobes", href: "#cat-wardrobes" }] },
      { heading: "Dining & Work", icon: FiBriefcase, links: [{ label: "Dining Tables", href: "#cat-dining-tables" }, { label: "Study Tables", href: "#cat-study-tables" }] },
    ],
    promo: true,
  },
  appliances: {
    groups: [
      { heading: "Cooling", icon: FiWind, links: [{ label: "Refrigerators", href: "#cat-refrigerators" }, { label: "Air Conditioners", href: "#cat-air-conditioners" }] },
      { heading: "Laundry", icon: FiDroplet, links: [{ label: "Washing Machines", href: "#cat-washing-machines" }] },
      { heading: "Entertainment & Kitchen", icon: FiTv, links: [{ label: "Televisions", href: "#cat-televisions" }, { label: "Microwaves", href: "#cat-microwaves" }] },
    ],
    promo: false,
  },
  combos: { groups: [], pending: "Product bundles and their catalogue destinations are not configured yet." },
  packers: { groups: [], pending: "Service details and booking destinations are not configured yet." },
};

const allCategoryLabels = ["Sofas", "Beds", "Wardrobes", "Dining Tables", "Study Tables", "Refrigerators", "Washing Machines", "Televisions", "Air Conditioners", "Microwaves"];

function CategoryMenu({ id, compact = false, onSelect }) {
  const content = menuContent[id];
  if (!content) return null;
  if (content.pending) return <p className="mega-menu__pending">{content.pending}</p>;
  return (
    <div className={compact ? "mobile-category__links" : "mega-menu__groups"}>
      {content.groups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <section className="mega-menu__group" key={group.heading}>
            <h3><GroupIcon aria-hidden="true" />{group.heading}</h3>
            <ul>{group.links.map((item) => <li key={item.label}><a href={item.href} onClick={onSelect}>{item.label}<FiArrowUpRight aria-hidden="true" /></a></li>)}</ul>
          </section>
        );
      })}
      {!compact && content.promo && (
        <aside className="mega-menu__promo">
          <Image src="/images/rento-living-room.webp" alt="Illustrative warm living room with sofa and coffee table" fill sizes="(max-width: 1250px) 35vw, 24vw" />
          <div className="mega-menu__promo-copy">
            <span>PREMIUM LIVING</span>
            <h3>Furniture for Every Chapter of Life</h3>
            <p>Explore furniture for rent or purchase in Bengaluru.</p>
            <a href="#categories" onClick={onSelect}>Explore Furniture <FiArrowRight aria-hidden="true" /></a>
          </div>
        </aside>
      )}
    </div>
  );
}

export function SiteHeader() {
  const { items: cartItems } = useCart();
  const [activeMenu, setActiveMenu] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState("");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [savedPin, setSavedPin] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const pinRef = useRef(null);
  const closeTimer = useRef(null);
  const categoryButtonRefs = useRef({});
  const matches = query.trim() ? allCategoryLabels.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase())) : [];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1050px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    function handleOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveMenu("");
        setMobileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
      if (pinRef.current && !pinRef.current.contains(event.target)) setPinOpen(false);
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function openMenu(id) {
    window.clearTimeout(closeTimer.current);
    setActiveMenu(id);
  }

  function scheduleClose() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveMenu(""), 180);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setActiveMenu("");
      setMobileOpen(false);
      setSearchOpen(false);
      setPinOpen(false);
      categoryButtonRefs.current[activeMenu]?.focus();
    }
  }

  function checkPin(event) {
    event.preventDefault();
    if (!/^\d{6}$/.test(pin)) {
      setPinMessage("Enter a valid six-digit PIN code.");
      return;
    }
    setSavedPin(pin);
    setPinMessage(`PIN ${pin} confirmed for scheduled delivery across Bengaluru.`);
    setTimeout(() => setPinOpen(false), 1200);
  }

  function closeNavigation() {
    setMobileOpen(false);
    setMobileCategory("");
    setActiveMenu("");
  }

  return (
    <header ref={headerRef} className="site-header" onKeyDown={handleKeyDown}>
      {/* 1. Top Utility Bar (Full-width, no outer margin) */}
      <div className="site-header__utility-bar">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1 text-xs text-white">
          {/* Left: Location Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setPinOpen((prev) => !prev)}
            className="flex items-center gap-1.5 text-white/95 hover:text-white font-medium cursor-pointer transition-colors"
          >
            <FiMapPin className="w-3.5 h-3.5 text-[#2ecb71]" />
            <span>Deliver to Bengaluru, {savedPin || "560001"}</span>
            <FiChevronDown className="w-3 h-3 text-white/70" />
          </button>

          {/* Center: 3 Value Props */}
          <div className="hidden lg:flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1.5">
              <FiTruck className="w-3.5 h-3.5 text-white/80" />
              <span>Flexible Rental Plans</span>
            </span>
            <span className="text-white/30 font-light">|</span>
            <span className="flex items-center gap-1.5">
              <FiShield className="w-3.5 h-3.5 text-white/80" />
              <span>Quality Furniture &amp; Appliances</span>
            </span>
            <span className="text-white/30 font-light">|</span>
            <span className="flex items-center gap-1.5">
              <FiHome className="w-3.5 h-3.5 text-white/80" />
              <span>Hassle-Free Relocation</span>
            </span>
          </div>

          {/* Right: Help, Track Order, Contact Us */}
          <nav className="flex items-center gap-3 text-white/85">
            <a href="#faq-heading" className="hover:text-white transition-colors">Help</a>
            <span className="text-white/30 font-light">|</span>
            <span
              className="hover:text-white transition-colors cursor-pointer"
              onClick={() => setNotice("Order tracking will be active upon launch.")}
            >
              Track Order
            </span>
            <span className="text-white/30 font-light">|</span>
            <a href="#site-footer" className="hover:text-white transition-colors">Contact Us</a>
          </nav>
        </div>
      </div>

      {/* 2. Middle Editorial Navbar (Full-width row, no outer margin, transparent appliances cutout with fade) */}
      <div className="editorial-navbar-card">
        {/* Left Decorative Image: Transparent Home Appliances cutout, fades to navbar color before logo */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[105px] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/navbar-appliances-transparent.png')",
            backgroundSize: "contain",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />

        {/* Right Decorative Image: Confined to far-right edge, fades out before customer controls */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[83px] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/navbar-decor-right-fade.png')",
            backgroundSize: "cover",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />

        {/* Central Content Area: Placed on clean warm-ivory surface with safe inset from decor edges */}
        <div className="relative z-10 w-full h-full flex items-center justify-between pl-[108px] pr-[94px] sm:pl-[116px] sm:pr-[98px] lg:pl-[120px] lg:pr-[104px] gap-2 lg:gap-3.5">
          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden p-1.5 text-charcoal hover:text-brand-green mr-1 cursor-pointer"
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          {/* Left: Brand Logo & Primary Links (Rent, Buy only) */}
          <div className="flex items-center gap-3.5 sm:gap-5 lg:gap-6 shrink-0">
            <Link href="/" className="inline-flex items-center gap-2 shrink-0 group focus-visible:outline-none" aria-label="Rento Comforts home">
              <Image
                src="/brand/rento-symbol-green.png"
                alt="Rento Comforts"
                width={34}
                height={34}
                priority
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="font-sans font-extrabold text-[17px] sm:text-[18px] tracking-wider text-[#063c2e] leading-none">
                  RENTO
                </span>
                <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.26em] font-semibold text-[#063c2e]/80 uppercase mt-0.5 leading-none">
                  COMFORTS
                </span>
              </div>
            </Link>

            {/* Primary Links: Clean, balanced, Rent & Buy only */}
            <nav className="hidden sm:flex items-center gap-3.5 lg:gap-4.5" aria-label="Main navigation">
              {primaryLinks.map((item) => (
                <a
                  href={item.href}
                  key={item.label}
                  className="text-xs sm:text-[13px] font-semibold text-[#1e2d26] hover:text-[#017F36] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Center: Search Bar (Balanced width, pill shape) */}
          <div className="flex-1 max-w-[260px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-[480px] mx-1 sm:mx-2.5 relative" ref={searchRef}>
            <form
              className="editorial-search-pill"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                setSearchOpen(Boolean(query.trim()));
              }}
            >
              <FiSearch className="w-3.5 h-3.5 text-charcoal/50 ml-3 shrink-0" aria-hidden="true" />
              <label className="sr-only" htmlFor="site-search">Search category examples</label>
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => query && setSearchOpen(true)}
                placeholder="Search for furniture, home appliances and more..."
                autoComplete="off"
                aria-controls="search-suggestions"
                className="w-full h-full bg-transparent px-2.5 text-xs text-charcoal outline-none placeholder:text-charcoal/50"
              />
              <button
                type="submit"
                aria-label="Search"
                className="editorial-search-button"
              >
                <FiSearch className="w-3 h-3 text-white" aria-hidden="true" />
              </button>
            </form>

            {searchOpen && query.trim() && (
              <div className="search-suggestions" id="search-suggestions" aria-live="polite">
                {matches.length ? (
                  <>
                    <p>Category suggestions</p>
                    <ul>
                      {matches.map((name) => (
                        <li key={name}>
                          <a href={`#cat-${name.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setSearchOpen(false)}>
                            {name}<FiArrowUpRight aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                    <span>These are illustrative category examples. Product search is not connected yet.</span>
                  </>
                ) : (
                  <p className="search-suggestions__empty">No matching category examples. Product search is not connected yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Right Controls Container: Fades from Deliver to, becoming solid white at Cart, no partition lines */}
          <div className="editorial-right-container shrink-0">
            {/* Deliver to Location Selector */}
            <div className="relative shrink-0" ref={pinRef}>
              <button
                type="button"
                onClick={() => setPinOpen((val) => !val)}
                aria-expanded={pinOpen}
                aria-controls="pin-popover"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 cursor-pointer group text-left rounded-lg transition-colors hover:bg-white/40"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#033f2f] shrink-0">
                  <FiMapPin className="w-3.5 h-3.5 text-[#033f2f]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[9.5px] text-charcoal/70 leading-tight">Deliver to</span>
                  <span className="text-[11.5px] font-bold text-[#063c2e] leading-tight flex items-center gap-0.5 group-hover:text-[#017F36] transition-colors">
                    Bengaluru, {savedPin || "560001"}
                    <FiChevronDown className="w-2.5 h-2.5 text-charcoal/60" />
                  </span>
                </div>
              </button>

              {pinOpen && (
                <form id="pin-popover" className="pin-popover" onSubmit={checkPin}>
                  <label htmlFor="pin-code">Enter a six-digit PIN code</label>
                  <div>
                    <input
                      id="pin-code"
                      value={pin}
                      onChange={(event) => {
                        setPin(event.target.value.replace(/\D/g, "").slice(0, 6));
                        setPinMessage("");
                      }}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="e.g. 560001"
                    />
                    <button type="submit">Save</button>
                  </div>
                  <span className="pin-check__message" aria-live="polite">
                    {pinMessage || "Serviceability is not verified by this preview."}
                  </span>
                </form>
              )}
            </div>

            {/* Customer Controls: Wishlist, Account, Cart (No partition lines, larger icons) */}
            <div className="flex items-center gap-1 sm:gap-1.5 pr-0.5">
              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setNotice("Wishlist is not available yet.")}
                className="editorial-control-btn group cursor-pointer"
                aria-label="Wishlist"
              >
                <FiHeart className="w-[18px] h-[18px] text-[#2b3a31] group-hover:text-[#017F36] transition-colors" />
                <span className="editorial-control-label text-[#2b3a31] group-hover:text-[#017F36] transition-colors">
                  Wishlist
                </span>
              </button>

              {/* Account */}
              <button
                type="button"
                onClick={() => setNotice("Account access is not available yet.")}
                className="editorial-control-btn group cursor-pointer"
                aria-label="Account"
              >
                <FiUser className="w-[18px] h-[18px] text-[#2b3a31] group-hover:text-[#017F36] transition-colors" />
                <span className="editorial-control-label text-[#2b3a31] group-hover:text-[#017F36] transition-colors flex items-center gap-0.5">
                  Account <FiChevronDown className="w-2.5 h-2.5 text-charcoal/60" />
                </span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="editorial-control-btn group"
                aria-label={`Cart, ${cartItems.length} items`}
              >
                <div className="relative">
                  <FiShoppingCart className="w-[18px] h-[18px] text-[#2b3a31] group-hover:text-[#017F36] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#017F36] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                    {cartItems.length}
                  </span>
                </div>
                <span className="editorial-control-label text-[#2b3a31] group-hover:text-[#017F36] transition-colors">
                  Cart
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Row (Full-width, no outer margin) */}
      <div className="category-navigation" onMouseEnter={() => window.clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
        <div className="w-full flex items-center gap-6 px-4 sm:px-6 lg:px-8 category-navigation__inner">
          {menuTabs.map((tab) => {
            const Icon = tab.icon;
            const expanded = activeMenu === tab.id;
            return <button key={tab.id} type="button" ref={(node) => { categoryButtonRefs.current[tab.id] = node; }} className={`category-navigation__tab${expanded ? " is-active" : ""}`} aria-expanded={isMobile ? mobileCategory === tab.id : expanded} aria-haspopup="true" aria-controls={isMobile ? "mobile-navigation" : "category-mega-menu"} onMouseEnter={() => !isMobile && openMenu(tab.id)} onFocus={() => !isMobile && openMenu(tab.id)} onClick={() => { if (isMobile) { setMobileOpen(true); setMobileCategory(mobileCategory === tab.id ? "" : tab.id); } else { openMenu(expanded ? "" : tab.id); } }}>
              <Icon aria-hidden="true" /><span>{tab.label}</span><FiChevronDown aria-hidden="true" className="category-navigation__chevron" />
            </button>;
          })}
        </div>
        {!isMobile && activeMenu && <div id="category-mega-menu" className="mega-menu page-container" onMouseEnter={() => window.clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
          <div className="mega-menu__content">
            <div className="mega-menu__heading"><span>{menuTabs.find((tab) => tab.id === activeMenu)?.label}</span><p>Explore category examples</p></div>
            <CategoryMenu id={activeMenu} onSelect={closeNavigation} />
            <p className="mega-menu__disclaimer">Category artwork and labels are illustrative; catalogue availability is not connected.</p>
          </div>
        </div>}
      </div>

      <p className={`header-notice${notice ? " is-visible" : ""}`} role="status">{notice}</p>

      {mobileOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
        <div className="mobile-nav__top"><span>Explore Rento Comforts</span><button type="button" onClick={closeNavigation} aria-label="Close menu"><FiX aria-hidden="true" /></button></div>
        {primaryLinks.map((item) => <a href={item.href} key={item.label} onClick={closeNavigation}>{item.label}<FiArrowUpRight aria-hidden="true" /></a>)}
        <div className="mobile-nav__categories">
          <p>Shop by category</p>
          {menuTabs.map((tab) => {
            const Icon = tab.icon;
            const expanded = mobileCategory === tab.id;
            return <section className="mobile-category" key={tab.id}>
              <button type="button" aria-expanded={expanded} onClick={() => setMobileCategory(expanded ? "" : tab.id)}><Icon aria-hidden="true" />{tab.label}<FiChevronDown aria-hidden="true" /></button>
              {expanded && <CategoryMenu id={tab.id} compact onSelect={closeNavigation} />}
            </section>;
          })}
        </div>
        <div className="mobile-nav__utility"><button type="button" onClick={() => { setPinOpen(true); setMobileOpen(false); }}>Enter delivery PIN</button><a href="#faq-heading" onClick={closeNavigation}>Help / FAQs</a><span>Track Order and Contact Us destinations are not configured.</span></div>
      </nav>}
    </header>
  );
}

export default SiteHeader;
