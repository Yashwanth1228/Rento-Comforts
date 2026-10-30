"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { FiEye, FiShoppingCart } from "react-icons/fi";

const catalogueArtwork = {
  sofas: { src: "/images/category-dining-tables.webp", alt: "Illustrative living room with a sofa" },
  beds: { src: "/images/category-beds.webp", alt: "Illustrative bedroom with a bed" },
  refrigerators: { src: "/images/category-refrigerators.webp", alt: "Illustrative kitchen with a refrigerator" },
  "washing machines": { src: "/images/category-washing-machines.webp", alt: "Illustrative laundry area with a washing machine" },
};

function formatINRFromPaise(amountPaise) {
  if (!Number.isSafeInteger(amountPaise) || amountPaise < 0) {
    return null;
  }

  const rupees = Math.floor(amountPaise / 100);
  const paise = amountPaise % 100;
  const formattedRupees = new Intl.NumberFormat("en-IN").format(rupees);

  return `₹${formattedRupees}${
    paise === 0 ? "" : `.${String(paise).padStart(2, "0")}`
  }`;
}

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#e2e2dc] py-3 last:border-b-0">
      <dt className="text-sm text-[#606860]">{label}</dt>
      <dd className="text-right text-sm font-medium text-[#252925]">
        {children}
      </dd>
    </div>
  );
}

