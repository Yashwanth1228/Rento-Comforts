"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiFilter, FiX } from "react-icons/fi";
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

function FilterOptions({ products, filters, onChange, onClear, onApply, idPrefix }) {
  const representedCategories = [...new Map(products.map((product) => {
    const id = slugify(product.category);
    return [id, { label: categoryDisplayNames[id] || product.category, family: familyFor(product) }];
  })).entries()];
  const subcategories = representedCategories.filter(([, value]) => filters.category === "all" || value.family === filters.category);
  const prices = products.filter((product) => product.mode === filters.mode).map((product) => filters.mode === "buy" ? product.purchasePricePaise : product.monthlyRentalPricePaise).filter((value) => Number.isSafeInteger(value) && value > 0).map((value) => value / 100);
  const priceFloor = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const priceCeiling = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  const selectedMinimum = filters.minPrice ? Number(filters.minPrice) : priceFloor;
  const selectedMaximum = filters.maxPrice ? Number(filters.maxPrice) : priceCeiling;
  const clampPrice = (value) => Math.min(priceCeiling, Math.max(priceFloor, value));
  const setMinimum = (value) => {
    const minimum = clampPrice(value);
    onChange({ ...filters, minPrice: String(minimum), maxPrice: selectedMaximum < minimum ? String(minimum) : filters.maxPrice });
  };
  const setMaximum = (value) => {
    const maximum = clampPrice(value);
    onChange({ ...filters, maxPrice: String(maximum), minPrice: selectedMinimum > maximum ? String(maximum) : filters.minPrice });
  };
  const normalizePriceInput = (bound) => {
    const raw = bound === "minimum" ? filters.minPrice : filters.maxPrice;
    if (!raw) return;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      onChange({ ...filters, [bound === "minimum" ? "minPrice" : "maxPrice"]: "" });
      return;
    }
    if (bound === "minimum") setMinimum(parsed);
    else setMaximum(parsed);
  };

  return (
    <div className="catalogue-filter-options">
      <section className="catalogue-filter-section" aria-labelledby={`${idPrefix}-category-heading`}>
        <h3 id={`${idPrefix}-category-heading`} className="catalogue-filter-section__title">Category</h3>
        <div className="catalogue-filter-categories grid gap-1.5">
          {categoryFamilies.map((category) => (
            <button key={category.id} type="button" aria-pressed={filters.category === category.id} onClick={() => onChange({ ...filters, category: category.id, subcategory: "" })} className={`catalogue-filter-category flex w-full${filters.category === category.id ? " is-active" : ""}`}>
              <span className={`catalogue-filter-category__check${filters.category === category.id ? " is-active" : ""}`} aria-hidden="true">{filters.category === category.id ? "✓" : ""}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </section>

      {subcategories.length > 0 && (
        <details className="catalogue-filter-section catalogue-filter-details" open>
          <summary id={`${idPrefix}-subcategory-heading`} className="catalogue-filter-section__title">Product Type<FiChevronDown aria-hidden="true" /></summary>
          <div className="mt-3 grid gap-y-1.5" aria-labelledby={`${idPrefix}-subcategory-heading`}>
            {subcategories.map(([id, value]) => (
              <label key={id} className="catalogue-filter-type flex">
                <input type="checkbox" checked={filters.subcategory === id} onChange={() => onChange({ ...filters, subcategory: filters.subcategory === id ? "" : id })} />
                <span>{value.label}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      <details className="catalogue-filter-section catalogue-filter-details" open>
        <summary id={`${idPrefix}-price-heading`} className="catalogue-filter-section__title">Price Range (₹{filters.mode === "rent" ? " / month" : " / one-time"})<FiChevronDown aria-hidden="true" /></summary>
        {prices.length ? <div className="mt-4">
          <div className="catalogue-range-sliders" aria-label="Adjust price range">
            <label className="sr-only" htmlFor={`${idPrefix}-minimum-range`}>Minimum price</label>
            <input id={`${idPrefix}-minimum-range`} type="range" min={priceFloor} max={priceCeiling} value={Math.min(selectedMinimum, priceCeiling)} onChange={(event) => setMinimum(Number(event.target.value))} />
            <label className="sr-only" htmlFor={`${idPrefix}-maximum-range`}>Maximum price</label>
            <input id={`${idPrefix}-maximum-range`} type="range" min={priceFloor} max={priceCeiling} value={Math.max(selectedMaximum, priceFloor)} onChange={(event) => setMaximum(Number(event.target.value))} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="catalogue-price-input">From
              <input type="number" min={priceFloor} max={priceCeiling} inputMode="numeric" value={filters.minPrice} onBlur={() => normalizePriceInput("minimum")} onChange={(event) => onChange({ ...filters, minPrice: event.target.value })} placeholder={`₹${priceFloor.toLocaleString("en-IN")}`} />
            </label>
            <label className="catalogue-price-input">To
              <input type="number" min={priceFloor} max={priceCeiling} inputMode="numeric" value={filters.maxPrice} onBlur={() => normalizePriceInput("maximum")} onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })} placeholder={`₹${priceCeiling.toLocaleString("en-IN")}`} />
            </label>
          </div>
        </div> : <p className="mt-2 text-xs leading-5 text-[#70766f]">Price filtering will appear when catalogue pricing is available.</p>}
      </details>

      {onApply && (
        <div className="flex items-center gap-3 border-t border-[#e4e2da] pt-4">
          <button type="button" onClick={onClear} className="min-h-10 rounded-full px-3 text-sm font-semibold text-[#124734] underline underline-offset-4 hover:text-[#017F36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">Clear All</button>
          <button type="button" onClick={onApply} className="min-h-10 flex-1 rounded-full bg-[#017F36] px-4 text-sm font-semibold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">Apply Filters</button>
        </div>
      )}
    </div>
  );
}

export function ProductCatalogue({ products = [], initialParams = {}, isDevelopmentPreview = false }) {
  const [filters, setFilters] = useState(() => readInitialFilters(initialParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFiltersVisible, setDesktopFiltersVisible] = useState(true);
  const [siteHeaderHeight, setSiteHeaderHeight] = useState(0);
  const dialogRef = useRef(null);
  const subcategoryListRef = useRef(null);
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

  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const updateHeaderHeight = () => setSiteHeaderHeight(header.getBoundingClientRect().height);
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHeaderHeight) : null;
    observer?.observe(header);
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      observer?.disconnect();
    };
  }, []);

  const hasActiveFilters = filters.category !== "all" || filters.subcategory || filters.query || filters.minPrice || filters.maxPrice;
  const subcategoryOptions = [...new Map(products
    .filter((product) => product.mode === filters.mode)
    .filter((product) => filters.category === "all" || familyFor(product) === filters.category)
    .map((product) => {
      const id = slugify(product.category);
      return [id, { id, label: categoryDisplayNames[id] || product.category }];
    }))];

  return (
    <main className="min-h-[60vh] bg-[#F8F7F2] pb-16">
      <section className="catalogue-intro">
        <div className="mx-auto w-[min(100%-40px,1464px)] pt-3 sm:w-[min(100%-72px,1464px)]">
        <nav aria-label="Breadcrumb" className="mb-3 text-xs text-[#606860] sm:text-[13px]">
          <ol className="flex items-center gap-2"><li><Link href="/" className="hover:text-[#017F36]">Home</Link></li><li aria-hidden="true">/</li><li className="font-medium text-[#124734]" aria-current="page">Products</li></ol>
        </nav>

        <header className="catalogue-intro__content relative mb-0 flex min-h-[112px] flex-col justify-between gap-3 py-3 md:flex-row md:items-center md:py-4">
          <div className="relative z-10">
            <h1 className="font-editorial text-[34px] font-medium leading-[1.08] tracking-[-.025em] text-[#092f28] sm:text-[44px]">Explore Our Collection</h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 text-[#606860] sm:text-[15px]">Find furniture and home appliances for your home. Available for rent or purchase in Bengaluru.</p>
          </div>
          <div className="relative z-10 inline-flex w-fit shrink-0 rounded-full border border-[#e6e2d9] bg-white/75 p-1 shadow-sm md:mr-[24%]" role="tablist" aria-label="Choose rental or purchase listings">
            {[{ id: "rent", label: "Rent" }, { id: "buy", label: "Buy" }].map((mode) => (
              <button key={mode.id} type="button" role="tab" aria-selected={filters.mode === mode.id} onClick={() => updateFilters({ ...filters, mode: mode.id, minPrice: "", maxPrice: "" })} className={`min-h-9 min-w-[88px] rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] ${filters.mode === mode.id ? "bg-[#004c3a] text-white" : "text-[#252925] hover:bg-[#E9F1E9]"}`}>{mode.label}</button>
            ))}
          </div>
        </header>
        </div>
      </section>

      <div className="mx-auto w-[min(100%-40px,1464px)] sm:w-[min(100%-72px,1464px)]">
        {isDevelopmentPreview && products.some((product) => product.previewOnly) && (
          <aside role="note" className="mb-2 flex min-h-7 items-center gap-2 text-[10px] leading-4 text-[#66756b]">
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#e4eee4] text-[9px] font-bold text-[#124734]" aria-hidden="true">i</span>
            <span><strong className="font-semibold text-[#345746]">Development preview only.</strong> Sample product details, ratings, imagery and prices are illustrative, not verified inventory or commercial information.</span>
          </aside>
        )}

        <div style={{ top: `${siteHeaderHeight}px` }} className="sticky z-40 mb-3 grid min-w-0 grid-cols-1 items-center gap-3 border-b border-[#e7e5df] bg-[#F8F7F2] py-1 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-6" aria-label="Catalogue controls">
          <div className="flex min-w-0 items-center">
            <button type="button" onClick={() => setDesktopFiltersVisible((visible) => !visible)} aria-expanded={desktopFiltersVisible} aria-controls={desktopFiltersVisible ? "catalogue-filter-sidebar" : undefined} className="hidden min-h-10 shrink-0 items-center gap-1.5 rounded-md px-0 text-lg font-extrabold text-[#124734] hover:bg-[#E9F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] lg:inline-flex">
              {desktopFiltersVisible ? <><span>Hide filters</span><FiChevronRight aria-hidden="true" /></> : <><span>Show filters</span><FiChevronLeft aria-hidden="true" /></>}
            </button>
            <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#cfd8ce] px-4 text-sm font-semibold text-[#124734] lg:hidden"><FiFilter aria-hidden="true" />Filters{hasActiveFilters && <span className="grid size-5 place-items-center rounded-full bg-[#017F36] text-xs text-white">•</span>}</button>
          </div>
          <div className="flex min-w-0 items-center gap-2 lg:col-start-2 lg:row-start-1" aria-label="Product subcategories">
            <button type="button" aria-label="Show previous subcategories" aria-controls="product-subcategory-list" onClick={() => {
              const list = subcategoryListRef.current;
              if (!list) return;
              const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              list.scrollBy({ left: -Math.max(200, list.clientWidth * 0.75), behavior: reduceMotion ? "instant" : "smooth" });
            }} className="grid size-11 shrink-0 place-items-center rounded-full border border-[#dce2df] bg-white text-[#124734] hover:bg-[#E9F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"><FiChevronLeft aria-hidden="true" /></button>
            <div ref={subcategoryListRef} id="product-subcategory-list" className="catalogue-subcategory-scroll flex min-w-0 flex-1 items-center gap-3 overflow-hidden py-1">
              {subcategoryOptions.map(([id, option]) => (
                <button key={id} type="button" aria-pressed={filters.subcategory === id} onClick={() => updateFilters({ ...filters, subcategory: filters.subcategory === id ? "" : id }, true)} className={`min-h-12 shrink-0 rounded-xl px-5 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] ${filters.subcategory === id ? "bg-[#dff3f8] font-semibold text-[#007d9a]" : "bg-[#e7ebec] text-[#252925] hover:bg-[#dce4e5]"}`}>{option.label}</button>
              ))}
            </div>
            <button type="button" aria-label="Show more subcategories" aria-controls="product-subcategory-list" onClick={() => {
              const list = subcategoryListRef.current;
              if (!list) return;
              const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              list.scrollBy({ left: Math.max(200, list.clientWidth * 0.75), behavior: reduceMotion ? "instant" : "smooth" });
            }} className="grid size-11 shrink-0 place-items-center rounded-full border border-[#dce2df] bg-white text-[#124734] hover:bg-[#E9F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"><FiChevronRight aria-hidden="true" /></button>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <aside id="catalogue-filter-sidebar" className={`${desktopFiltersVisible ? "hidden lg:block" : "hidden"} w-[272px] min-w-0 shrink-0 rounded-xl border border-[#e7e5df] bg-white p-3.5 shadow-[0_2px_8px_rgba(37,41,37,.035)]`} aria-label="Product filters">
            <div className="mb-3 flex items-center justify-between border-b border-[#eceae3] pb-3 text-[#124734]"><div className="flex items-center gap-2"><FiFilter aria-hidden="true" /><h2 className="text-[15px] font-semibold">Filters</h2></div><button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#017F36] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">Clear All</button></div>
            <FilterOptions products={products} filters={filters} onChange={(next) => updateFilters(next, true)} onClear={clearFilters} idPrefix="desktop" />
          </aside>

          <section className="min-w-0 flex-1" aria-label={`${filters.mode === "rent" ? "Rental" : "Purchase"} products`}>

            {hasActiveFilters && <div className="mb-2 flex justify-end"><button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#124734] underline underline-offset-4 hover:text-[#017F36]">Clear filters</button></div>}

            {visibleProducts.length ? (
              <div className={`catalogue-product-grid grid min-w-0 grid-cols-2 items-start gap-3 sm:gap-5 lg:grid-cols-3 ${desktopFiltersVisible ? "catalogue-product-grid--filters-shown" : "catalogue-product-grid--filters-hidden"}`} aria-live="polite">
                {visibleProducts.map((product) => <ProductCard key={`${filters.mode}:${product.id}`} product={product} variant="catalogue" />)}
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
          <div className="flex-1"><FilterOptions products={products} filters={filters} onChange={(next) => updateFilters(next, true)} onClear={clearFilters} onApply={() => setMobileFiltersOpen(false)} idPrefix="mobile" /></div>
        </div>
      </dialog>
    </main>
  );
}
