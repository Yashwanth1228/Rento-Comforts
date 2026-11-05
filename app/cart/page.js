"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FiArrowRight, FiCalendar, FiCreditCard, FiHeadphones, FiLock, FiMinus, FiPlus, FiRefreshCw, FiShoppingCart, FiTool, FiTrash2, FiTruck } from "react-icons/fi";

function formatINRFromPaise(amountPaise) {
  if (!Number.isSafeInteger(amountPaise) || amountPaise < 0) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: amountPaise % 100 ? 2 : 0,
    maximumFractionDigits: amountPaise % 100 ? 2 : 0,
  }).format(amountPaise / 100);
}

function formatDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const hasPreviewItems = items.some((item) => item.previewOnly);
  const summary = useMemo(() => {
    const rentals = items.filter((item) => item.mode === "rent");
    const purchases = items.filter((item) => item.mode === "buy");
    const monthlyRentPaise = rentals.reduce((sum, item) => sum + (Number.isSafeInteger(item.monthlyRentalPricePaise) ? item.monthlyRentalPricePaise : 0), 0);
    const purchaseSubtotalPaise = purchases.reduce((sum, item) => sum + (Number.isSafeInteger(item.purchasePricePaise) ? item.purchasePricePaise * (Number.isSafeInteger(item.quantity) ? item.quantity : 1) : 0), 0);
    const deposits = rentals.map((item) => item.refundableDepositPaise);
    const depositTotalPaise = deposits.reduce((sum, deposit) => sum + (Number.isSafeInteger(deposit) ? deposit : 0), 0);
    return {
      rentals,
      purchases,
      monthlyRentPaise,
      purchaseSubtotalPaise,
      depositTotalPaise,
      hasMissingDeposit: deposits.some((deposit) => !Number.isSafeInteger(deposit)),
    };
  }, [items]);

  return (
    <>
      <SiteHeader />
      <main className={`${items.length === 0 ? "min-h-0 px-4 py-2 sm:px-7 sm:py-2 lg:px-10" : "min-h-[62vh] px-4 py-5 sm:px-7 sm:py-6 lg:px-10"} bg-[#fbfaf7]`}>
        <div className="mx-auto max-w-[1536px]">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#124734]">Your selections</p>
                <h1 className="mt-1 font-editorial text-4xl font-medium text-[#124734] sm:text-5xl">Your Cart</h1>
              </div>
              <div className="cart-populated-layout">
                <section aria-label="Cart items" className="cart-populated-items">
                  {hasPreviewItems && <PreviewNotice />}
                  <ul className="mt-4 space-y-4">
                    {items.map((item) => (
                      <CartItem key={item.cartKey} item={item} onRemove={removeItem} onQuantityChange={updateQuantity} />
                    ))}
                  </ul>
                  <div className="mt-4 grid gap-3 rounded-2xl bg-[#e9f1e9] px-4 py-4 text-sm text-[#124734] sm:grid-cols-2 sm:px-5 xl:grid-cols-4 xl:gap-0 xl:py-3">
                    <div className="flex items-center gap-2 xl:border-r xl:border-[#cbd9cb] xl:px-3"><FiLock className="size-5 shrink-0" /><span>Checkout unavailable</span></div>
                    <div className="flex items-center gap-2 xl:border-r xl:border-[#cbd9cb] xl:px-3"><FiTruck className="size-5 shrink-0" /><span>Delivery charges pending</span></div>
                    <div className="flex items-center gap-2 xl:border-r xl:border-[#cbd9cb] xl:px-3"><FiCalendar className="size-5 shrink-0" /><span>Rental details shown</span></div>
                    <div className="flex items-center gap-2 xl:px-3"><FiHeadphones className="size-5 shrink-0" /><span>No order placed</span></div>
                  </div>
                </section>
                <div className="cart-populated-aside"><CartSummary summary={summary} /></div>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <section className="cart-empty-hero grid min-h-[300px] items-center gap-5 py-2 md:grid-cols-[0.96fr_1.04fr] md:min-h-0 md:h-[320px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="relative mx-auto aspect-[1.3/1] w-full max-w-[500px] md:aspect-auto md:h-[300px] lg:-translate-x-3" role="img" aria-label="Illustrative arrangement of an armchair, refrigerator, washing machine and plant">
          <div className="absolute inset-x-[7%] inset-y-0 rounded-full" style={{ background: "radial-gradient(ellipse, #c8dec9 0%, #d5e5d4 61%, rgba(248,247,242,0) 73%)" }} />
          <div aria-hidden="true" className="absolute bottom-[12.5%] left-[4%] z-[1] h-[10%] w-[92%] rounded-[50%] bg-[#756b57]/20 blur-xl" />
          <Image src="/images/empty-cart-arrangement.webp" alt="" fill priority sizes="(max-width: 768px) 92vw, 500px" className="absolute inset-0 z-10 object-contain" />
        </div>
        <div className="max-w-[570px]">
          <div className="mb-3 grid place-items-center bg-[#edf5ec] text-[#017F36]" style={{ width: 72, height: 72, borderRadius: 18 }}><FiShoppingCart aria-hidden="true" className="size-10" /></div>
          <h1 className="font-sans text-4xl font-extrabold tracking-[-0.035em] text-[#124734] sm:text-5xl lg:text-[2.5rem]">Your Cart is Empty</h1>
          <p className="mt-2 text-lg font-medium text-[#4d5655] sm:text-xl">You haven’t added any items yet.</p>
          <p className="mt-1 max-w-[540px] text-base leading-6 text-[#59635c] sm:text-lg">Explore furniture, home appliances and combo options for rent or purchase on Rento Comforts.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/products?mode=buy" style={{ color: "#fff", minWidth: 238, minHeight: 52 }} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#017F36] px-6 text-base font-bold shadow-sm transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] sm:w-auto">Explore Products to Buy <FiArrowRight aria-hidden="true" className="size-5" /></Link>
            <Link href="/products?mode=rent" style={{ color: "#124734", minWidth: 228, minHeight: 52 }} className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#017F36] bg-white px-6 text-base font-bold transition-colors hover:bg-[#edf5ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36] sm:w-auto">Explore Rental Options</Link>
          </div>
        </div>
      </section>
      <div className="cart-empty-benefits mx-auto mt-4 grid min-h-[64px] max-w-[1280px] grid-cols-2 items-center gap-x-2 gap-y-2 py-2 text-xs text-[#252925] sm:text-sm lg:grid-cols-4 lg:gap-0 lg:py-1 lg:text-base">
        <div className="flex items-center gap-3 sm:justify-center lg:border-r lg:border-[#c9cbc5]"><FiCalendar aria-hidden="true" className="size-10 shrink-0 text-[#017F36]" /><p className="leading-[1.3]" style={{ fontSize: 16 }}>Rental plan<br />information</p></div>
        <div className="flex items-center gap-3 sm:justify-center lg:border-r lg:border-[#c9cbc5]"><FiTruck aria-hidden="true" className="size-10 shrink-0 text-[#017F36]" /><p className="leading-[1.3]" style={{ fontSize: 16 }}>Delivery &amp; setup<br />information</p></div>
        <div className="flex items-center gap-3 sm:justify-center lg:border-r lg:border-[#c9cbc5]"><FiTool aria-hidden="true" className="size-10 shrink-0 text-[#017F36]" /><p className="leading-[1.3]" style={{ fontSize: 16 }}>Maintenance<br />details</p></div>
        <div className="flex items-center gap-3 sm:justify-center"><FiRefreshCw aria-hidden="true" className="size-10 shrink-0 text-[#017F36]" /><p className="leading-[1.3]" style={{ fontSize: 16 }}>Purchase<br />options</p></div>
      </div>
    </div>
  );
}

