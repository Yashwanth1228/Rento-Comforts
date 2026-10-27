"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiArrowUpRight, FiHeart, FiMapPin, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

const navItems = [
  { label: "Furniture", href: "#furniture" },
  { label: "Home Appliances", href: "#appliances" },
  { label: "Rent", href: "#rentals" },
  { label: "Buy", href: "#buy" },
];
const categoryNames = ["Sofas", "Beds", "Wardrobes", "Dining Tables", "Study Tables", "Refrigerators", "Washing Machines", "Televisions", "Air Conditioners", "Microwaves"];

function BrandLink() {
  return (
    <Link className="brand-link" href="#top" aria-label="Rento Comforts home">
      <Image src="/brand/rento-comforts.jpeg" alt="Rento Comforts company logo" width={1080} height={1080} sizes="88px" unoptimized priority className="brand-link__image" />
    </Link>
  );
}

export function SiteHeader() {
  const { items: cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [notice, setNotice] = useState("");
  const reduceMotion = useReducedMotion() === true;
  const menuButtonRef = useRef(null);
  const searchWrapRef = useRef(null);
  const matches = query.trim().length > 0 ? categoryNames.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase())) : [];

  useEffect(() => {
    function closeOnOutside(event) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) setSearchOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  function closeMenu() { setMenuOpen(false); }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setSearchOpen(false);
      if (menuOpen) {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    }
  }

  function checkPin(event) {
    event.preventDefault();
    setPinMessage(/^\d{6}$/.test(pin) ? "PIN validation is not connected, so serviceability cannot be confirmed." : "Enter a valid six-digit PIN code. Serviceability cannot be confirmed here yet.");
  }

  return (
    <header className="site-header" onKeyDown={handleKeyDown}>
      <div className="site-header__utility-bar">
        <div className="page-container site-header__utility-inner">
          <p><FiMapPin aria-hidden="true" /> Bengaluru, India <span aria-hidden="true">·</span> All prices in INR</p>
          <p>Rental-first <span aria-hidden="true">·</span> Selected products available to buy</p>
        </div>
      </div>

      <div className="site-header__main page-container">
        <BrandLink />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}
        </nav>

        <div className="header-tools__search" ref={searchWrapRef}>
          <form className="search-form" role="search" onSubmit={(event) => { event.preventDefault(); setSearchOpen(Boolean(query.trim())); }}>
            <FiSearch aria-hidden="true" />
            <label className="sr-only" htmlFor="site-search">Search categories</label>
            <input id="site-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => query && setSearchOpen(true)} placeholder="Search furniture & appliances" autoComplete="off" aria-controls="search-suggestions" />
            <button type="submit" aria-label="Show category suggestions">Search</button>
          </form>
          {searchOpen && query.trim() && <div className="search-suggestions" id="search-suggestions" aria-live="polite">
            {matches.length ? <><p>Category suggestions</p><ul>{matches.map((name) => <li key={name}><a href={`#cat-${name.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setSearchOpen(false)}>{name}<FiArrowUpRight aria-hidden="true" /></a></li>)}</ul><span>Product search will be available with the catalogue.</span></> : <p className="search-suggestions__empty">No matching category. Product results are not available until the catalogue is connected.</p>}
          </div>}
        </div>

        <form className="pin-check" onSubmit={checkPin}>
          <label className="sr-only" htmlFor="pin-code">Delivery PIN code</label>
          <input id="pin-code" value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, "").slice(0, 6)); setPinMessage(""); }} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="PIN code" />
          <button type="submit">Check PIN</button>
          <span className="pin-check__message" aria-live="polite">{pinMessage}</span>
        </form>

        <div className="header-actions" aria-label="Shopping tools">
          <button type="button" onClick={() => setNotice("Account access is not available yet.")} aria-label="Account, not available yet"><FiUser aria-hidden="true" /><span>Account</span></button>
          <button type="button" onClick={() => setNotice("Wishlist is not available yet.")} aria-label="Wishlist, not available yet"><FiHeart aria-hidden="true" /><span>Wishlist</span></button>
          <Link href="/cart" className="cart-action" aria-label={`Cart, ${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`}>
            <span className="cart-action__icon">
              <FiShoppingBag aria-hidden="true" />
              {cartItems.length > 0 && <span className="cart-action__count" aria-hidden="true">{cartItems.length}</span>}
            </span>
            <span>Cart</span>
          </Link>
        </div>

        <Button ref={menuButtonRef} type="button" variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </Button>
      </div>

      <p className="header-notice" role="status">{notice}</p>
      <AnimatePresence initial={false}>{menuOpen && <motion.nav id="mobile-navigation" key="mobile-navigation" className="mobile-nav page-container" aria-label="Main navigation" initial={reduceMotion ? false : { opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}>
        {navItems.map((item) => <Link href={item.href} key={item.label} onClick={closeMenu}>{item.label}<FiArrowUpRight aria-hidden="true" /></Link>)}
      </motion.nav>}</AnimatePresence>
    </header>
  );
}
