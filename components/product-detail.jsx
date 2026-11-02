"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/rental-product-card";
import { ProductDetailFaq, ProductDetailReviews } from "@/components/product-detail-feedback";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiHeart, FiHome, FiInfo, FiMaximize2, FiShare2, FiShoppingCart, FiX } from "react-icons/fi";

const money = (paise) => Number.isSafeInteger(paise) && paise > 0
  ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: paise % 100 ? 2 : 0 }).format(paise / 100)
  : null;

function localDateString(date = new Date()) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function displayProductName(name = "") {
  return name.replace(/\s+\S+\s+Preview$/i, "");
}

function InfoRow({ label, children }) {
  return <div className="flex min-w-0 justify-between gap-4 border-b border-[#e9e7e1] py-2.5 text-sm"><dt className="text-[#69736b]">{label}</dt><dd className="text-right font-medium text-[#252925]">{children}</dd></div>;
}

export function ProductDetail({ product, products = [], initialMode = "rent", developmentFeedback = null }) {
  const modes = ["rent", "buy"].filter((mode) => Boolean(product.offerings[mode]));
  const [mode, setMode] = useState(modes.includes(initialMode) ? initialMode : modes[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem, items } = useCart();
  const current = product.offerings[mode];
  const images = useMemo(() => {
    if (current?.gallery?.length) return current.gallery;
    if (product?.gallery?.length) return product.gallery;
    return current?.imageUrl ? [{ src: current.imageUrl, alt: current.imageAlt || current.name }] : [];
  }, [current, product]);
  const selectedImage = images[imageIndex] || images[0];
  const durationOptions = Array.isArray(current?.rentalDurationOptionsMonths)
    ? current.rentalDurationOptionsMonths.filter((value) => Number.isInteger(value) && value > 0)
    : [];
  const price = mode === "rent" ? money(current?.monthlyRentalPricePaise) : money(current?.purchasePricePaise);
  const cartKey = `${mode}:${current?.id}`;
  const alreadyInCart = items.some((item) => item.cartKey === cartKey);
  const canAddRental = mode !== "rent" || (durationOptions.length > 0 && duration && startDate >= localDateString());
  const specs = current?.specifications && typeof current.specifications === "object"
    ? Object.entries(current.specifications).filter(([, value]) => value !== null && value !== undefined && String(value).trim())
    : [];
  const related = products
    .filter((candidate) => candidate.slug !== product.slug && candidate.offerings[mode] && familyForDetail(candidate.category) === familyForDetail(product.category))
    .sort((first, second) => Number(second.category === product.category) - Number(first.category === product.category))
    .slice(0, 4);

  function chooseMode(nextMode) {
    setMode(nextMode);
    setImageIndex(0);
    setMessage("");
  }

  function addToCart() {
    if (mode === "rent" && !durationOptions.length) {
      setMessage("Rental duration options have not been configured for this preview item.");
      return;
    }
    if (mode === "rent" && (!startDate || startDate < localDateString() || !duration)) {
      setMessage("Choose a valid start date and configured rental duration.");
      return;
    }
    const cartProduct = {
      ...current,
      mode,
      rentalPlan: mode === "rent" ? { durationMonths: Number(duration) } : undefined,
      rentalDates: mode === "rent" ? { startDate } : undefined,
    };
    setMessage(addItem(cartProduct) ? `${current.name} added to cart.` : "This item could not be added to the cart.");
  }

  async function shareProduct() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: current.name, url });
      else { await navigator.clipboard.writeText(url); setMessage("Product link copied."); }
    } catch { setMessage("Sharing was cancelled or unavailable."); }
  }

  const setGalleryIndex = (next) => setImageIndex((next + images.length) % images.length);

  return (
    <main className="product-detail-page bg-[#F8F7F2] px-4 pb-14 pt-3 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1464px]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <nav aria-label="Breadcrumb" className="text-xs text-[#69736b] sm:text-sm">
          <ol className="flex flex-wrap items-center gap-2"><li><Link href="/" className="hover:text-[#017F36]">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/products" className="hover:text-[#017F36]">Products</Link></li><li aria-hidden="true">/</li><li>{product.category}</li><li aria-hidden="true">/</li><li className="font-semibold text-[#252925]" aria-current="page">{displayProductName(current.name)}</li></ol>
        </nav>
        {product.previewOnly && <p role="note" className="text-[10px] leading-4 text-[#66756b] sm:text-[11px]">Development preview only. Product details, images and prices are illustrative.</p>}
        </div>

        <section className="grid min-w-0 items-stretch gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,.92fr)] lg:gap-8" aria-label="Product details">
          <div className="grid min-w-0 items-stretch gap-3 sm:grid-cols-[102px_minmax(0,1fr)] sm:gap-3 lg:h-full">
            {images.length > 0 && <div role="group" aria-label="Product image gallery" className="order-2 flex gap-2.5 overflow-x-auto sm:order-1 sm:h-full sm:flex-col sm:justify-between sm:overflow-visible">{images.map((image, index) => <button key={`${image.src}-${index}`} type="button" onClick={() => setImageIndex(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={index === imageIndex} className={`relative h-[68px] w-[90px] shrink-0 overflow-hidden rounded-xl border-2 bg-white sm:h-[76px] sm:w-[102px] ${index === imageIndex ? "border-[#017F36]" : "border-[#e4e1d9]"}`}><Image src={image.src} alt={image.alt || ""} fill sizes="102px" className="object-cover" /></button>)}</div>}
            <div className="relative order-1 min-h-[260px] overflow-hidden rounded-2xl border border-[#e8e2d7] bg-[#eee9df] sm:order-2 sm:aspect-[1.45] sm:min-h-0 lg:h-full lg:aspect-auto">
              {selectedImage ? <Image src={selectedImage.src} alt={selectedImage.alt || current.imageAlt || current.name} fill priority sizes="(max-width: 768px) 100vw, 54vw" className="object-cover" /> : <div className="grid h-full min-h-[260px] place-items-center text-sm text-[#69736b]">No product image configured</div>}
              {images.length > 1 && <><button type="button" aria-label="Previous product image" onClick={() => setGalleryIndex(imageIndex - 1)} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-xl shadow"><FiChevronLeft aria-hidden="true" /></button><button type="button" aria-label="Next product image" onClick={() => setGalleryIndex(imageIndex + 1)} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-xl shadow"><FiChevronRight aria-hidden="true" /></button></>}
              {selectedImage && <button type="button" onClick={() => setZoomOpen(true)} aria-label="View larger product image" className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/95 text-[#252925] shadow"><FiMaximize2 aria-hidden="true" /></button>}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[11px] font-semibold uppercase tracking-[.11em] text-[#017F36]">{familyForDetail(product.category)} / {product.category}</p><h1 className="mt-0.5 font-editorial text-[30px] font-semibold leading-[1.08] text-[#102f28] sm:text-[34px]">{displayProductName(current.name)}</h1></div>
              <div className="flex shrink-0 gap-2"><button type="button" onClick={() => { setIsFavorite((value) => !value); setMessage(isFavorite ? "Removed from this page's wishlist preview." : "Saved to this page's wishlist preview."); }} aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isFavorite} title="Wishlist preview only; not saved to an account" className="grid size-10 place-items-center rounded-full border border-[#e5e2db] bg-white text-[#124734] shadow-sm"><FiHeart className={isFavorite ? "fill-[#124734]" : ""} /></button><button type="button" onClick={shareProduct} aria-label="Share product" className="grid size-10 place-items-center rounded-full border border-[#e5e2db] bg-white text-[#124734] shadow-sm"><FiShare2 /></button></div>
            </div>
            {current.description && <p className="mt-1.5 text-[13px] leading-5 text-[#616a63]">{current.description}</p>}

            {modes.length > 1 && <div role="tablist" aria-label="Select rent or buy" className="mt-4 inline-flex h-12 w-[292px] max-w-full rounded-full border border-[#e3e1da] bg-white p-0.5 shadow-sm">{modes.map((availableMode) => <button key={availableMode} type="button" role="tab" aria-selected={mode === availableMode} onClick={() => chooseMode(availableMode)} className={`min-h-0 min-w-0 flex-1 rounded-full px-5 text-sm font-semibold capitalize ${mode === availableMode ? "bg-[#004c3a] text-white" : "text-[#252925] hover:bg-[#edf3ec]"}`}>{availableMode === "rent" ? "Rent" : "Buy"}</button>)}</div>}
            {modes.length === 1 && <p className="mt-3 inline-flex rounded-full bg-[#e9f1e9] px-4 py-1.5 text-sm font-semibold capitalize text-[#124734]">{mode === "rent" ? "Rental preview" : "Purchase preview"}</p>}

            <section className="mt-4 rounded-2xl border border-[#e2e8dc] bg-[#f0f4ec] p-4 sm:p-5" aria-label="Price and options">
              <div className={mode === "rent" ? "grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(180px,.85fr)]" : ""}>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2"><strong className="text-[30px] font-bold leading-9 tracking-tight text-[#124734]">{price || "Price not configured"}</strong>{mode === "rent" && price && <span className="text-[13px] text-[#252925]">/month</span>}</div>
                  {mode === "rent" && <p className="mt-0.5 text-[12px] text-[#425248]">Security deposit: {money(current.refundableDepositPaise) || <span className="font-medium text-[#124734]">To be confirmed</span>}</p>}
                  {mode === "rent" && <div className="mt-2.5 border-t border-[#dce5d9] pt-2.5"><h2 className="text-[13px] font-bold text-[#252925]">Rental Options</h2><div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    <label className="grid min-w-0 gap-1 text-[11px] font-medium text-[#48534b]">Start Date<span className="relative"><FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#124734]" /><input type="date" min={localDateString()} value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-10 w-full rounded-lg border border-[#d9ded5] bg-white pl-9 pr-2 text-[13px] text-[#252925] focus-visible:outline-2 focus-visible:outline-[#017F36]" /></span></label>
                    <label className="grid min-w-0 gap-1 text-[11px] font-medium text-[#48534b]">Duration{durationOptions.length ? <select value={duration} onChange={(event) => setDuration(event.target.value)} className="h-10 w-full rounded-lg border border-[#d9ded5] bg-white px-2 text-[13px] text-[#252925] focus-visible:outline-2 focus-visible:outline-[#017F36]"><option value="">Select duration</option>{durationOptions.map((months) => <option key={months} value={months}>{months} {months === 1 ? "month" : "months"}</option>)}</select> : <span className="flex min-h-10 items-center rounded-lg border border-[#d9ded5] bg-white px-2 text-[12px] text-[#69736b]">Duration options not configured</span>}</label>
                  </div></div>}
                  {mode === "buy" && <p className="mt-2 text-sm text-[#526056]">One-time purchase price. Delivery and installation charges are not configured.</p>}
                </div>
                {mode === "rent" && <aside className="grid content-center gap-2 rounded-xl border border-white/80 bg-white/75 p-2.5 text-[11px] text-[#252925]" aria-label="Rental information"><div className="flex min-h-8 items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f7eb] text-[#124734]"><FiClock /></span><span>{Number.isInteger(current.minimumRentalMonths) ? `Minimum rental ${current.minimumRentalMonths} ${current.minimumRentalMonths === 1 ? "month" : "months"}.` : "Minimum duration not configured."}</span></div><div className="flex min-h-8 items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f7eb] text-[#124734]"><FiCalendar /></span><span>Start date is a preference, not a booking.</span></div><div className="flex min-h-8 items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f7eb] text-[#124734]"><FiInfo /></span><span>Availability is unverified; cart does not reserve stock.</span></div></aside>}
              </div>
            </section>

            <div className="mt-3">
              <button type="button" onClick={addToCart} disabled={alreadyInCart || (mode === "rent" && !canAddRental)} className="inline-flex min-h-[52px] w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-[#004c3a] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#124734] disabled:cursor-not-allowed disabled:bg-[#81948b] sm:text-base"><FiShoppingCart className="size-5 shrink-0" />{alreadyInCart ? "In Cart" : "Add to Cart"}</button>
            </div>
            <p role="status" aria-live="polite" className="mt-1 text-xs text-[#124734]">{message}</p>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#e7e4dc] bg-white" aria-label="Product information">
          <div role="tablist" aria-label="Product information sections" className="flex flex-wrap gap-1 border-b border-[#eceae4] bg-[#fbfaf7] p-2">
            {[ ["overview", "Product Overview", <FiHome key="icon" />], ["specifications", "Specifications", <FiInfo key="icon" />], ["rental", "Rental & Delivery Information", <FiClock key="icon" />] ].map(([id, label, icon]) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold ${activeTab === id ? "bg-[#004c3a] text-white" : "text-[#38463c] hover:bg-[#edf3ec]"}`}>{icon}{label}</button>)}
          </div>
          <div className="p-5 sm:p-7" role="tabpanel">
            {activeTab === "overview" && <div className="grid gap-5 lg:grid-cols-[1.1fr_1.25fr] lg:items-center"><div><p className="text-sm leading-6 text-[#39433c]">{current.description || "No product overview has been configured."}</p></div><div className="grid gap-3 border-t border-[#e7e9e2] pt-4 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">{[[<FiHome key="i" />, "Category", product.category], [<FiInfo key="i" />, mode === "rent" ? "Monthly rent" : "Purchase price", price || "Not configured"], [<FiClock key="i" />, mode === "rent" ? "Security deposit" : "Delivery details", mode === "rent" ? (money(current.refundableDepositPaise) || "To be confirmed") : "Not configured"]].map(([icon, label, value]) => <div key={label} className="flex items-center gap-2.5"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-lg text-[#124734]">{icon}</span><div className="min-w-0"><p className="text-[10px] text-[#69736b]">{label}</p><p className="break-words text-xs font-semibold text-[#252925]">{value}</p></div></div>)}</div></div>}
            {activeTab === "specifications" && <div><h2 className="font-editorial text-2xl font-semibold text-[#124734]">Specifications</h2>{specs.length ? <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">{specs.map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-[#eeece7] py-3 text-sm"><dt className="text-[#69736b]">{label}</dt><dd className="text-right font-medium text-[#252925]">{String(value)}</dd></div>)}</dl> : <p className="mt-2 text-sm text-[#69736b]">Specifications have not been configured for this preview item.</p>}</div>}
            {activeTab === "rental" && <div><h2 className="font-editorial text-2xl font-semibold text-[#124734]">Rental & Delivery Information</h2><dl className="mt-3 grid gap-x-8 sm:grid-cols-2">{mode === "rent" && Number.isInteger(current.minimumRentalMonths) && <InfoRow label="Minimum rental duration">{current.minimumRentalMonths} {current.minimumRentalMonths === 1 ? "month" : "months"}</InfoRow>}{mode === "rent" && <InfoRow label="Security deposit">{money(current.refundableDepositPaise) || "To be confirmed"}</InfoRow>}{mode === "buy" && <InfoRow label="Purchase price">{price || "Not configured"}</InfoRow>}{typeof current.deliveryTerms === "string" && current.deliveryTerms.trim() && <InfoRow label="Delivery">{current.deliveryTerms}</InfoRow>}{typeof current.installationTerms === "string" && current.installationTerms.trim() && <InfoRow label="Installation">{current.installationTerms}</InfoRow>}{typeof current.maintenanceTerms === "string" && current.maintenanceTerms.trim() && <InfoRow label="Maintenance">{current.maintenanceTerms}</InfoRow>}</dl><p className="mt-3 rounded-xl bg-[#f8f7f2] px-4 py-3 text-sm leading-5 text-[#59635c]">{mode === "rent" ? "Delivery, installation, maintenance, extension, return and pickup terms have not been configured for this preview item. A selected start date is a preference only." : "Delivery and installation terms have not been configured for this preview item."}</p></div>}
          </div>
        </section>

        <ProductDetailReviews reviews={current?.reviews} developmentFeedback={developmentFeedback} />

        {related.length > 0 && <section className="mt-5" aria-labelledby="related-products-title"><div className="mb-3 flex items-center justify-between"><h2 id="related-products-title" className="font-editorial text-2xl font-semibold text-[#103d2d]">You May Also Like</h2><Link href={`/products?mode=${mode}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#124734] hover:text-[#017F36]">View All <FiChevronRight /></Link></div><div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{related.map((candidate) => <ProductCard key={candidate.slug} product={{ ...candidate.offerings[mode], mode }} variant="catalogue" requireRentalSelection showPreviewBadge={false} showRating={!candidate.offerings[mode].previewOnly} />)}</div></section>}

        <ProductDetailFaq faqs={current?.approvedFaqs} developmentFeedback={developmentFeedback} />
      </div>

      {zoomOpen && selectedImage && <div role="dialog" aria-modal="true" aria-label="Product image" className="fixed inset-0 z-[200] grid place-items-center bg-black/80 p-4" onClick={() => setZoomOpen(false)}><button type="button" onClick={() => setZoomOpen(false)} className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white text-[#252925]" aria-label="Close image viewer"><FiX aria-hidden="true" /></button><div className="relative h-[82vh] w-[min(92vw,1100px)]" onClick={(event) => event.stopPropagation()}><Image src={selectedImage.src} alt={selectedImage.alt || current.name} fill sizes="90vw" className="object-contain" /></div></div>}
    </main>
  );
}

function familyForDetail(category = "") {
  const furniture = new Set(["beds", "sofas", "wardrobes", "dining tables", "study tables"]);
  return furniture.has(category.toLowerCase()) ? "Furniture" : "Home Appliances";
}
