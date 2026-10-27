import Image from "next/image";
import {
  FiMapPin,
  FiPackage,
  FiRepeat,
  FiArrowUpRight,
} from "react-icons/fi";

const navigationGroups = [
  {
    title: "Shop",
    links: [
      { label: "Furniture", href: "#furniture" },
      { label: "Home Appliances", href: "#appliances" },
      { label: "Rent", href: "#rentals" },
      { label: "Buy", href: "#buy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Rento Comforts", href: "#why-choose-heading" },
      { label: "How It Works", href: "#renting-journey-heading" },
    ],
    pending: "About Us",
  },
  {
    title: "Help",
    links: [{ label: "FAQs", href: "#faq-heading" }],
    pending: "Contact Support · Delivery Information",
  },
  {
    title: "Legal",
    links: [],
    pending: "Terms · Privacy · Rental · Refund policies",
  },
];

const highlights = [
  { title: "Company-Owned Inventory", detail: "Managed by Rento Comforts", Icon: FiPackage },
  { title: "Rent or Buy", detail: "Rentals and selected purchases", Icon: FiRepeat },
  { title: "Bengaluru Focus", detail: "Initial service region", Icon: FiMapPin },
  { title: "INR Pricing", detail: "Prices shown in Indian rupees", currency: true },
];

export function SiteFooter() {
  return (
    <footer id="site-footer" className="site-footer" aria-label="Site footer">
      <svg className="site-footer__wave" viewBox="0 0 1440 112" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0H1440V0c-174 6-285 34-457 51-158 16-281 20-485 3C309 40 174-12 0 38V0Z" />
      </svg>
      <div className="site-footer__content page-container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a className="site-footer__logo-tile" href="#top" aria-label="Rento Comforts home">
              <Image
                src="/brand/rento-comforts.jpeg"
                alt="Rento Comforts"
                width={1080}
                height={1080}
                sizes="104px"
                className="site-footer__logo"
              />
            </a>
            <p>Furniture and home appliances for rent or purchase, with a shopping experience designed for Bengaluru.</p>
          </div>

          <div className="site-footer__navigation">
            {navigationGroups.map(({ title, links, pending }) => (
              <nav className="site-footer__group" aria-label={`${title} footer links`} key={title}>
                <h2>{title}</h2>
                {links.map(({ label, href }) => <a href={href} key={label}>{label}</a>)}
                {pending && <p className="site-footer__pending">{pending} <span>Coming later</span></p>}
              </nav>
            ))}
          </div>

          <div className="site-footer__decoration" aria-hidden="true">
            <Image
              src="/images/footer-lounge-composition.webp"
              alt=""
              fill
              sizes="(max-width: 900px) 36vw, 34vw"
              className="site-footer__decoration-image"
            />
            <span>Illustrative interior</span>
          </div>
        </div>

        <div className="site-footer__highlights" aria-label="About Rento Comforts">
          {highlights.map(({ title, detail, Icon, currency }) => (
            <div className="site-footer__highlight" key={title}>
              <span className="site-footer__highlight-icon" aria-hidden="true">
                {currency ? <span className="site-footer__rupee">₹</span> : <Icon />}
              </span>
              <span className="site-footer__highlight-copy"><strong>{title}</strong><span>{detail}</span></span>
            </div>
          ))}
        </div>

        <div className="site-footer__base">
          <span>© {new Date().getFullYear()} Rento Comforts</span>
          <a href="#top">Back to top <FiArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
}