/** Displays a concise rental or purchase card and an accessible details preview. */
export function ProductCard({ product, variant = "default" }) {
  const mode = product.mode === "buy" ? "buy" : "rent";
  const isPurchase = mode === "buy";
  const catalogueImage = catalogueArtwork[product.category?.toLowerCase()];
  const imageUrl = variant === "catalogue" && catalogueImage ? catalogueImage.src : product.imageUrl;
  const imageAlt = variant === "catalogue" && catalogueImage ? catalogueImage.alt : product.imageAlt;
  const displayName = variant === "catalogue" ? product.name.replace(/\s+— Preview$/, "") : product.name;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const dialogRef = useRef(null);
  const { items: cartItems, addItem } = useCart();
  const monthlyRent = isPurchase
    ? null
    : formatINRFromPaise(product.monthlyRentalPricePaise);
  const purchasePrice = isPurchase
    ? formatINRFromPaise(product.purchasePricePaise)
    : null;
  const refundableDeposit = formatINRFromPaise(
    isPurchase ? null : product.refundableDepositPaise,
  );
  const cartKey = `${mode}:${product.id}`;
  const isInCart = cartItems.some((item) => item.cartKey === cartKey);
  const itemPricePaise = isPurchase
    ? product.purchasePricePaise
    : product.monthlyRentalPricePaise;
  const hasValidPrice =
    Number.isSafeInteger(itemPricePaise) && itemPricePaise > 0;

  function handleAddToCart() {
    const added = addItem(product);
    setCartMessage(
      added
        ? `${product.name} added to cart.`
        : !hasValidPrice
          ? "This item needs a valid price before it can be added."
          : "This preview item cannot be added to the production cart.",
    );
  }

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isQuickViewOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isQuickViewOpen && dialog.open) {
      dialog.close();
    }
  }, [isQuickViewOpen]);

  return (
    <>
      <article className={`rental-product-card group relative self-start rounded-2xl border border-[#e2e2dc] bg-white p-3 shadow-sm transition-[transform,box-shadow] duration-300 motion-reduce:transition-none hover:shadow-lg${variant === "catalogue" ? " rental-product-card--catalogue" : ""}`}>
        <div className={`relative overflow-hidden bg-[#F8F7F2] ${variant === "catalogue" ? "aspect-[1.62] rounded-t-[13px]" : "aspect-[4/3] rounded-xl"}`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 44vw, (max-width: 1000px) 45vw, 22vw"
            className={variant === "catalogue" ? "object-cover" : "object-contain p-4"}
          />

        </div>

        <div className={`rental-product-card__details px-1 pb-0 pt-2 sm:min-h-[4.5rem] sm:pb-2 sm:pt-3 ${variant === "catalogue" ? "rental-product-card__details--catalogue" : ""}`}>
          <h3 className={`truncate font-semibold leading-6 text-[#252925] ${variant === "catalogue" ? "text-[13px] sm:text-sm" : "text-sm sm:text-base"}`}>
            {displayName}
          </h3>
          {variant === "catalogue" && product.description && <p className="mt-0.5 truncate text-[11px] leading-4 text-[#747a75]">{product.description}</p>}

          {(isPurchase ? purchasePrice : monthlyRent) !== null && (
            <p className={`mt-1 font-semibold leading-5 text-[#124734] ${variant === "catalogue" ? "text-[14px]" : "text-sm sm:text-base"}`}>
              {isPurchase ? purchasePrice : monthlyRent}
              {!isPurchase && (
                <span className="ml-1 text-xs font-normal text-[#606860]">/mo</span>
              )}
            </p>
          )}
        </div>

        <div className={`rental-product-card__actions grid grid-cols-1 items-center gap-2 overflow-hidden px-1 transition-[max-height,opacity,transform,padding-bottom,border-color] duration-200 motion-reduce:transition-none sm:grid-cols-2${variant === "catalogue" ? " rental-product-card__actions--catalogue" : ""}`}>
          <button
            type="button"
            onClick={() => setIsQuickViewOpen(true)}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#b8c9bc] bg-white px-3 text-sm font-semibold text-[#124734] transition-colors hover:bg-[#E9F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"
          >
            {variant === "catalogue" && <FiEye aria-hidden="true" className="mr-1.5" />}
            Quick View
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isInCart}
            aria-label={isInCart ? `${displayName} is already in the cart` : `Add ${displayName} to cart`}
            aria-disabled={isInCart}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#017F36] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {variant === "catalogue" && <FiShoppingCart aria-hidden="true" className="mr-1.5" />}
            Add to Cart
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {cartMessage}
        </p>
      </article>

      <dialog
        ref={dialogRef}
        aria-labelledby={`quick-view-title-${product.id}`}
        onClose={() => setIsQuickViewOpen(false)}
        className="m-auto max-h-[88vh] w-[min(92vw,36rem)] overflow-y-auto rounded-2xl border border-[#e2e2dc] bg-white p-0 text-[#252925] shadow-2xl backdrop:bg-[#252925]/55"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e2e2dc] px-5 py-4 sm:px-6">
          <div>
            {product.previewOnly && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#017F36]">
                Illustrative development preview
              </p>
            )}
            <h2
              id={`quick-view-title-${product.id}`}
              className="font-editorial text-2xl font-medium text-[#124734] sm:text-3xl"
            >
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsQuickViewOpen(false)}
            aria-label="Close quick view"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#e2e2dc] text-2xl leading-none text-[#124734] transition-colors hover:bg-[#E9F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:p-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F8F7F2]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 84vw, 260px"
              className="object-contain p-4"
            />
          </div>

          <dl className="divide-y-0">
            {(product.brand || product.category) && (
              <DetailRow label="Brand and category">
                {[product.brand, product.category].filter(Boolean).join(" · ")}
              </DetailRow>
            )}
            {isPurchase && purchasePrice !== null && (
              <DetailRow label="One-time purchase price">{purchasePrice}</DetailRow>
            )}
            {monthlyRent !== null && (
              <DetailRow label="Monthly rent">{monthlyRent}/mo</DetailRow>
            )}
            {refundableDeposit !== null && (
              <DetailRow label="Refundable deposit">
                {refundableDeposit}
              </DetailRow>
            )}
            {Number.isSafeInteger(product.minimumRentalMonths) &&
              !isPurchase &&
              product.minimumRentalMonths > 0 && (
                <DetailRow label="Minimum duration">
                  {product.minimumRentalMonths} {product.minimumRentalMonths === 1 ? "month" : "months"}
                </DetailRow>
              )}
            {!isPurchase && product.availabilityMessage && (
              <DetailRow label="Availability information">
                <span className="max-w-40 font-normal">
                  {product.availabilityMessage}
                </span>
              </DetailRow>
            )}
            {isPurchase && product.specifications && (
              <DetailRow label="Specifications">{product.specifications}</DetailRow>
            )}
            {isPurchase && product.warrantyInformation && (
              <DetailRow label="Warranty">{product.warrantyInformation}</DetailRow>
            )}
            {isPurchase && product.stockStatusVerified && product.stockStatus && (
              <DetailRow label="Stock status">{product.stockStatus}</DetailRow>
            )}
          </dl>
        </div>

        {product.previewOnly && (
          <p className="mx-5 mb-5 rounded-lg bg-[#E9F1E9] p-3 text-sm text-[#124734] sm:mx-6 sm:mb-6">
            Sample information for local design review only. This is not
            verified inventory, approved pricing, or confirmed availability.
          </p>
        )}
      </dialog>
    </>
  );
}

// Preserve the existing import name while the component now supports both modes.
export const RentalProductCard = ProductCard;
