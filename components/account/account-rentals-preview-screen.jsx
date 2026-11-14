"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiInfo,
  FiRotateCcw,
  FiSearch,
  FiShield,
  FiTool,
  FiTruck,
  FiX,
} from "react-icons/fi";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import { RentalsWelcomeHero } from "@/components/account/account-rentals-screen";

const filters = [
  { id: "active", label: "Active Rentals" },
  { id: "ending-soon", label: "Ending Soon" },
  { id: "all", label: "All Rentals" },
];

const actionItems = [
  { label: "Extend Rental", Icon: FiCalendar, tone: "primary" },
  { label: "Request Return", Icon: FiRotateCcw, tone: "secondary" },
  { label: "Maintenance Request", Icon: FiTool, tone: "secondary" },
  { label: "View Details", Icon: FiInfo, tone: "secondary" },
];

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function SummaryCard({ icon: Icon, value, label, tone = "sage" }) {
  const toneClass = tone === "amber" ? "bg-[#fff8ed]" : "bg-[#f0f7ef]";
  const iconClass = tone === "amber" ? "bg-[#fff0d1] text-[#996000]" : "bg-[#dcefdc] text-[#08763b]";
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-xl border border-[#e9e8e2] ${toneClass} px-3 py-3 shadow-[0_2px_8px_rgba(37,41,37,.035)] sm:px-4`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-full ${iconClass} sm:size-11`}><Icon aria-hidden="true" className="size-5 sm:size-6" /></span>
      <span className="min-w-0"><strong className="block truncate text-lg font-bold leading-6 text-[#252925] sm:text-xl">{value}</strong><span className="block text-xs leading-4 text-[#39433c] sm:text-sm">{label}</span></span>
    </div>
  );
}

function RentalStatus({ rental }) {
  const ending = rental.statusKey === "ending-soon";
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm ${ending ? "bg-[#fff0d1] text-[#845000]" : "bg-[#e3f4e2] text-[#12612e]"}`}>
      {ending ? <FiClock aria-hidden="true" className="size-4" /> : <FiCheckCircle aria-hidden="true" className="size-4" />}
      {rental.status}
    </span>
  );
}

function RentalActionButton({ action, onClick }) {
  const { Icon, label, tone } = action;
  return (
    <button type="button" onClick={onClick} className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-bold leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:min-h-11 sm:gap-2 sm:px-3 sm:text-xs ${tone === "primary" ? "border-[#08763b] bg-[#08763b] text-white hover:bg-[#075d32]" : "border-[#9cc7a7] bg-white text-[#124734] hover:bg-[#f0f7ef]"}`}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>{label}</span>
      {label === "View Details" && <FiArrowRight aria-hidden="true" className="hidden size-3.5 shrink-0 sm:block" />}
    </button>
  );
}

