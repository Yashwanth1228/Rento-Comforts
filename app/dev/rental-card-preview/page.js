import { notFound } from "next/navigation";
import { FeaturedRentalProducts } from "@/components/featured-rental-products";

export default async function RentalCardPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { rentalCardPreviewProducts } = await import(
    "@/data/featured-rental-products.preview"
  );

  return (
    <main className="min-h-screen bg-[#F8F7F2] py-8">
      <div className="page-container">
        <aside
          id="preview-notice"
          role="note"
          className="border-l-4 border-[#017F36] bg-[#E9F1E9] p-4 text-sm text-[#124734]"
        >
          <p className="font-semibold">Development preview only</p>
          <p className="mt-1">
            Product names and images are illustrative. All displayed prices,
            deposits, and rental durations are sample values, not actual
            inventory or approved business terms. Availability has not been
            checked. “View Details” links return to this notice; product detail
            pages are not implemented.
          </p>
        </aside>
      </div>

      <FeaturedRentalProducts products={rentalCardPreviewProducts} />
    </main>
  );
}