import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ProductNotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="grid min-h-[48vh] place-items-center bg-[#F8F7F2] px-5 py-16 text-center">
        <div className="max-w-lg">
          <p className="eyebrow">Product details</p>
          <h1 className="mt-2 font-editorial text-4xl font-semibold text-[#124734]">This product isn’t available here</h1>
          <p className="mt-3 text-sm leading-6 text-[#626b63]">The product may have been removed, or this catalogue entry is not available in this environment.</p>
          <Link href="/products" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#124734] px-5 text-sm font-semibold text-white hover:bg-[#017F36]">Back to products</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
