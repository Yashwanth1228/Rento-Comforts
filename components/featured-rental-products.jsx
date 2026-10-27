import { RentalProductCard } from "./rental-product-card";

export function FeaturedRentalProducts({
  products = [],
  isDevelopmentPreview = false,
}) {
  const showPreviewNotice =
    process.env.NODE_ENV === "development" &&
    isDevelopmentPreview &&
    products.length > 0;

  return (
    <section
      id="featured-rental-products"
      className="page-container py-12 sm:py-16"
      aria-labelledby="featured-rentals-heading"
    >
      <div className="mb-6">
        <p className="eyebrow">Rental discovery</p>
        <h2
          id="featured-rentals-heading"
          className="mt-2 font-editorial text-3xl font-medium text-[#124734] sm:text-4xl"
        >
          Featured Rental Products
        </h2>
      </div>

            {showPreviewNotice && (
        <aside
          role="note"
          className="mb-5 border-l-4 border-[#017F36] bg-[#E9F1E9] p-4 text-sm text-[#124734]"
        >
          <p className="font-semibold">Development preview only</p>
          <p className="mt-1">
            These illustrative products and all prices, deposits, rental
            durations, and availability messages are sample data, not actual
            inventory or approved business terms.
          </p>
        </aside>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <RentalProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-[#e2e2dc] bg-white px-5 py-6 text-sm text-[#606860]">
          Rental listings will appear here when verified catalogue data is available.
        </p>
      )}
    </section>
  );
}