function PreviewNotice() {
  return <aside role="note" className="rounded-xl border-l-4 border-[#017F36] bg-[#e9f1e9] px-4 py-3 text-sm leading-5 text-[#124734]">Development preview only. Sample products and prices are illustrative and do not confirm inventory or booking. Nothing here reserves stock or places an order.</aside>;
}

function CartItem({ item, onRemove, onQuantityChange }) {
  const isPurchase = item.mode === "buy";
  const quantity = isPurchase && Number.isSafeInteger(item.quantity) ? item.quantity : 1;
  const pricePaise = isPurchase ? item.purchasePricePaise : item.monthlyRentalPricePaise;
  const price = formatINRFromPaise(pricePaise);
  const deposit = formatINRFromPaise(item.refundableDepositPaise);
  const startDate = formatDate(item.rentalDates?.startDate);
  const durationMonths = item.rentalPlan?.durationMonths;

  return (
    <li className="cart-populated-item">
      <div className="cart-populated-item__image">
        <Image src={item.imageUrl} alt={item.imageAlt || item.name} fill sizes="(max-width: 640px) 90vw, 240px" className="object-cover" />
      </div>
      <div className="cart-populated-item__details">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold leading-6 text-[#252925]">{item.name.replace(/\s+—\s+Preview$/i, "")}</h2>
          {item.previewOnly && <span className="rounded-full bg-[#edf5ec] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#124734]">Preview</span>}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${isPurchase ? "border border-[#c4d6c5] text-[#326b42]" : "bg-[#e7f3e6] text-[#017F36]"}`}>{isPurchase ? "Purchase item" : "Rental item"}</span>
        </div>
        {item.category && <p className="mt-1 text-sm text-[#69736b]">{item.category}</p>}
        {price ? <p className="mt-2 text-xl font-bold text-[#124734]">{price}<span className="ml-1 text-sm font-normal text-[#59635c]">{isPurchase ? "one-time" : "/month"}</span></p> : <p className="mt-2 text-sm font-semibold text-[#69736b]">Price not configured</p>}
        {isPurchase ? <p className="mt-1 text-sm text-[#69736b]">One-time purchase price</p> : (
          <>
            <p className="mt-1 flex items-center gap-2 text-sm text-[#59635c]"><FiCreditCard className="size-4 shrink-0 text-[#124734]" /><span>Security deposit: {deposit || "To be confirmed"}</span></p>
            <div className="mt-2 grid max-w-[510px] gap-2 sm:grid-cols-2">
              <div className="flex min-h-9 items-center gap-2 rounded-xl border border-[#dedfd9] bg-white px-3 py-2 text-xs text-[#252925]"><FiCalendar className="size-4 shrink-0 text-[#124734]" /><span>Start date: {startDate || "Not selected"}</span></div>
              <div className="flex min-h-9 items-center gap-2 rounded-xl border border-[#dedfd9] bg-white px-3 py-2 text-xs text-[#252925]"><FiRefreshCw className="size-4 shrink-0 text-[#124734]" /><span>Duration: {Number.isInteger(durationMonths) ? `${durationMonths} ${durationMonths === 1 ? "month" : "months"}` : "Not configured"}</span></div>
            </div>
            {Number.isInteger(item.minimumRentalMonths) && <p className="mt-2 text-xs text-[#69736b]">Minimum rental: {item.minimumRentalMonths} {item.minimumRentalMonths === 1 ? "month" : "months"}</p>}
          </>
        )}
      </div>
      <div className="cart-populated-item__actions">
        {isPurchase ? <div className="inline-flex h-10 items-center rounded-full border border-[#d9ded8] bg-white" aria-label={`Quantity ${quantity}`}>
          <button type="button" onClick={() => onQuantityChange(item.cartKey, Math.max(1, quantity - 1))} disabled={quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} className="grid size-10 place-items-center rounded-l-full text-[#124734] transition-colors hover:bg-[#edf5ec] disabled:cursor-not-allowed disabled:opacity-40"><FiMinus aria-hidden="true" /></button>
          <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-[#252925]">{quantity}</span>
          <button type="button" onClick={() => onQuantityChange(item.cartKey, quantity + 1)} disabled={!Number.isSafeInteger(quantity + 1)} aria-label={`Increase quantity of ${item.name}`} className="grid size-10 place-items-center rounded-r-full text-[#124734] transition-colors hover:bg-[#edf5ec] disabled:cursor-not-allowed disabled:opacity-40"><FiPlus aria-hidden="true" /></button>
        </div> : <span className="inline-flex h-10 items-center rounded-full border border-[#d9ded8] px-4 text-sm text-[#252925]">1 rental</span>}
        <button type="button" onClick={() => onRemove(item.cartKey)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#a9c4ad] px-4 text-sm font-semibold text-[#124734] transition-colors hover:bg-[#edf5ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"><FiTrash2 aria-hidden="true" className="size-4" />Remove</button>
      </div>
    </li>
  );
}

function CartSummary({ summary }) {
  const { rentals, purchases, monthlyRentPaise, purchaseSubtotalPaise, depositTotalPaise, hasMissingDeposit } = summary;
  return (
    <aside className="cart-populated-summary h-fit rounded-2xl border border-[#e6e4de] bg-white p-5 shadow-[0_4px_18px_rgba(37,41,37,0.065)] lg:sticky lg:top-6 lg:p-6">
      <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-[#124734]">Cart Summary</h2><span className="rounded-full bg-[#e9f1e9] px-3 py-1 text-xs font-semibold text-[#124734]">{rentals.length + purchases.length} {rentals.length + purchases.length === 1 ? "item" : "items"}</span></div>
      <dl className="mt-4 space-y-0 text-sm">
        {rentals.length > 0 && <SummaryRow label="Monthly rent total" value={formatINRFromPaise(monthlyRentPaise)} suffix="/month" />}
        {purchases.length > 0 && <SummaryRow label="Purchase subtotal" value={formatINRFromPaise(purchaseSubtotalPaise)} />}
        {rentals.length > 0 && <SummaryRow label="Security deposit" value={formatINRFromPaise(depositTotalPaise)} note={hasMissingDeposit ? "Some deposits pending confirmation" : null} />}
        <SummaryRow label="Delivery & setup" value="To be confirmed" />
        <SummaryRow label="Discount" value="Not configured" />
      </dl>
      <div className="mt-3 rounded-xl bg-[#e9f1e9] p-4">
        <div className="flex items-center justify-between gap-3"><span className="font-bold text-[#124734]">Final amount</span><span className="text-right text-lg font-bold text-[#124734]">Pending confirmation</span></div>
        {rentals.length > 0 && <p className="mt-2 border-t border-[#cad9ca] pt-2 text-sm font-semibold text-[#124734]">Recurring monthly rent <span className="float-right">{formatINRFromPaise(monthlyRentPaise) || "—"}/mo</span></p>}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#69736b]">Rental duration, delivery/setup charges and applicable payment terms are not fully configured. This cart does not reserve stock.</p>
      <button type="button" disabled aria-disabled="true" title="Checkout is unavailable until pricing and inventory validation are configured" className="mt-4 inline-flex min-h-[50px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#9aafa0] px-5 text-sm font-bold text-white">Checkout unavailable <FiArrowRight aria-hidden="true" /></button>
      <p className="mt-2 text-center text-[11px] leading-4 text-[#69736b]">Checkout needs configured pricing and inventory validation.</p>
      <Link href="/products" className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#a9c4ad] px-4 text-sm font-semibold text-[#124734] transition-colors hover:bg-[#edf5ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">Continue Shopping</Link>
    </aside>
  );
}

function SummaryRow({ label, value, suffix = "", note }) {
  return <div className="flex items-start justify-between gap-4 border-b border-[#efeee9] py-2.5 last:border-0"><dt className="text-[#59635c]">{label}{note && <span className="mt-1 block text-[10px] text-[#69736b]">{note}</span>}</dt><dd className="shrink-0 text-right font-semibold text-[#252925]">{value || "To be confirmed"}{suffix && value ? <span className="ml-1 text-xs font-normal">{suffix}</span> : null}</dd></div>;
}
