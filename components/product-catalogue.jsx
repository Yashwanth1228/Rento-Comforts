"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiFilter, FiSearch, FiX } from "react-icons/fi";
import { ProductCard } from "@/components/rental-product-card";

const categoryFamilies = [
  { id: "all", label: "All Products" },
  { id: "furniture", label: "Furniture" },
  { id: "appliances", label: "Home Appliances" },
];

const furnitureTypes = new Set(["beds", "sofas", "wardrobes", "dining tables", "study tables"]);
const categoryDisplayNames = { sofas: "Sofas & Recliners" };

function familyFor(product) {
  return furnitureTypes.has(product.category.toLowerCase()) ? "furniture" : "appliances";
}

function slugify(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readInitialFilters(params = {}) {
  return {
    mode: params.mode === "buy" ? "buy" : "rent",
    category: categoryFamilies.some((item) => item.id === params.category) ? params.category : "all",
    subcategory: params.subcategory || "",
    query: params.q || "",
    sort: ["price-asc", "price-desc", "name-asc"].includes(params.sort) ? params.sort : "recommended",
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
  };
}

function createSearchParams(filters) {
  const params = new URLSearchParams();
  if (filters.mode !== "rent") params.set("mode", filters.mode);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  return params;
}

function FilterOptions({ products, filters, onChange, onClear, onApply }) {
  const representedCategories = [...new Map(products.map((product) => {
    const id = slugify(product.category);
    return [id, categoryDisplayNames[id] || product.category];
  })).entries()];
  const subcategories = representedCategories.filter(([, label]) => filters.category === "all" || familyFor({ category: label }) === filters.category);

  return (
    <div className="space-y-6">
      <section aria-labelledby="catalogue-category-heading">
        <h3 id="catalogue-category-heading" className="mb-3 text-sm font-semibold text-[#252925]">Category</h3>
        <div className="space-y-1">
          {categoryFamilies.map((category) => (
            <button key={category.id} type="button" aria-pressed={filters.category === category.id} onClick={() => onChange({ ...filters, category: category.id, subcategory: "" })} className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] ${filters.category === category.id ? "bg-[#E9F1E9] font-semibold text-[#124734]" : "text-[#46534a] hover:bg-[#f4f3ee]"}`}>
              {category.label}{filters.category === category.id && <span aria-hidden="true" className="text-[#017F36]">•</span>}
            </button>
          ))}
        </div>
      </section>

      {subcategories.length > 0 && (
        <section aria-labelledby="catalogue-subcategory-heading">
          <h3 id="catalogue-subcategory-heading" className="mb-3 text-sm font-semibold text-[#252925]">Product type</h3>
          <div className="space-y-2">
            {subcategories.map(([id, label]) => (
              <label key={id} className="flex min-h-8 cursor-pointer items-center gap-2.5 text-sm text-[#46534a]">
                <input type="checkbox" checked={filters.subcategory === id} onChange={() => onChange({ ...filters, subcategory: filters.subcategory === id ? "" : id })} className="size-4 accent-[#017F36]" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="catalogue-price-heading">
        <h3 id="catalogue-price-heading" className="mb-3 text-sm font-semibold text-[#252925]">Price range (₹)</h3>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-[#606860]">Minimum
            <input type="number" min="0" inputMode="numeric" value={filters.minPrice} onChange={(event) => onChange({ ...filters, minPrice: event.target.value })} placeholder="₹0" className="mt-1 min-h-10 w-full rounded-lg border border-[#d8d8d0] bg-white px-2 text-sm text-[#252925] outline-none focus:border-[#017F36] focus:ring-2 focus:ring-[#017F36]/15" />
          </label>
          <label className="text-xs text-[#606860]">Maximum
            <input type="number" min="0" inputMode="numeric" value={filters.maxPrice} onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })} placeholder="No limit" className="mt-1 min-h-10 w-full rounded-lg border border-[#d8d8d0] bg-white px-2 text-sm text-[#252925] outline-none focus:border-[#017F36] focus:ring-2 focus:ring-[#017F36]/15" />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#e4e2da] pt-4">
        <button type="button" onClick={onClear} className="min-h-10 rounded-full px-3 text-sm font-semibold text-[#124734] underline underline-offset-4 hover:text-[#017F36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">Clear filters</button>
        {onApply && <button type="button" onClick={onApply} className="min-h-10 flex-1 rounded-full bg-[#017F36] px-4 text-sm font-semibold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">Apply filters</button>}
      </div>
    </div>
  );
}

export function ProductCatalogue({ products = [], initialParams = {}, isDevelopmentPreview = false }) {
  const [filters, setFilters] = useState(() => readInitialFilters(initialParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const dialogRef = useRef(null);
  const visibleProducts = useMemo(() => {
    const modeProducts = products.filter((product) => product.mode === filters.mode);
    const matched = modeProducts.filter((product) => {
      if (filters.category !== "all" && familyFor(product) !== filters.category) return false;
      if (filters.subcategory && slugify(product.category) !== filters.subcategory) return false;
      const price = filters.mode === "buy" ? product.purchasePricePaise : product.monthlyRentalPricePaise;
      if (!Number.isSafeInteger(price)) return false;
      const priceInRupees = price / 100;
      if (filters.minPrice && priceInRupees < Number(filters.minPrice)) return false;
      if (filters.maxPrice && priceInRupees > Number(filters.maxPrice)) return false;
      const searchable = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
      return searchable.includes(filters.query.trim().toLowerCase());
    });

    if (filters.sort === "price-asc") matched.sort((a, b) => (filters.mode === "buy" ? a.purchasePricePaise - b.purchasePricePaise : a.monthlyRentalPricePaise - b.monthlyRentalPricePaise));
    if (filters.sort === "price-desc") matched.sort((a, b) => (filters.mode === "buy" ? b.purchasePricePaise - a.purchasePricePaise : b.monthlyRentalPricePaise - a.monthlyRentalPricePaise));
    if (filters.sort === "name-asc") matched.sort((a, b) => a.name.localeCompare(b.name));
    return matched;
  }, [filters, products]);

  function updateFilters(nextFilters, replace = false) {
    setFilters(nextFilters);
    const params = createSearchParams(nextFilters);
    const nextUrl = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history[replace ? "replaceState" : "pushState"]({}, "", nextUrl);
  }

  function clearFilters() {
    updateFilters({ ...filters, category: "all", subcategory: "", query: "", sort: "recommended", minPrice: "", maxPrice: "" });
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mobileFiltersOpen && !dialog.open) dialog.showModal();
    if (!mobileFiltersOpen && dialog.open) dialog.close();
  }, [mobileFiltersOpen]);

  useEffect(() => {
    function restoreFromUrl() {
      setFilters(readInitialFilters(Object.fromEntries(new URLSearchParams(window.location.search))));
    }
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  const hasActiveFilters = filters.category !== "all" || filters.subcategory || filters.query || filters.minPrice || filters.maxPrice;

  return (
    <main className="min-h-[60vh] bg-[#F8F7F2] pb-16">
      <div className="mx-auto w-[min(100%-32px,1380px)] pt-7 sm:w-[min(100%-48px,1380px)] sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-[#606860]">
          <ol className="flex items-center gap-2"><li><Link href="/" className="hover:text-[#017F36]">Home</Link></li><li aria-hidden="true">/</li><li className="font-medium text-[#124734]" aria-current="page">Products</li></ol>
        </nav>

        <header className="mb-7 flex flex-col justify-between gap-5 border-b border-[#e4e2da] pb-7 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#017F36]">Furniture &amp; home appliances</p>
            <h1 className="font-editorial text-4xl font-medium leading-tight text-[#124734] sm:text-5xl">Explore Our Collection</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#606860] sm:text-base">Browse furniture and home appliance listings for rental or purchase.</p>
          </div>
          <div className="inline-flex w-fit rounded-full border border-[#cfd8ce] bg-white p-1" role="tablist" aria-label="Choose rental or purchase listings">
            {[{ id: "rent", label: "Rent" }, { id: "buy", label: "Buy" }].map((mode) => (
              <button key={mode.id} type="button" role="tab" aria-selected={filters.mode === mode.id} onClick={() => updateFilters({ ...filters, mode: mode.id, minPrice: "", maxPrice: "" })} className={`min-h-10 min-w-24 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] ${filters.mode === mode.id ? "bg-[#124734] text-white" : "text-[#46534a] hover:bg-[#E9F1E9]"}`}>{mode.label}</button>
            ))}
          </div>
        </header>

        {isDevelopmentPreview && products.some((product) => product.previewOnly) && (
          <aside role="note" className="mb-6 rounded-xl border border-[#cbd9cc] bg-[#E9F1E9] p-4 text-sm leading-6 text-[#124734]">
            <strong className="block">Development preview only</strong>
            <span>Illustrative product names, images and sample prices are for local interface review. They are not verified inventory, approved commercial prices, or availability information.</span>
          </aside>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <aside className="hidden w-[245px] shrink-0 rounded-2xl border border-[#e3e1d9] bg-white p-5 lg:block" aria-label="Product filters">
            <div className="mb-5 flex items-center gap-2 text-[#124734]"><FiFilter aria-hidden="true" /><h2 className="text-base font-semibold">Filters</h2></div>
            <FilterOptions products={products} filters={filters} onChange={(next) => updateFilters(next, true)} onClear={clearFilters} />
          </aside>

          <section className="min-w-0 flex-1" aria-label={`${filters.mode === "rent" ? "Rental" : "Purchase"} products`}>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#e3e1d9] bg-white p-3 sm:flex-row sm:items-center sm:p-4">
              <form className="flex min-h-11 flex-1 items-center gap-2 rounded-full border border-[#deddd5] bg-[#F8F7F2] px-4" role="search" onSubmit={(event) => { event.preventDefault(); updateFilters(filters, true); }}>
                <FiSearch aria-hidden="true" className="shrink-0 text-[#124734]" />
                <label className="sr-only" htmlFor="catalogue-search">Search products</label>
                <input id="catalogue-search" type="search" value={filters.query} onChange={(event) => updateFilters({ ...filters, query: event.target.value }, true)} placeholder="Search furniture and appliances" className="min-w-0 flex-1 bg-transparent text-sm text-[#252925] outline-none placeholder:text-[#858a84]" />
                {filters.query && <button type="button" aria-label="Clear search" onClick={() => updateFilters({ ...filters, query: "" }, true)} className="rounded-full p-1 text-[#606860] hover:bg-[#e9e8e0]"><FiX aria-hidden="true" /></button>}
              </form>
              <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#cfd8ce] px-4 text-sm font-semibold text-[#124734] lg:hidden"><FiFilter aria-hidden="true" />Filters{hasActiveFilters && <span className="grid size-5 place-items-center rounded-full bg-[#017F36] text-xs text-white">•</span>}</button>
              <label className="flex min-h-11 items-center gap-2 rounded-full border border-[#deddd5] bg-white px-4 text-sm text-[#46534a]">
                <span className="whitespace-nowrap">Sort by</span><span className="sr-only">Sort products</span>
                <select aria-label="Sort products" value={filters.sort} onChange={(event) => updateFilters({ ...filters, sort: event.target.value })} className="min-w-0 flex-1 bg-transparent font-semibold text-[#124734] outline-none">
                  <option value="recommended">Recommended</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name-asc">Name: A to Z</option>
                </select><FiChevronDown aria-hidden="true" className="pointer-events-none -ml-6" />
              </label>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[#606860]" aria-live="polite"><strong className="font-semibold text-[#252925]">{visibleProducts.length}</strong> {visibleProducts.length === 1 ? "product" : "products"} {filters.mode === "rent" ? "to rent" : "to buy"}</p>
              {hasActiveFilters && <button type="button" onClick={clearFilters} className="text-sm font-semibold text-[#124734] underline underline-offset-4 hover:text-[#017F36]">Clear filters</button>}
            </div>

            {visibleProducts.length ? (
              <div className="grid grid-cols-2 items-start gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7 xl:grid-cols-4" aria-live="polite">
                {visibleProducts.map((product) => <ProductCard key={`${filters.mode}:${product.id}`} product={product} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#cbd2c9] bg-white px-6 py-14 text-center">
                <div className="relative mx-auto mb-4 size-16 overflow-hidden rounded-full bg-[#E9F1E9]">
                  <Image src="/images/category-sofas-cutout.webp" alt="" aria-hidden="true" fill sizes="64px" className="object-contain p-2" />
                </div>
                <h2 className="font-editorial text-2xl font-medium text-[#124734]">No products found</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#606860]">{products.length ? "Try adjusting your search or filters to see more results." : "Verified catalogue listings will appear here when product data is connected."}</p>
                {hasActiveFilters && <button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-full bg-[#124734] px-5 text-sm font-semibold text-white hover:bg-[#017F36]">Clear filters</button>}
              </div>
            )}
          </section>
        </div>
      </div>

      <dialog ref={dialogRef} onClose={() => setMobileFiltersOpen(false)} onClick={(event) => { if (event.target === dialogRef.current) setMobileFiltersOpen(false); }} aria-labelledby="mobile-filter-title" className="m-0 ml-auto h-dvh max-h-dvh w-[min(90vw,390px)] max-w-none overflow-y-auto border-0 bg-[#F8F7F2] p-0 text-[#252925] shadow-2xl backdrop:bg-[#252925]/45">
        <div className="flex min-h-full flex-col p-5">
          <header className="mb-6 flex items-center justify-between border-b border-[#deddd5] pb-4"><div><p className="eyebrow">Refine your search</p><h2 id="mobile-filter-title" className="mt-1 font-editorial text-2xl font-medium text-[#124734]">Filters</h2></div><button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="grid size-11 place-items-center rounded-full border border-[#d9d8cf] bg-white text-[#124734]"><FiX aria-hidden="true" /></button></header>
          <div className="flex-1"><FilterOptions products={products} filters={filters} onChange={(next) => updateFilters(next, true)} onClear={clearFilters} onApply={() => setMobileFiltersOpen(false)} /></div>
        </div>
      </dialog>
    </main>
  );
}
