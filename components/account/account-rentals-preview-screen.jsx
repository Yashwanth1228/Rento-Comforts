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
import AccountPageContainer from "@/components/account/account-page-container";
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
    <button type="button" onClick={onClick} className={`rental-preview-action ${tone === "primary" ? "rental-preview-action--primary" : "rental-preview-action--secondary"}`}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>{label}</span>
      {label === "View Details" && <FiArrowRight aria-hidden="true" className="hidden size-3.5 shrink-0 sm:block" />}
    </button>
  );
}

function RentalCard({ rental, onAction }) {
  const remainingPercent = Math.max(6, Math.min(100, (rental.remainingMonths / rental.durationMonths) * 100));

  return (
    <article className="rental-preview-card">
      <div className="rental-preview-card__image relative overflow-hidden rounded-xl bg-[#f3f1eb]">
        <Image src={rental.image} alt={`${rental.name}, sample rental preview`} fill sizes="(max-width: 639px) 112px, (max-width: 1279px) 150px, 128px" className="object-cover" />
        <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#124734]">Sample</span>
      </div>

      <div className="rental-preview-card__details">
        <h3 className="rental-preview-card__name">{rental.name}</h3>
        <p className="rental-preview-card__id">Rental ID: <span>{rental.id}</span></p>
        <div className="rental-preview-card__plan">
          <RentalStatus rental={rental} />
          <span className="rental-preview-card__plan-label"><FiCalendar aria-hidden="true" />{rental.durationMonths} Months Plan</span>
        </div>
        <div className="rental-preview-card__dates">
          <p><FiCalendar aria-hidden="true" />Started: {rental.startDate}</p>
          <p><FiCalendar aria-hidden="true" />Ends: {rental.endDate}</p>
        </div>
      </div>

      <div className="rental-preview-card__term">
        <RentalStatus rental={rental} />
        <span>{rental.durationMonths}-Month Rental</span>
        <strong>{rental.remainingMonths} Months Remaining</strong>
        <div className="rental-preview-card__progress"><span style={{ width: `${remainingPercent}%` }} /></div>
      </div>

      <div className="rental-preview-card__metrics">
        <div className="rental-preview-card__metric">
          <FiCreditCard aria-hidden="true" />
          <span><small>Monthly Rent</small><strong>{formatINR(rental.monthlyRent)}<span className="rental-preview-card__per-month">/month</span></strong></span>
        </div>
        <div className="rental-preview-card__metric">
          <FiShield aria-hidden="true" />
          <span><small>Security Deposit</small><strong>{formatINR(rental.securityDeposit)}</strong><em>Refundable</em></span>
        </div>
        <div className="rental-preview-card__metric">
          <FiCalendar aria-hidden="true" />
          <span><small>Next Due Date</small><strong>{rental.nextPaymentDate}</strong></span>
        </div>
      </div>

      <div className="rental-preview-card__actions">
        {actionItems.map((action) => <RentalActionButton key={action.label} action={action} onClick={() => onAction(rental, action.label)} />)}
      </div>

      <div className="rental-preview-card__remaining-mobile">
        <div><span>Remaining Term</span><strong>{rental.remainingMonths} Months <span>(until {rental.endDate})</span></strong></div>
        <div className="rental-preview-card__progress"><span style={{ width: `${remainingPercent}%` }} /></div>
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
      <div className="hidden min-[1024px]:block"><AccountWelcomeBanner title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact /></div>
      <RentalsWelcomeHero />
      <main className="account-rentals-main bg-[#f8f7f2] px-3 py-3 pb-28 sm:px-7 sm:py-5 md:pb-5 lg:px-0 xl:py-3 xl:pb-5">
        <AccountPageContainer as="section" className="rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,.045)] sm:p-5 xl:p-5">
          <header className="hidden items-center gap-4 border-b border-[#eceae4] pb-3 min-[1024px]:flex">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiTruck aria-hidden="true" className="size-7" /></span>
            <div><h1 className="text-[28px] font-bold leading-tight text-[#252925]">My Rentals</h1><p className="mt-1 text-base text-[#59635c]">Manage your active rentals, renewals, payments, and service requests.</p></div>
          </header>

          <div className="account-rentals-summary-grid hidden grid-cols-4 gap-2.5 pt-3 xl:grid">
            <SummaryCard icon={FiCalendar} value={counts.active} label="Active Rentals" />
            <SummaryCard icon={FiClock} value={`${totals.remainingMonths} Months`} label="Total Remaining" tone="amber" />
            <SummaryCard icon={FiCreditCard} value={formatINR(totals.due)} label="Next Due (Total)" />
            <SummaryCard icon={FiShield} value={formatINR(totals.deposit)} label="Security Deposit (Total)" tone="amber" />
          </div>

          <div className="account-rentals-preview-controls mt-2 flex flex-col gap-3 border-b border-[#eceae4] pb-3 sm:mt-3 sm:flex-row sm:items-center sm:justify-between xl:mt-3">
            <div className="account-rentals-preview-filter-buttons flex flex-wrap gap-2" role="group" aria-label="Filter sample rentals">
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
        </AccountPageContainer>
      </main>
      <RentalPreviewDialog selection={selection} onClose={() => setSelection(null)} />
    </>
  );
}
