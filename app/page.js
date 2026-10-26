
import { FiArrowRight, FiCheck, FiChevronRight } from "react-icons/fi";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoryDiscovery } from "@/components/category-discovery";
import Image from "next/image";
import { FeaturedRentalProducts } from "@/components/featured-rental-products";

const steps = [
  { number: "01", title: "Explore", text: "Browse furniture and appliances by category." },
  { number: "02", title: "Choose your way", text: "Select Rent or Buy where that option is available." },
  { number: "03", title: "Continue with confidence", text: "Review the applicable details before placing an order or rental request." },
];

export default async function Home() {
  const isDevelopmentPreview = process.env.NODE_ENV === "development";

  const featuredRentalProducts = isDevelopmentPreview
    ? (
        await import("@/data/featured-rental-products.preview")
      ).rentalCardPreviewProducts
    : [];

  return (
    <div id="top" className="site-shell">
      <SiteHeader />
      <main>
        <HeroCarousel />

        <CategoryDiscovery />

                <section
          className="discovery-section"
          aria-labelledby="discovery-heading"
        >
          <div className="page-container">
            <header className="discovery-heading">
              <p className="eyebrow">Rent or buy</p>
              <h2 id="discovery-heading">Choose How You Shop</h2>
            </header>

            <div className="discovery-options">
              <article
                className="discovery-option discovery-option--rent"
                id="rentals"
              >
                <div className="discovery-option__content">
                  <p className="eyebrow">Furniture &amp; appliances</p>
                  <h3>Rent for Your Home</h3>
                  <p>
                    Browse furniture and home appliances available for rental.
                  </p>
                  <a
                    href="#categories"
                    className="button button--primary discovery-option__button"
                  >
                    Explore Rentals <FiArrowRight aria-hidden="true" />
                  </a>
                </div>

                <div className="discovery-option__visual">
                  <Image
                    src="/images/rent-banner-sofa.png"
                    alt="Illustrative cutout of a contemporary sofa and side table"
                    width={1774}
                    height={887}
                    sizes="(max-width: 800px) 65vw, (max-width: 1200px) 35vw, 30vw"
                    className="discovery-option__image"
                  />
                </div>
              </article>

              <article
                className="discovery-option discovery-option--buy"
                id="buy"
              >
                <div className="discovery-option__content">
                  <p className="eyebrow">Furniture &amp; appliances</p>
                  <h3>Make It Yours</h3>
                  <p>
                    Explore furniture and home appliances available for purchase.
                  </p>
                  <a
                    href="#categories"
                    className="button button--secondary discovery-option__button"
                  >
                    Shop to Buy <FiArrowRight aria-hidden="true" />
                  </a>
                </div>

                <div className="discovery-option__visual">
                  <Image
                    src="/images/buy-banner-appliances.png"
                    alt="Illustrative cutout grouping of a refrigerator, washing machine, and television"
                    width={1774}
                    height={887}
                    sizes="(max-width: 800px) 65vw, (max-width: 1200px) 35vw, 30vw"
                    className="discovery-option__image"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <FeaturedRentalProducts
  products={featuredRentalProducts}
  isDevelopmentPreview={isDevelopmentPreview}
/>

        <section className="how-section page-container" aria-labelledby="how-heading">
          <div className="how-section__intro"><p className="eyebrow">A straightforward journey</p><h2 id="how-heading">A better fit for your home starts here.</h2><p>Clear choices at every step, whether you are renting or buying.</p></div>
          <ol className="steps-list">
            {steps.map((step) => <li key={step.number}><span className="steps-list__number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
