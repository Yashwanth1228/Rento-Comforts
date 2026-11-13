"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiTruck,
  FiX,
} from "react-icons/fi";
import { AccountSidebar } from "@/components/account/account-sidebar";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import { MobileOrdersHero } from "@/components/account/account-orders-screen";

const tabs = [
  { id: "all", desktop: "All Orders", mobile: "All Orders" },
  { id: "rent", desktop: "Rent Orders", mobile: "Rentals" },
  { id: "buy", desktop: "Buy Orders", mobile: "Purchases" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function StatusBadge({ order, compact = false }) {
  const Icon = order.statusTone === "success" ? FiCheckCircle : order.statusTone === "info" ? FiTruck : FiClock;
  const tone = order.statusTone === "success"
    ? "bg-[#e3f4e2] text-[#12612e]"
    : order.statusTone === "info"
      ? "bg-[#e5f2ff] text-[#17518e]"
      : "bg-[#fff0d1] text-[#83500a]";

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold ${compact ? "text-[11px]" : "text-xs sm:text-sm"} ${tone}`}>
      <Icon aria-hidden="true" className={compact ? "size-3.5" : "size-4"} />
      {order.status}
    </span>
  );
}

function OrderTypeBadge({ order }) {
  const isRent = order.type === "rent";
  const Icon = isRent ? FiCalendar : FiShoppingCart;
  return (
    <span className={`inline-flex min-h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${isRent ? "bg-[#e4f4e3] text-[#165b2e]" : "bg-[#fff0d1] text-[#83500a]"}`}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {isRent ? <>Rent{order.durationMonths && <span>({order.durationMonths} Months)</span>}</> : "Buy"}
    </span>
  );
}

function OrderCard({ order, onDetails }) {
  const priceText = order.type === "rent" ? `${formatPrice(order.price)}/month` : formatPrice(order.price);

  return (
    <article className="order-preview-card grid w-full min-w-0 grid-cols-[82px_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-2xl border border-[#e8e6df] bg-white p-3 shadow-[0_2px_8px_rgba(37,41,37,0.035)] sm:grid-cols-[110px_minmax(0,1fr)] sm:p-4 lg:grid-cols-[110px_minmax(0,1fr)] lg:gap-3 xl:grid-cols-[120px_minmax(0,1fr)_minmax(165px,190px)_160px] xl:gap-3">
      <div className="relative aspect-[1.2/1] w-full min-w-0 overflow-hidden rounded-xl bg-[#f3f1eb] sm:aspect-[1.6/1] lg:aspect-[16/10] xl:aspect-[16/10]">
        <Image src={order.image} alt={`${order.name}, illustrative preview`} fill sizes="(max-width: 639px) 82px, (max-width: 1023px) 110px, 150px" className="object-cover" />
        <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#124734] lg:hidden">Sample</span>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-1 self-stretch xl:pr-3">
        <div className="flex items-start justify-between gap-1.5 lg:items-center">
        <h3 className="min-w-0 text-[15px] font-bold leading-5 text-[#252925] sm:text-base lg:text-[17px]">{order.name}</h3>
          <span className="shrink-0 lg:hidden"><StatusBadge order={order} compact /></span>
        </div>
        <p className="truncate text-xs leading-5 text-[#303731] sm:text-sm">Order ID: <span className="font-medium">{order.id}</span></p>
        <div className="flex min-w-0 flex-nowrap items-center gap-1.5 text-xs text-[#303731] sm:gap-2 xl:gap-2">
          <FiCalendar aria-hidden="true" className="size-4 shrink-0 text-[#124734]" />
          <span className="whitespace-nowrap text-[13px] font-medium">Order Date: {order.date}</span>
          <span aria-hidden="true" className="hidden h-5 shrink-0 border-l border-[#c9ccc7] lg:block" />
          <span className="hidden lg:inline-flex"><OrderTypeBadge order={order} /></span>
        </div>
      </div>

      <div className="hidden min-w-0 flex-col items-start justify-center gap-2 border-l border-[#e4e3dd] pl-5 xl:flex">
        <StatusBadge order={order} />
        <strong className="text-base text-[#252925]">{priceText}</strong>
      </div>

      <button type="button" onClick={() => onDetails(order)} className="hidden min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00663e] to-[#00833f] px-4 text-sm font-bold text-white shadow-[0_3px_8px_rgba(0,90,52,0.18)] transition-colors hover:from-[#005534] hover:to-[#006b35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] xl:inline-flex">
        View Details <FiArrowRight aria-hidden="true" className="size-4" />
      </button>

      <div className="col-span-2 flex min-w-0 items-center justify-between gap-2 border-t border-[#e9e8e2] pt-2.5 xl:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <span className="lg:hidden"><OrderTypeBadge order={order} /></span>
          <strong className="truncate text-sm text-[#252925] sm:text-base">{priceText}</strong>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden lg:inline-flex"><StatusBadge order={order} /></span>
          <button type="button" onClick={() => onDetails(order)} aria-label={`View sample details for ${order.name}`} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00663e] to-[#00833f] px-3 text-xs font-bold text-white shadow-[0_3px_8px_rgba(0,90,52,0.16)] hover:from-[#005534] hover:to-[#006b35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:text-sm">
          View Details <FiArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function PreviewDetails({ order, onClose }) {
  useEffect(() => {
    if (!order) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [order, onClose]);

  if (!order) return null;
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#10271d]/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="sample-order-detail-title" className="w-full max-w-md rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-2xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#688170]">Sample Orders — UI Preview</p><h2 id="sample-order-detail-title" className="mt-1 text-xl font-bold text-[#124734]">{order.name}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close sample order preview" className="grid size-9 shrink-0 place-items-center rounded-full text-[#46534a] hover:bg-[#f2f5f0] focus-visible:outline-2 focus-visible:outline-[#017f36]"><FiX aria-hidden="true" /></button>
        </header>
        <p className="mt-3 rounded-lg bg-[#f4f7f2] px-3 py-2 text-xs leading-5 text-[#44554a]">Fictional development data for layout review only. This is not a customer order and has no payment, delivery, rental, cancellation, or tracking actions.</p>
        <dl className="mt-4 grid grid-cols-[115px_1fr] gap-x-3 gap-y-3 text-sm">
          <dt className="text-[#667068]">Sample order ID</dt><dd className="font-semibold text-[#252925]">{order.id}</dd>
          <dt className="text-[#667068]">Order date</dt><dd className="font-semibold text-[#252925]">{order.date}</dd>
          <dt className="text-[#667068]">Type</dt><dd className="font-semibold capitalize text-[#252925]">{order.type}{order.durationMonths ? ` · ${order.durationMonths} months` : ""}</dd>
          <dt className="text-[#667068]">Status</dt><dd className="font-semibold text-[#252925]">{order.status}</dd>
          <dt className="text-[#667068]">Sample price</dt><dd className="font-semibold text-[#252925]">{order.type === "rent" ? `${formatPrice(order.price)}/month` : formatPrice(order.price)}</dd>
        </dl>
        <button type="button" onClick={onClose} className="mt-5 min-h-11 w-full rounded-xl bg-[#017f36] px-4 text-sm font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Close Preview</button>
      </section>
    </div>
  );
}

export default function AccountOrdersPreviewScreen({ orders }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const counts = useMemo(() => ({
    all: orders.length,
    rent: orders.filter((order) => order.type === "rent").length,
    buy: orders.filter((order) => order.type === "buy").length,
  }), [orders]);
  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.type === filter;
      const matchesSearch = !query || `${order.name} ${order.id} ${order.category}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, orders, search]);

  return (
    <>
      <div className="hidden xl:block">
        <AccountWelcomeBanner fullName="" title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact />
      </div>
      <MobileOrdersHero populated />

      <main className="mobile-orders-main bg-[#f8f7f2] px-3 py-3 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:py-2 xl:pb-3 xl:pl-8 xl:pr-4">
        <div className="mx-auto max-w-[1640px]">
          <div className="grid items-start gap-4 xl:grid-cols-[clamp(280px,19.6vw,328px)_minmax(0,1fr)] xl:gap-4">
            <AccountSidebar activeSection="orders" />
            <section className="account-orders-preview-panel min-w-0 rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-5 xl:p-5">
              <header className="hidden items-center gap-4 border-b border-[#eceae4] pb-3 xl:flex">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiPackage aria-hidden="true" className="size-7" /></span>
                <div><h1 className="text-[28px] font-bold leading-tight text-[#252925]">My Orders</h1><p className="mt-1 text-base text-[#59635c]">View and track your purchases and rentals in one place.</p></div>
              </header>

              <div className="mt-2 flex flex-col gap-3 sm:mt-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Filter sample orders">
                  {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setFilter(tab.id)} aria-pressed={filter === tab.id} className={`min-h-10 rounded-full border px-2 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:px-4 sm:text-sm lg:min-h-11 lg:text-sm ${filter === tab.id ? "border-[#00643c] bg-gradient-to-r from-[#00663e] to-[#00833f] text-white shadow-sm" : "border-[#d8d9d3] bg-white text-[#252925] hover:border-[#9ab7a2] hover:bg-[#f7faf5]"}`}>
                      <span className="lg:hidden">{tab.mobile}</span><span className="hidden lg:inline">{tab.desktop} ({counts[tab.id]})</span><span className="lg:hidden"> ({counts[tab.id]})</span>
                    </button>
                  ))}
                </div>
                <label className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-[#d8dad4] bg-white px-3 text-[#124734] focus-within:border-[#7fa88d] focus-within:ring-2 focus-within:ring-[#017f36]/15 lg:max-w-[380px]">
                  <FiSearch aria-hidden="true" className="size-4 shrink-0" />
                  <span className="sr-only">Search sample orders</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order ID or product..." className="min-w-0 flex-1 bg-transparent text-sm text-[#252925] outline-none placeholder:text-[#858a84]" />
                </label>
              </div>

              <p role="note" className="mt-3 flex items-center gap-2 rounded-lg border border-[#cfe3d1] bg-[#eff7ed] px-3 py-2 text-xs font-semibold text-[#124734]">
                <span className="size-2 shrink-0 rounded-full bg-[#017f36]" />Sample Orders — UI Preview <span className="font-normal text-[#59635c]">· fictional data, local development only</span>
              </p>

              <div className="mt-3 grid gap-3 sm:gap-3.5">
                {visibleOrders.map((order) => <OrderCard key={order.id} order={order} onDetails={setSelectedOrder} />)}
                {!visibleOrders.length && <p className="rounded-xl border border-dashed border-[#d8dad4] bg-[#fafbf8] px-4 py-8 text-center text-sm text-[#667068]">No sample orders match this filter or search.</p>}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eceae4] pt-3">
                <p className="text-[11px] leading-5 text-[#69736b]">Illustrative sample records. No real customer order data is connected.</p>
                <Link href="/account/orders" className="inline-flex min-h-10 items-center rounded-lg px-3 text-xs font-semibold text-[#124734] underline decoration-[#9ab6a3] underline-offset-4 hover:text-[#017f36] focus-visible:outline-2 focus-visible:outline-[#017f36]">Exit preview and return to My Orders</Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <PreviewDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}
