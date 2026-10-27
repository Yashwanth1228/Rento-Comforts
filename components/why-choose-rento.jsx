import Image from "next/image";
import {
  FiFileText,
  FiMapPin,
  FiPackage,
  FiRepeat,
} from "react-icons/fi";

const reasons = [
  {
    title: "Company-Owned Inventory",
    description:
      "Rento Comforts manages its own product inventory rather than operating as a third-party marketplace.",
    Icon: FiPackage,
  },
  {
    title: "Rent or Buy",
    description:
      "Explore rental products and selected items available for direct purchase.",
    Icon: FiRepeat,
  },
  {
    title: "Bengaluru Focus",
    description:
      "Our initial service region is Bengaluru, Karnataka. Individual delivery locations remain subject to serviceability checks.",
    Icon: FiMapPin,
  },
  {
    title: "Clear Pricing Information",
    description:
      "The platform is being designed to display rental prices, refundable deposits and applicable charges in Indian rupees before checkout.",
    Icon: FiFileText,
  },
];

export function WhyChooseRento() {
  return (
    <section className="why-choose" aria-labelledby="why-choose-heading">
      <div className="page-container">
        <div className="why-choose__panel">
          <div className="why-choose__content">
            <header className="why-choose__heading">
              <p className="eyebrow">Why Rento Comforts</p>
              <h2 id="why-choose-heading">Why Choose Rento Comforts</h2>
              <p className="why-choose__intro">
                Explore furniture and home appliances for rent or purchase, with
                a shopping experience designed for Bengaluru.
              </p>
            </header>

            <ul className="why-choose__benefits">
              {reasons.map(({ title, description, Icon }) => (
                <li className="why-choose__benefit" key={title}>
                  <span className="why-choose__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <figure className="why-choose__visual">
            <div className="why-choose__image-frame">
              <Image
                src="/images/rento-living-room.webp"
                alt="Illustrative living room with a sofa, coffee table and warm natural light"
                fill
                sizes="(max-width: 640px) calc(100vw - 70px), (max-width: 1000px) 40vw, 45vw"
                className="why-choose__image"
              />
            </div>
            <figcaption>
              Illustrative interior; not a specific catalogue listing.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