function RentalCard({ rental, onAction }) {
  const remainingPercent = Math.max(6, Math.min(100, (rental.remainingMonths / rental.durationMonths) * 100));

  return (
    <article className="grid min-w-0 grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-3 rounded-2xl border border-[#e8e6df] bg-white p-3 shadow-[0_2px_9px_rgba(37,41,37,.045)] sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-4 sm:p-4 xl:grid-cols-[110px_minmax(0,1.5fr)_minmax(100px,.8fr)_minmax(115px,.9fr)] xl:items-center xl:gap-3 xl:p-3 2xl:grid-cols-[128px_minmax(180px,1.35fr)_minmax(112px,.8fr)_minmax(120px,.8fr)_minmax(210px,1.15fr)]">
      <div className="relative row-span-1 aspect-square w-full overflow-hidden rounded-xl bg-[#f3f1eb] sm:row-span-1 sm:aspect-[1.2/1] xl:aspect-[1.15/1] 2xl:aspect-[1.25/1]">
        <Image src={rental.image} alt={`${rental.name}, sample rental preview`} fill sizes="(max-width: 639px) 112px, (max-width: 1279px) 150px, 128px" className="object-cover" />
        <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#124734]">Sample</span>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-1 xl:gap-0.5">
        <h3 className="text-sm font-bold leading-5 text-[#252925] sm:text-lg sm:leading-6">{rental.name}</h3>
        <p className="truncate text-[11px] leading-4 text-[#4c554e] sm:text-sm">Rental ID: <span className="font-semibold">{rental.id}</span></p>
        <p className="flex items-center gap-1.5 text-[11px] leading-4 text-[#39433c] sm:text-sm xl:mt-1"><FiCalendar aria-hidden="true" className="size-3.5 shrink-0 text-[#124734] sm:size-4" />Started: {rental.startDate}</p>
        <p className="flex items-center gap-1.5 text-[11px] leading-4 text-[#39433c] sm:text-sm"><FiCalendar aria-hidden="true" className="size-3.5 shrink-0 text-[#124734] sm:size-4" />Ends: {rental.endDate}</p>
      </div>

      <div className="col-span-2 flex min-w-0 items-center justify-between gap-3 border-t border-[#efeee9] pt-2 sm:col-span-2 sm:pt-3 xl:col-span-1 xl:flex-col xl:items-start xl:justify-center xl:gap-2 xl:border-l xl:border-t-0 xl:py-1 xl:pl-3 xl:pt-1">
        <div className="flex min-w-0 flex-col gap-1.5">
          <RentalStatus rental={rental} />
          <span className="whitespace-nowrap text-xs font-medium text-[#303731] sm:text-sm">{rental.durationMonths}-Month Rental</span>
        </div>
        <div className="min-w-[110px] rounded-lg bg-[#edf6ea] px-2.5 py-1.5 text-right text-[11px] font-semibold text-[#165b2e] sm:text-left xl:min-w-0 xl:text-xs">
          <span className="xl:hidden">Remaining: </span>{rental.remainingMonths} {rental.remainingMonths === 1 ? "Month" : "Months"}
          <div className="mt-1 hidden h-1.5 overflow-hidden rounded-full bg-[#d3e8cf] xl:block"><span className="block h-full rounded-full bg-[#08763b]" style={{ width: `${remainingPercent}%` }} /></div>
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-3 divide-x divide-[#e9e8e2] border-t border-[#efeee9] pt-2 sm:pt-3 xl:col-span-1 xl:grid-cols-1 xl:gap-1.5 xl:divide-x-0 xl:border-l xl:border-t-0 xl:py-1 xl:pl-3 xl:pt-1">
        <div className="min-w-0 px-1 first:pl-0 xl:px-0">
          <span className="block text-[9px] leading-3 text-[#59635c] sm:text-[11px] xl:text-[10px]">Monthly Rent</span>
          <strong className="block whitespace-nowrap text-xs font-bold text-[#252925] sm:text-base">{formatINR(rental.monthlyRent)}<span className="hidden font-normal xl:inline">/mo</span></strong>
        </div>
        <div className="min-w-0 px-2 sm:px-3 xl:px-0">
          <span className="block text-[9px] leading-3 text-[#59635c] sm:text-[11px] xl:text-[10px]">Security Deposit</span>
          <strong className="block whitespace-nowrap text-xs font-bold text-[#252925] sm:text-base">{formatINR(rental.securityDeposit)}</strong>
        </div>
        <div className="min-w-0 px-2 sm:px-3 xl:px-0">
          <span className="block text-[9px] leading-3 text-[#59635c] sm:text-[11px] xl:text-[10px]">Next Payment</span>
          <strong className="block whitespace-nowrap text-[10px] font-bold text-[#252925] sm:text-sm">{rental.nextPaymentDate}</strong>
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-2 xl:col-span-4 xl:grid-cols-4 2xl:col-span-1 2xl:grid-cols-2 2xl:gap-2">
        {actionItems.map((action) => <RentalActionButton key={action.label} action={action} onClick={() => onAction(rental, action.label)} />)}
      </div>

      <div className="col-span-2 rounded-lg bg-[#f0f7ef] px-3 py-2 sm:px-4 xl:hidden">
        <div className="flex items-center justify-between gap-2 text-[11px] text-[#39433c] sm:text-sm"><span>Remaining Term</span><strong className="text-[#124734]">{rental.remainingMonths} {rental.remainingMonths === 1 ? "Month" : "Months"} <span className="font-normal">(until {rental.endDate})</span></strong></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#d3e8cf]"><span className="block h-full rounded-full bg-[#08763b]" style={{ width: `${remainingPercent}%` }} /></div>
      </div>
    </article>
  );
}

function RentalPreviewDialog({ selection, onClose }) {
  useEffect(() => {
    if (!selection) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selection, onClose]);

  if (!selection) return null;
  const { rental, action } = selection;
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#10271d]/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="rental-preview-dialog-title" className="w-full max-w-md rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-2xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#688170]">Sample Rentals — UI Preview</p><h2 id="rental-preview-dialog-title" className="mt-1 text-xl font-bold text-[#124734]">{action}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close sample rental preview" className="grid size-9 shrink-0 place-items-center rounded-full text-[#46534a] hover:bg-[#f2f5f0] focus-visible:outline-2 focus-visible:outline-[#017f36]"><FiX aria-hidden="true" /></button>
        </header>
        <p className="mt-3 rounded-lg bg-[#f4f7f2] px-3 py-2 text-xs leading-5 text-[#44554a]">This is fictional development data. No rental will be extended, returned, serviced, or changed.</p>
        <dl className="mt-4 grid grid-cols-[125px_1fr] gap-x-3 gap-y-3 text-sm">
          <dt className="text-[#667068]">Sample rental</dt><dd className="font-semibold text-[#252925]">{rental.name}</dd>
          <dt className="text-[#667068]">Sample rental ID</dt><dd className="font-semibold text-[#252925]">{rental.id}</dd>
          <dt className="text-[#667068]">Status</dt><dd className="font-semibold text-[#252925]">{rental.status}</dd>
          <dt className="text-[#667068]">Rental term</dt><dd className="font-semibold text-[#252925]">{rental.durationMonths} months</dd>
        </dl>
        <button type="button" onClick={onClose} className="mt-5 min-h-11 w-full rounded-xl bg-[#017f36] px-4 text-sm font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Close Preview</button>
      </section>
    </div>
  );
}

