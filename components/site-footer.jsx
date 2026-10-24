import Image from "next/image";
import Link from "next/link";

const linkGroups = [
  { title: "Explore", links: [{ label: "Furniture", href: "#furniture" }, { label: "Home appliances", href: "#appliances" }] },
  { title: "Ways to shop", links: [{ label: "Rent", href: "#rentals" }, { label: "Buy", href: "#buy" }] },
];

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer__inner page-container">
      <div className="site-footer__brand">
        <Link href="#top" aria-label="Rento Comforts home"><Image src="/brand/rento-comforts.jpeg" alt="Rento Comforts company logo" width={1080} height={1080} sizes="86px" unoptimized className="site-footer__logo" /></Link>
        <p>Furniture &amp; Home Appliance Rentals and Sales</p><span>Bengaluru, Karnataka</span>
      </div>
      {linkGroups.map((group) => <nav className="site-footer__group" aria-label={group.title} key={group.title}><h2>{group.title}</h2>{group.links.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>)}
      <div className="site-footer__group site-footer__policies"><h2>Help &amp; policies</h2><p>Help and policy details will be added once approved.</p></div>
      <a className="site-footer__back" href="#top">Back to top ↑</a>
    </div>
    <div className="site-footer__base page-container"><span>Rento Comforts</span><span>Initial service region: Bengaluru</span></div>
  </footer>;
}
