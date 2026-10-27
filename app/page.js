
import { FiArrowRight } from "react-icons/fi";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoryDiscovery } from "@/components/category-discovery";
import Image from "next/image";
import { FeaturedProducts } from "@/components/featured-products";
import { WhyChooseRento } from "@/components/why-choose-rento";
import { FAQSection } from "@/components/faq-section";

const rentalSteps = [
  {
    number: "01",
    title: "Explore Products",
    description: "Browse furniture and home appliances.",
    image: "/images/renting-step-explore.png",
  },
  {
    number: "02",
    title: "Choose Your Dates",
    description: "Select your preferred rental period.",
    image: "/images/renting-step-dates.png",
  },
  {
    number: "03",
    title: "Review & Confirm",
    description: "Check availability and applicable rental terms.",
    image: "/images/renting-step-review.png",
  },
  {
    number: "04",
    title: "Delivery & Management",
    description: "Track delivery and manage your rental.",
    image: "/images/renting-step-manage.png",
  },
];

export default async function Home() {
  const isDevelopmentPreview = process.env.NODE_ENV === "development";

  const featuredRentalProducts = isDevelopmentPreview
    ? (
        await import("@/data/featured-rental-products.preview")
      ).rentalCardPreviewProducts
    : [];
  const featuredPurchaseProducts = isDevelopmentPreview
    ? (
        await import("@/data/featured-purchase-products.preview")
      ).purchaseCardPreviewProducts
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

        <FeaturedProducts
          rentalProducts={featuredRentalProducts}
          purchaseProducts={featuredPurchaseProducts}
          isDevelopmentPreview={isDevelopmentPreview}
        />

        <section className="renting-journey" aria-labelledby="renting-journey-heading">
          <div className="page-container">
            <header className="renting-journey__header">
              <div>
                <p className="eyebrow">The rental journey</p>
                <h2 id="renting-journey-heading">Renting Made Simple</h2>
              </div>
              <p className="renting-journey__summary">
                Discover how renting with Rento Comforts works.
              </p>
            </header>
            <ol className="renting-journey__steps">
              {rentalSteps.map(({ number, title, description, image }) => (
                <li className="renting-journey__step" key={number}>
                  <div className="renting-journey__step-marker">
                    <span className="renting-journey__icon" aria-hidden="true">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 62px, (max-width: 1000px) 78px, 88px"
                        className="renting-journey__icon-image"
                      />
                    </span>
                    <span className="renting-journey__number">{number}</span>
                  </div>
                  <div className="renting-journey__step-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <WhyChooseRento />
        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  );
}
