"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight, FiChevronDown, FiGrid, FiHeart, FiMapPin, FiMenu,
  FiSearch, FiShoppingBag, FiTruck, FiTv, FiUser, FiX,
  FiBox, FiHome, FiBriefcase, FiWind, FiDroplet, FiLayers, FiArrowUpRight,
} from "react-icons/fi";
import { useCart } from "@/components/cart-provider";

const primaryLinks = [
  { label: "Rent", href: "#rentals" },
  { label: "Buy", href: "#buy" },
  { label: "Categories", href: "#categories" },
  { label: "How It Works", href: "#renting-journey-heading" },
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

function BrandLink() {
  return (
    <Link className="brand-link" href="#top" aria-label="Rento Comforts home">
      <Image src="/brand/rento-comforts.jpeg" alt="Rento Comforts" width={1080} height={1080} sizes="(max-width: 700px) 58px, 78px" unoptimized priority className="brand-link__image" />
    </Link>
  );
}

function UtilityLink({ href, children }) {
  return <a href={href}>{children}</a>;
}

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
    setPinMessage(`PIN ${pin} saved for this session. Serviceability is not verified here.`);
  }

  function closeNavigation() {
    setMobileOpen(false);
    setMobileCategory("");
    setActiveMenu("");
  }

  return (
    <header ref={headerRef} className="site-header" onKeyDown={handleKeyDown}>
      <div className="site-header__utility-bar">
        <div className="page-container site-header__utility-inner">
          <a className="utility-location" href="#rentals"><FiMapPin aria-hidden="true" /> Serving Bengaluru, Karnataka</a>
          <p className="utility-promise">Furniture and home appliances for rent or purchase</p>
          <nav className="utility-links" aria-label="Help links">
            <UtilityLink href="#faq-heading">Help</UtilityLink>
            <span aria-hidden="true" />
            <span className="utility-link--pending" aria-disabled="true">Track Order</span>
            <span aria-hidden="true" />
            <span className="utility-link--pending" aria-disabled="true">Contact Us</span>
          </nav>
        </div>
      </div>

      <div className="editorial-header">
        <div className="editorial-header__edge editorial-header__edge--left" aria-hidden="true" />
        <div className="editorial-header__edge editorial-header__edge--right" aria-hidden="true" />
        <div className="site-header__main page-container">
          <BrandLink />
          <nav className="desktop-nav" aria-label="Main navigation">
            {primaryLinks.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
          </nav>

          <div className="header-tools__search" ref={searchRef}>
            <form className="search-form" role="search" onSubmit={(event) => { event.preventDefault(); setSearchOpen(Boolean(query.trim())); }}>
              <FiSearch aria-hidden="true" />
              <label className="sr-only" htmlFor="site-search">Search category examples</label>
              <input id="site-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => query && setSearchOpen(true)} placeholder="Search furniture, appliances and more..." autoComplete="off" aria-controls="search-suggestions" />
              <button type="submit" aria-label="Search category examples"><FiSearch aria-hidden="true" /></button>
            </form>
            {searchOpen && query.trim() && <div className="search-suggestions" id="search-suggestions" aria-live="polite">
              {matches.length ? <><p>Category suggestions</p><ul>{matches.map((name) => <li key={name}><a href={`#cat-${name.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setSearchOpen(false)}>{name}<FiArrowUpRight aria-hidden="true" /></a></li>)}</ul><span>These are illustrative category examples. Product search is not connected yet.</span></> : <p className="search-suggestions__empty">No matching category examples. Product search is not connected yet.</p>}
            </div>}
          </div>

          <div className="pin-check" ref={pinRef}>
            <button className="pin-trigger" type="button" aria-expanded={pinOpen} aria-controls="pin-popover" onClick={() => setPinOpen((value) => !value)}><FiMapPin aria-hidden="true" /><span><small>Deliver to</small><strong>{savedPin ? `PIN ${savedPin}` : "Bengaluru"}</strong></span><FiChevronDown aria-hidden="true" /></button>
            {pinOpen && <form id="pin-popover" className="pin-popover" onSubmit={checkPin}>
              <label htmlFor="pin-code">Enter a six-digit PIN code</label>
              <div><input id="pin-code" value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, "").slice(0, 6)); setPinMessage(""); }} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="e.g. 560001" /><button type="submit">Save</button></div>
              <span className="pin-check__message" aria-live="polite">{pinMessage || "Serviceability is not verified by this preview."}</span>
            </form>}
          </div>

          <div className="header-actions" aria-label="Shopping tools">
            <button type="button" onClick={() => setNotice("Wishlist is not available yet.")} aria-label="Wishlist, not available yet"><FiHeart aria-hidden="true" /><span>Wishlist</span></button>
            <button type="button" onClick={() => setNotice("Account access is not available yet.")} aria-label="Account, not available yet"><FiUser aria-hidden="true" /><span>Account</span></button>
            <Link href="/cart" className="cart-action" aria-label={`Cart, ${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`}>
              <span className="cart-action__icon"><FiShoppingBag aria-hidden="true" /><span className="cart-action__count" aria-hidden="true">{cartItems.length}</span></span><span>Cart</span>
            </Link>
          </div>

          <button className="mobile-search-toggle" type="button" aria-label="Focus category search" onClick={() => document.getElementById("site-search")?.focus()}><FiSearch aria-hidden="true" /></button>
          <button className="menu-toggle" type="button" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="category-navigation" onMouseEnter={() => window.clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
        <div className="page-container category-navigation__inner">
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