export default function AccountRentalsPreviewScreen({ rentals }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState(null);
  const counts = useMemo(() => ({
    all: rentals.length,
    active: rentals.filter((rental) => rental.statusKey === "active").length,
    endingSoon: rentals.filter((rental) => rental.statusKey === "ending-soon").length,
  }), [rentals]);
  const totals = useMemo(() => ({
    remainingMonths: rentals.reduce((sum, rental) => sum + rental.remainingMonths, 0),
    due: rentals.reduce((sum, rental) => sum + rental.monthlyRent, 0),
    deposit: rentals.reduce((sum, rental) => sum + rental.securityDeposit, 0),
  }), [rentals]);
  const visibleRentals = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rentals.filter((rental) => {
      const matchesFilter = filter === "all" || rental.statusKey === filter;
      const matchesSearch = !query || `${rental.name} ${rental.id} ${rental.category}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, rentals, search]);

  return (
    <>
      <div className="hidden xl:block"><AccountWelcomeBanner title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact /></div>
      <RentalsWelcomeHero />
      <main className="account-rentals-main bg-[#f8f7f2] px-3 py-3 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:px-0 xl:py-3 xl:pb-5">
        <section className="account-page-container rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,.045)] sm:p-5 xl:p-4">
          <header className="hidden items-center gap-4 border-b border-[#eceae4] pb-3 xl:flex">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiTruck aria-hidden="true" className="size-7" /></span>
            <div><h1 className="text-[28px] font-bold leading-tight text-[#252925]">My Rentals</h1><p className="mt-1 text-base text-[#59635c]">Manage your active rentals, renewals, payments, and service requests.</p></div>
          </header>

          <div className="hidden grid-cols-2 gap-3 pt-3 xl:grid 2xl:grid-cols-4">
            <SummaryCard icon={FiCalendar} value={counts.active} label="Active Rentals" />
            <SummaryCard icon={FiClock} value={`${totals.remainingMonths} Months`} label="Total Remaining" tone="amber" />
            <SummaryCard icon={FiCreditCard} value={formatINR(totals.due)} label="Next Due (Total)" />
            <SummaryCard icon={FiShield} value={formatINR(totals.deposit)} label="Security Deposit (Total)" tone="amber" />
          </div>

          <div className="mt-2 flex flex-col gap-3 border-b border-[#eceae4] pb-3 sm:mt-3 sm:flex-row sm:items-center sm:justify-between xl:mt-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sample rentals">
              {filters.map((item) => {
                const count = item.id === "all" ? counts.all : item.id === "active" ? counts.active : counts.endingSoon;
                return <button key={item.id} type="button" onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={`min-h-10 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:px-4 sm:text-sm ${filter === item.id ? "border-[#00643c] bg-[#08763b] text-white shadow-sm" : "border-[#d8d9d3] bg-white text-[#252925] hover:border-[#9ab7a2] hover:bg-[#f7faf5]"}`}>{item.label} ({count})</button>;
              })}
            </div>
            <label className="flex min-h-10 w-full items-center gap-2 rounded-xl border border-[#d8dad4] bg-white px-3 text-[#124734] focus-within:border-[#7fa88d] focus-within:ring-2 focus-within:ring-[#017f36]/15 sm:max-w-[340px] xl:min-h-10">
              <FiSearch aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">Search sample rentals</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your rentals..." className="min-w-0 flex-1 bg-transparent text-sm text-[#252925] outline-none placeholder:text-[#858a84]" />
            </label>
          </div>

          <p role="note" className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#cfe3d1] bg-[#eff7ed] px-3 py-2 text-xs text-[#124734]">
            <span className="size-2 shrink-0 rounded-full bg-[#017f36]" /><strong>Sample Rentals — UI Preview</strong><span className="text-[#59635c]">· fictional records, local development only</span>
          </p>

          <div className="mt-3 grid gap-3 sm:gap-3.5">
            {visibleRentals.map((rental) => <RentalCard key={rental.id} rental={rental} onAction={(selectedRental, action) => setSelection({ rental: selectedRental, action })} />)}
            {!visibleRentals.length && <p className="rounded-xl border border-dashed border-[#d8dad4] bg-[#fafbf8] px-4 py-8 text-center text-sm text-[#667068]">No sample rentals match this filter or search.</p>}
          </div>

          <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eceae4] pt-3">
            <p className="text-[11px] leading-5 text-[#69736b]">Illustrative sample records. No real customer rental data is connected.</p>
            <Link href="/account/rentals" className="inline-flex min-h-10 items-center rounded-lg px-3 text-xs font-semibold text-[#124734] underline decoration-[#9ab6a3] underline-offset-4 hover:text-[#017f36] focus-visible:outline-2 focus-visible:outline-[#017f36]">Exit preview and return to My Rentals</Link>
          </footer>
        </section>
      </main>
      <RentalPreviewDialog selection={selection} onClose={() => setSelection(null)} />
    </>
  );
}
