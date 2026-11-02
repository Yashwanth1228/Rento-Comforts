import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { productSlug } from "@/lib/product-slug";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} | Rento Comforts`, description: "Product information from Rento Comforts." };
}

async function getProducts() {
  if (process.env.NODE_ENV !== "development") return [];
  const [{ rentalCardPreviewProducts }, { purchaseCardPreviewProducts }] = await Promise.all([
    import("@/data/featured-rental-products.preview"),
    import("@/data/featured-purchase-products.preview"),
  ]);
  const products = new Map();
  for (const product of rentalCardPreviewProducts) {
    const slug = productSlug(product.name);
    products.set(slug, { ...product, slug, offerings: { rent: product } });
  }
  for (const product of purchaseCardPreviewProducts) {
    const slug = productSlug(product.name);
    const current = products.get(slug);
    products.set(slug, {
      ...(current || product),
      slug,
      offerings: { ...(current?.offerings || {}), buy: product },
    });
  }
  return [...products.values()];
}

async function getDevelopmentFeedback(product) {
  if (process.env.NODE_ENV !== "development" || product?.id !== "preview-sofa") return null;
  const { productFeedbackPreview } = await import("@/data/product-feedback.preview");
  return productFeedbackPreview[product.id] || null;
}

export default async function ProductDetailPage({ params, searchParams }) {
  const [{ slug }, query, products] = await Promise.all([params, searchParams, getProducts()]);
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const developmentFeedback = await getDevelopmentFeedback(product);

  return (
    <div id="top" className="site-shell">
      <SiteHeader />
      <ProductDetail product={product} products={products} initialMode={query?.mode === "buy" ? "buy" : "rent"} developmentFeedback={developmentFeedback} />
      <SiteFooter />
    </div>
  );
}
