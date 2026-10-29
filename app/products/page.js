import { ProductCatalogue } from "@/components/product-catalogue";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Explore Our Collection | Rento Comforts",
  description: "Browse furniture and home appliance listings for rental or purchase.",
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const initialParams = Object.fromEntries(
    Object.entries(params || {}).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]),
  );
  const isDevelopmentPreview = process.env.NODE_ENV === "development";
  let products = [];

  if (isDevelopmentPreview) {
    const [{ rentalCardPreviewProducts }, { purchaseCardPreviewProducts }] = await Promise.all([
      import("@/data/featured-rental-products.preview"),
      import("@/data/featured-purchase-products.preview"),
    ]);

    products = [
      ...rentalCardPreviewProducts.map((product) => ({
        ...product,
        mode: "rent",
        subcategoryId: product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      })),
      ...purchaseCardPreviewProducts.map((product) => ({
        ...product,
        mode: "buy",
        subcategoryId: product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      })),
    ];
  }

  return (
    <div id="top" className="site-shell">
      <SiteHeader />
      <ProductCatalogue key={JSON.stringify(initialParams)} products={products} initialParams={initialParams} isDevelopmentPreview={isDevelopmentPreview} />
      <SiteFooter />
    </div>
  );
}
