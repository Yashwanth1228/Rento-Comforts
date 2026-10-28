"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTag, FiMapPin, FiArrowRight } from "react-icons/fi";
import { LuArmchair, LuShieldCheck } from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const navigationGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "#categories" },
      { label: "Furniture", href: "#categories" },
      { label: "Home Appliances", href: "#categories" },
      { label: "New Arrivals", href: "#categories" },
      { label: "Rent", href: "#rent-or-buy" },
      { label: "Buy", href: "#rent-or-buy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Process", href: "#how-it-works" },
      { label: "Why Rento Comforts", href: "#why-choose-heading" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQs", href: "#faqs" },
      { label: "Delivery Information", href: "#delivery" },
      { label: "Terms & Conditions", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Return & Cancellation", href: "#returns" },
      { label: "Support", href: "#support" },
    ],
  },
];

const socialLinks = [
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: FaFacebookF, label: "Facebook", href: "#" },
  { Icon: FaYoutube, label: "YouTube", href: "#" },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
];

const highlights = [
  {
    title: "Wide Range",
    detail: "Furniture & Appliances",
    Icon: LuArmchair,
  },
  {
    title: "Rent or Buy",
    detail: "Flexible Options",
    Icon: FiTag,
  },
  {
    title: "Bengaluru Focus",
    detail: "Serving Bengaluru, Karnataka",
    Icon: FiMapPin,
  },
  {
    title: "Transparent Pricing",
    detail: "Clear information in INR",
    Icon: LuShieldCheck,
  },
];

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      className="relative bg-gradient-to-b from-[#15382b] via-[#0d2d21] via-60% to-[#051f15] text-white overflow-hidden"
      aria-label="Site footer"
    >
      {/* Subtle Warm Ambient Glow behind top-right ceiling lamp */}
      <div
        className="absolute -top-4 right-0 sm:right-2 w-72 h-64 rounded-full bg-[#f8e7c2]/10 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Organic Wave Transition: Right side curve rises to y=0 to fully cover up to the top of the lamp stick */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-7 sm:h-9 md:h-11 block"
          aria-hidden="true"
        >
          <path
            d="M0,0 L1440,0 L1440,0 C1340,0 1260,8 1160,24 C1000,44 860,50 700,48 C500,44 320,22 160,22 C70,22 0,38 0,38 Z"
            fill="#F8F7F2"
          />
        </svg>
      </div>

      {/* Hanging Green Pendant Ceiling Lamp: Moved little up, lamp stick covered by right curve, clears wording */}
      <div
        className="hidden lg:block absolute right-0 sm:right-1 lg:right-2 xl:right-3 -top-2 lg:-top-3 xl:-top-4 w-24 lg:w-28 xl:w-30 pointer-events-none z-10"
        aria-hidden="true"
      >
        <Image
          src="/images/footer-lamp-cutout.png"
          alt=""
          width={140}
          height={160}
          priority={false}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Right-side Ambient Lounge Scene: Shifted a little to the right side, with padding-top clearance */}
      <div
        className="hidden lg:block absolute -right-6 sm:-right-8 lg:-right-10 xl:-right-12 bottom-0 lg:bottom-[-6px] w-[460px] lg:w-[495px] xl:w-[530px] pointer-events-none z-0 pt-6"
        aria-hidden="true"
      >
        <Image
          src="/images/footer-lounge-no-lamp.png"
          alt=""
          width={720}
          height={366}
          priority={false}
          className="w-full h-auto object-contain object-right-bottom"
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-6 sm:pb-8">
        {/* Top Columns: Brand + Shop + Company + Help + Get Updates (Evenly spaced, un-congested) */}
        <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-y-7 gap-x-6 lg:gap-x-8 pb-5">
          {/* Brand Info (compact ~220px, not taking extra spacing) */}
          <div className="w-full sm:w-[220px] shrink-0">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="Rento Comforts Home">
              <Image
                src="/brand/rento-symbol-green.png"
                alt="Rento Comforts"
                width={38}
                height={38}
                className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-[22px] tracking-wider text-white leading-none">
                  RENTO
                </span>
                <span className="font-sans text-[9px] tracking-[0.28em] font-semibold text-white/90 uppercase mt-1 leading-none">
                  COMFORTS
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#cdd8d1] leading-relaxed mt-3.5 max-w-[210px]">
              Furniture and home appliances for rent or purchase, with a shopping experience designed for Bengaluru.
            </p>

            {/* Social Media Circular Pill Icons */}
            <div className="flex items-center gap-2.5 mt-4">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 flex items-center justify-center text-white/85 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column: Shop (Comfortable width, no text wrapping) */}
          <div className="shrink-0 min-w-[125px]">
            <h3 className="font-sans font-semibold text-sm sm:text-base text-white mb-3 tracking-tight">
              Shop
            </h3>
            <ul className="space-y-1.5">
              {navigationGroups[0].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-[13px] text-[#cdd8d1] hover:text-white transition-colors duration-150 whitespace-nowrap block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column: Company (Comfortable width, no text wrapping) */}
          <div className="shrink-0 min-w-[145px]">
            <h3 className="font-sans font-semibold text-sm sm:text-base text-white mb-3 tracking-tight">
              Company
            </h3>
            <ul className="space-y-1.5">
              {navigationGroups[1].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-[13px] text-[#cdd8d1] hover:text-white transition-colors duration-150 whitespace-nowrap block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Column: Help (Comfortable width, no text wrapping) */}
          <div className="shrink-0 min-w-[155px]">
            <h3 className="font-sans font-semibold text-sm sm:text-base text-white mb-3 tracking-tight">
              Help
            </h3>
            <ul className="space-y-1.5">
              {navigationGroups[2].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-[13px] text-[#cdd8d1] hover:text-white transition-colors duration-150 whitespace-nowrap block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Get Updates (Spacious, generous room for input & button) */}
          <div className="w-full sm:w-[280px] lg:w-[290px] shrink-0">
            <h3 className="font-sans font-semibold text-sm sm:text-base text-white mb-2 tracking-tight">
              Get Updates
            </h3>
            <p className="text-xs sm:text-[13px] text-[#cdd8d1] leading-relaxed mb-3">
              Subscribe to receive updates on new products, offers and more.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-white rounded-xl p-1.5 shadow-sm w-full">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent px-3 py-1.5 text-xs text-charcoal outline-none placeholder:text-charcoal/50"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-[#017F36] hover:bg-[#0b6635] text-white rounded-lg w-10 h-8 flex items-center justify-center transition-colors shrink-0"
              >
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Highlights Bar: Divider line ONLY spans the 4 pillars and cuts cleanly before the lounge scene */}
        <div className="w-full lg:w-[58%] xl:w-[60%] border-t border-white/15 pt-5 pb-5 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map(({ title, detail, Icon }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-xs text-white leading-tight">
                    {title}
                  </span>
                  <span className="font-sans text-[11px] text-[#cdd8d1] leading-tight mt-0.5">
                    {detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#a8b8ad]">
          <p>© 2026 Rento Comforts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
