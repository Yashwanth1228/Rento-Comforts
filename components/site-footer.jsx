import Image from "next/image";
import {
  FiMapPin,
  FiPackage,
  FiRepeat,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

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
            <div className="site-footer__social" aria-hidden="true">
              {[FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn].map((Icon, index) => (
                <span className="site-footer__social-icon" key={index}><Icon /></span>
              ))}
            </div>
            <span className="sr-only">Official social media account links are not configured.</span>
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

          <section className="site-footer__updates" aria-labelledby="site-footer-updates-title">
            <h2 id="site-footer-updates-title">Get Updates</h2>
            <p>Subscribe to receive updates on new products, offers and more.</p>
            <div className="site-footer__updates-form" aria-describedby="site-footer-updates-note">
              <input type="email" placeholder="Enter your email address" aria-label="Email address" disabled />
              <button type="button" aria-label="Email updates coming soon" disabled>→</button>
            </div>
            <span id="site-footer-updates-note" className="sr-only">Email sign-up is not available yet.</span>
          </section>

          <div className="site-footer__decoration" aria-hidden="true">
            <Image
              src="/images/footer-lounge-cutout.webp"
              alt=""
              fill
              sizes="(max-width: 900px) 36vw, (max-width: 1550px) 58vw, 900px"
              className="site-footer__decoration-image"
            />
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
        </div>
      </div>
    </footer>
  );
}
