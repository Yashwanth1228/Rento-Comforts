"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiInfo,
  FiFileText,
  FiRotateCcw,
  FiSearch,
  FiShield,
  FiTool,
  FiTruck,
  FiX,
  FiChevronDown,
  FiUploadCloud,
  FiTrash2,
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
    <span className={`rental-preview-status inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm ${ending ? "bg-[#fff0d1] text-[#845000]" : "bg-[#e3f4e2] text-[#12612e]"}`}>
      {ending ? <FiClock aria-hidden="true" className="size-4" /> : <FiCheckCircle aria-hidden="true" className="size-4" />}
      {rental.status}
    </span>
  );
}

function RentalActionButton({ action, onClick }) {
  const { Icon, label, tone } = action;
  return (
    <button type="button" onClick={(event) => onClick(event.currentTarget)} className={`rental-preview-action ${tone === "primary" ? "rental-preview-action--primary" : "rental-preview-action--secondary"}`}>
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
        {actionItems.map((action) => <RentalActionButton key={action.label} action={action} onClick={(trigger) => onAction(rental, action.label, trigger)} />)}
      </div>

      <div className="rental-preview-card__remaining-mobile">
        <div><span>Remaining Term:</span><strong>{rental.remainingMonths} Months <span>(Till {rental.endDate})</span></strong></div>
        <div className="rental-preview-card__progress"><span style={{ width: `${remainingPercent}%` }} /></div>
      </div>
    </article>
  );
}

const extensionOptions = [3, 6, 12];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const subscribeClientMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

function addCalendarMonths(dateLabel, monthCount) {
  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(dateLabel);
  if (!match) return dateLabel;

  const day = Number(match[1]);
  const month = monthNames.indexOf(match[2]);
  const year = Number(match[3]);
  if (month < 0 || !Number.isInteger(day) || day < 1 || !Number.isInteger(year)) return dateLabel;

  const target = new Date(Date.UTC(year, month + monthCount, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  const adjustedDay = Math.min(day, lastDay);
  return `${String(adjustedDay).padStart(2, "0")} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()}`;
}

function RentalPreviewDialog({ selection, onClose, triggerRef }) {
  useEffect(() => {
    if (!selection) return undefined;
    const handleKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selection, onClose]);

  if (!selection) return null;
  if (selection.action === "Extend Rental") {
    return <ExtendRentalDialog key={selection.rental.id} rental={selection.rental} onClose={onClose} triggerRef={triggerRef} />;
  }
  if (selection.action === "Request Return") {
    return <RequestReturnDialog key={selection.rental.id} rental={selection.rental} onClose={onClose} />;
  }
  if (selection.action === "Maintenance Request") {
    return <MaintenanceRequestDialog key={selection.rental.id} rental={selection.rental} onClose={onClose} triggerRef={triggerRef} />;
  }

  const { rental, action } = selection;
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#10271d]/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="rental-preview-dialog-title" className="w-full max-w-md rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-2xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#688170]">Sample Rentals — UI Preview</p><h2 id="rental-preview-dialog-title" className="mt-1 text-xl font-bold text-[#124734]">{action}</h2></div>
          <button type="button" onClick={onClose} aria-label="Close sample rental preview" className="grid size-9 shrink-0 place-items-center rounded-full text-[#46534a] hover:bg-[#f2f5f0] focus-visible:outline-2 focus-visible:outline-[#017f36]"><FiX aria-hidden="true" /></button>
        </header>
        <p className="mt-3 rounded-lg bg-[#f4f7f2] px-3 py-2 text-xs leading-5 text-[#44554a]">This is fictional development data. No real rental will be extended, returned, serviced, or changed.</p>
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

function localDateInputValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function ReturnRentalSummary({ rental }) {
  return (
    <section className="rental-return-summary" aria-label="Selected rental">
      <div className="rental-return-summary__product">
        <div className="rental-return-summary__image"><Image src={rental.image} alt={`${rental.name}, sample rental`} fill sizes="(max-width: 767px) 64px, 72px" className="object-cover" /></div>
        <div className="rental-return-summary__heading"><h3>{rental.name}</h3><p>Rental ID: {rental.id}</p></div>
        <RentalStatus rental={rental} />
      </div>
      <div className="rental-return-summary__facts">
        <div><FiCalendar aria-hidden="true" /><span><small>Rental Started</small><strong>{rental.startDate}</strong></span></div>
        <div><FiCalendar aria-hidden="true" /><span><small>Current End Date</small><strong>{rental.endDate}</strong></span></div>
        <div><FiClock aria-hidden="true" /><span><small>Rental Duration</small><strong>{rental.durationMonths} months</strong></span></div>
      </div>
    </section>
  );
}

function RequestReturnDialog({ rental, onClose }) {
  const dialogRef = useRef(null);
  const mounted = useSyncExternalStore(subscribeClientMount, getClientMountSnapshot, getServerMountSnapshot);
  const [pickupDate, setPickupDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const minimumDate = localDateInputValue();

  useEffect(() => {
    if (!mounted) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.focus();

    function trapFocus(event) {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    window.addEventListener("keydown", trapFocus);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", trapFocus); };
  }, [mounted]);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!pickupDate) nextErrors.pickupDate = "Choose a preferred pickup date.";
    else if (pickupDate < minimumDate) nextErrors.pickupDate = "Choose today or a future date.";
    if (!reason) nextErrors.reason = "Choose a reason for return.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setShowConfirmation(true);
  }

  if (!mounted) return null;

  return createPortal((
    <div className="rental-extension-backdrop rental-return-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="rental-return-title" aria-describedby="rental-return-safety" className="rental-return-dialog">
        <div className="rental-extension-sheet-handle" aria-hidden="true"><span /></div>
        <header className="rental-return-header">
          <div className="rental-return-heading-icon"><FiRotateCcw aria-hidden="true" /></div>
          <div className="rental-return-heading-copy"><p className="rental-extension-sample-label">Sample Rentals — UI Preview</p><h2 id="rental-return-title">Request Return</h2><p>Schedule a pickup to return your rented item.</p></div>
          <button type="button" onClick={onClose} aria-label="Close Request Return preview" className="rental-extension-close"><FiX aria-hidden="true" /></button>
        </header>
        <p id="rental-return-safety" className="rental-extension-safety"><FiInfo aria-hidden="true" /><span>Fictional development data only. This date is a preference, not a confirmed pickup. No return request will be sent.</span></p>
        <ReturnRentalSummary rental={rental} />
        {showConfirmation ? (
          <section className="rental-return-confirmation" role="status" aria-live="polite">
            <h3><FiCheckCircle aria-hidden="true" /> Sample return preview</h3>
            <p>No request was submitted and the sample rental remains unchanged. Your entered details are shown for review only.</p>
            <dl><div><dt>Preferred pickup date</dt><dd>{pickupDate}</dd></div><div><dt>Reason</dt><dd>{reason}</dd></div>{notes.trim() && <div><dt>Additional notes</dt><dd>{notes.trim()}</dd></div>}</dl>
            <div className="rental-return-actions"><button type="button" onClick={() => setShowConfirmation(false)} className="rental-extension-button rental-extension-button--secondary">Edit Details</button><button type="button" onClick={onClose} className="rental-extension-button rental-extension-button--primary">Close Preview</button></div>
          </section>
        ) : (
          <form className="rental-return-form" onSubmit={handleSubmit} noValidate>
            <div className="rental-return-field">
              <label htmlFor="return-pickup-date">Preferred Pickup Date <span aria-hidden="true">*</span></label>
              <div className={`rental-return-date-wrap${pickupDate ? " has-value" : ""}`}><FiCalendar aria-hidden="true" className="rental-return-date-leading" /><span className="rental-return-date-placeholder" aria-hidden="true">Select pickup date</span><input id="return-pickup-date" type="date" min={minimumDate} value={pickupDate} onChange={(event) => { setPickupDate(event.target.value); setErrors((previous) => ({ ...previous, pickupDate: "" })); }} aria-invalid={Boolean(errors.pickupDate)} aria-describedby={errors.pickupDate ? "return-pickup-error" : undefined} /><FiCalendar aria-hidden="true" className="rental-return-date-trailing" /></div>
              {errors.pickupDate && <small id="return-pickup-error" className="rental-return-error" role="alert">{errors.pickupDate}</small>}
            </div>
            <div className="rental-return-field">
              <label htmlFor="return-reason">Reason for Return <span aria-hidden="true">*</span></label>
              <div className="rental-return-select-wrap"><select id="return-reason" value={reason} onChange={(event) => { setReason(event.target.value); setErrors((previous) => ({ ...previous, reason: "" })); }} aria-invalid={Boolean(errors.reason)} aria-describedby={errors.reason ? "return-reason-error" : undefined}><option value="">Select a reason</option><option>Rental period completed</option><option>No longer required</option><option>Relocating</option><option>Product-related issue</option><option>Other</option></select><FiChevronDown aria-hidden="true" /></div>
              {errors.reason && <small id="return-reason-error" className="rental-return-error" role="alert">{errors.reason}</small>}
            </div>
            <div className="rental-return-field">
              <label htmlFor="return-notes">Additional Notes (Optional)</label>
              <textarea id="return-notes" maxLength={250} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="e.g., Moving to a new location, no longer needed, etc." />
              <small className="rental-return-counter" aria-live="polite">{notes.length} / 250</small>
            </div>
            <footer className="rental-return-actions"><button type="button" onClick={onClose} className="rental-extension-button rental-extension-button--secondary">Cancel</button><button type="submit" className="rental-extension-button rental-extension-button--primary">Request Return</button></footer>
          </form>
        )}
      </section>
    </div>
  ), document.body);
}

function MaintenanceRentalSummary({ rental }) {
  return (
    <section className="rental-maintenance-summary" aria-label="Selected rental">
      <div className="rental-maintenance-summary__product">
        <div className="rental-maintenance-summary__image"><Image src={rental.image} alt={`${rental.name}, sample rental`} fill sizes="(max-width: 767px) 92px, 112px" className="object-cover" /></div>
        <div className="rental-maintenance-summary__heading"><h3>{rental.name}</h3><p>Rental ID: {rental.id}</p></div>
        <RentalStatus rental={rental} />
      </div>
      <div className="rental-maintenance-summary__facts">
        <div><FiCalendar aria-hidden="true" /><span><small>Rental Started</small><strong>{rental.startDate}</strong></span></div>
        <div><FiCalendar aria-hidden="true" /><span><small>Current End Date</small><strong>{rental.endDate}</strong></span></div>
        <div><FiClock aria-hidden="true" /><span><small>Rental Term</small><strong>{rental.durationMonths} Months</strong></span></div>
      </div>
    </section>
  );
}

function maintenanceIssueOptions(category = "") {
  const normalized = category.toLowerCase();
  if (normalized.includes("furniture")) return ["Furniture repair", "Damaged or broken part", "Product not working", "Installation or fitting issue", "Other"];
  if (normalized.includes("appliance")) return ["Appliance malfunction", "Product not working", "Damaged or broken part", "Installation or fitting issue", "Other"];
  return ["Product not working", "Damaged or broken part", "Furniture repair", "Appliance malfunction", "Installation or fitting issue", "Other"];
}

function MaintenanceRequestDialog({ rental, onClose, triggerRef }) {
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef(new Set());
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const minimumDate = localDateInputValue();
  const issues = maintenanceIssueOptions(rental.category);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const photoUrls = previewUrlsRef.current;
    const triggerElement = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.focus();
    function trapFocus(event) {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", trapFocus);
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
      photoUrls.clear();
      if (triggerElement?.isConnected) triggerElement.focus();
    };
  }, [triggerRef]);

  function handleFiles(event) {
    const incoming = [...(event.target.files || [])];
    event.target.value = "";
    const nextErrors = {};
    const accepted = [];
    const availableSlots = Math.max(0, 3 - photos.length);
    incoming.forEach((file) => {
      if (!(["image/jpeg", "image/png"].includes(file.type))) nextErrors.photos = "Only JPG and PNG images are allowed.";
      else if (file.size > 5 * 1024 * 1024) nextErrors.photos = "Each image must be 5 MB or smaller.";
      else if (accepted.length < availableSlots) accepted.push(file);
      else nextErrors.photos = "You can add up to 3 images.";
    });
    const added = accepted.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.add(url);
      return { file, url };
    });
    if (incoming.length > availableSlots && !nextErrors.photos) nextErrors.photos = "You can add up to 3 images.";
    setPhotos((current) => [...current, ...added]);
    setErrors((current) => ({ ...current, photos: nextErrors.photos || "" }));
  }

  function removePhoto(url) {
    URL.revokeObjectURL(url);
    previewUrlsRef.current.delete(url);
    setPhotos((current) => current.filter((photo) => photo.url !== url));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!issueType) nextErrors.issueType = "Select an issue type.";
    if (!description.trim()) nextErrors.description = "Describe the issue before continuing.";
    if (description.length > 500) nextErrors.description = "Keep the description within 500 characters.";
    if (!serviceDate) nextErrors.serviceDate = "Choose a preferred service date.";
    else if (serviceDate < minimumDate) nextErrors.serviceDate = "Choose today or a future date.";
    setErrors((current) => ({ ...current, ...nextErrors }));
    if (!Object.keys(nextErrors).length) setPreview(true);
  }

  return createPortal((
    <div className="rental-extension-backdrop rental-maintenance-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="rental-maintenance-title" aria-describedby="rental-maintenance-safety" className="rental-maintenance-dialog">
        <div className="rental-extension-sheet-handle" aria-hidden="true"><span /></div>
        <header className="rental-maintenance-header">
          <div className="rental-maintenance-heading-icon"><FiTool aria-hidden="true" /></div>
          <div className="rental-maintenance-heading-copy"><p className="rental-extension-sample-label">Sample Rentals — UI Preview</p><h2 id="rental-maintenance-title">Maintenance Request</h2><p>Raise a service request for your rented item.</p></div>
          <button type="button" onClick={onClose} aria-label="Close Maintenance Request preview" className="rental-extension-close"><FiX aria-hidden="true" /></button>
        </header>
        <p id="rental-maintenance-safety" className="rental-extension-safety"><FiInfo aria-hidden="true" /><span>Fictional development data only. No real maintenance ticket will be created.</span></p>
        <MaintenanceRentalSummary rental={rental} />
        {preview ? (
          <section className="rental-maintenance-preview" role="status" aria-live="polite">
            <h3><FiCheckCircle aria-hidden="true" /> Sample request preview</h3>
            <p>No ticket was created and the sample rental is unchanged. Review the information below; nothing was uploaded or sent.</p>
            <dl><div><dt>Issue type</dt><dd>{issueType}</dd></div><div><dt>Issue description</dt><dd>{description.trim()}</dd></div><div><dt>Preferred service date</dt><dd>{serviceDate}</dd></div><div><dt>Photos selected</dt><dd>{photos.length ? photos.map(({ file }) => file.name).join(", ") : "None"}</dd></div></dl>
            <div className="rental-maintenance-actions"><button type="button" onClick={() => setPreview(false)} className="rental-extension-button rental-extension-button--secondary">Edit Details</button><button type="button" onClick={onClose} className="rental-extension-button rental-extension-button--primary">Close Preview</button></div>
          </section>
        ) : (
          <form className="rental-maintenance-form" onSubmit={handleSubmit} noValidate>
            <div className="rental-maintenance-field">
              <label htmlFor="maintenance-issue">Issue Type <span aria-hidden="true" className="rental-maintenance-required">*</span></label>
              <div className="rental-maintenance-select-wrap"><FiTool aria-hidden="true" className="rental-maintenance-select-icon" /><select id="maintenance-issue" value={issueType} onChange={(event) => { setIssueType(event.target.value); setErrors((current) => ({ ...current, issueType: "" })); }} aria-invalid={Boolean(errors.issueType)} aria-describedby={errors.issueType ? "maintenance-issue-error" : undefined}><option value="">Select issue type</option>{issues.map((issue) => <option key={issue}>{issue}</option>)}</select><FiChevronDown aria-hidden="true" /></div>
              {errors.issueType && <small id="maintenance-issue-error" className="rental-maintenance-error" role="alert">{errors.issueType}</small>}
            </div>
            <div className="rental-maintenance-field">
              <label htmlFor="maintenance-description">Describe the Issue <span aria-hidden="true" className="rental-maintenance-required">*</span></label>
              <textarea id="maintenance-description" maxLength={500} value={description} onChange={(event) => { setDescription(event.target.value); setErrors((current) => ({ ...current, description: "" })); }} placeholder="e.g., Not working, loose leg, fabric tear, cleaning, etc." aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "maintenance-description-error maintenance-description-count" : "maintenance-description-count"} />
              <small id="maintenance-description-count" className="rental-maintenance-counter" aria-live="polite">{description.length} / 500</small>
              {errors.description && <small id="maintenance-description-error" className="rental-maintenance-error" role="alert">{errors.description}</small>}
            </div>
            <div className="rental-maintenance-field">
              <label htmlFor="maintenance-photos">Add Photos <span>(Optional)</span></label>
              <input ref={fileInputRef} id="maintenance-photos" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple onChange={handleFiles} className="rental-maintenance-file-input" aria-describedby={errors.photos ? "maintenance-photo-help maintenance-photo-error" : "maintenance-photo-help"} />
              <button type="button" className="rental-maintenance-upload" onClick={() => fileInputRef.current?.click()} aria-label="Choose up to three JPG or PNG photos">
                <FiUploadCloud aria-hidden="true" /><span><strong>{photos.length ? "Add more photos, or browse" : "Click to browse or choose photos"}</strong><small id="maintenance-photo-help">JPG or PNG, up to 5 MB each (maximum 3 photos)</small></span>
              </button>
              {errors.photos && <small id="maintenance-photo-error" className="rental-maintenance-error" role="alert">{errors.photos}</small>}
              {!!photos.length && <div className="rental-maintenance-photos" aria-label="Selected photos">{photos.map(({ file, url }) => <figure key={url}><Image src={url} alt={`Selected preview: ${file.name}`} width={82} height={68} unoptimized /><figcaption>{file.name}</figcaption><button type="button" onClick={() => removePhoto(url)} aria-label={`Remove ${file.name}`}><FiTrash2 aria-hidden="true" /></button></figure>)}</div>}
            </div>
            <div className="rental-maintenance-field">
              <label htmlFor="maintenance-service-date">Preferred Service Date <span aria-hidden="true" className="rental-maintenance-required">*</span></label>
              <div className={`rental-maintenance-date-wrap${serviceDate ? " has-value" : ""}`}><FiCalendar aria-hidden="true" /><input id="maintenance-service-date" type="date" min={minimumDate} value={serviceDate} onChange={(event) => { setServiceDate(event.target.value); setErrors((current) => ({ ...current, serviceDate: "" })); }} aria-invalid={Boolean(errors.serviceDate)} aria-describedby={errors.serviceDate ? "maintenance-date-error" : "maintenance-date-note"} /><span>Select preferred date</span></div>
              <small id="maintenance-date-note" className="rental-maintenance-note">This is a preferred date only, not a confirmed appointment.</small>
              {errors.serviceDate && <small id="maintenance-date-error" className="rental-maintenance-error" role="alert">{errors.serviceDate}</small>}
            </div>
            <footer className="rental-maintenance-actions"><button type="button" onClick={onClose} className="rental-extension-button rental-extension-button--secondary">Cancel</button><button type="submit" className="rental-extension-button rental-extension-button--primary">Submit Request</button></footer>
          </form>
        )}
      </section>
    </div>
  ), document.body);
}

function ExtensionFact({ icon: Icon, label, value }) {
  return (
    <div className="rental-extension-fact">
      <Icon aria-hidden="true" />
      <span><small>{label}</small><strong>{value}</strong></span>
    </div>
  );
}

function ExtendRentalDialog({ rental, onClose, triggerRef }) {
  const dialogRef = useRef(null);
  const [extensionMonths, setExtensionMonths] = useState(6);
  const [showSummary, setShowSummary] = useState(false);
  const newEndDate = addCalendarMonths(rental.endDate, extensionMonths);
  const estimate = rental.monthlyRent * extensionMonths;

  useEffect(() => {
    const dialog = dialogRef.current;
    const triggerElement = triggerRef.current;
    if (!dialog) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.focus();

    function trapFocus(event) {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", trapFocus);
      if (triggerElement?.isConnected) triggerElement.focus();
    };
  }, [triggerRef]);

  return (
    <div className="rental-extension-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="rental-extension-title" aria-describedby="rental-extension-safety" className="rental-extension-dialog">
        <div className="rental-extension-sheet-handle" aria-hidden="true"><span /></div>
        <header className="rental-extension-header">
          <div>
            <p className="rental-extension-sample-label">Sample Rentals — UI Preview</p>
            <h2 id="rental-extension-title">Extend Rental</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Extend Rental preview" className="rental-extension-close"><FiX aria-hidden="true" /></button>
        </header>

        <p id="rental-extension-safety" className="rental-extension-safety"><FiInfo aria-hidden="true" /><span>This is fictional development data. No real rental will be extended until the backend is connected.</span></p>

        <section className="rental-extension-rental" aria-label="Selected sample rental">
          <div className="rental-extension-product-image">
            <Image src={rental.image} alt={`${rental.name}, sample rental`} fill sizes="(max-width: 767px) 96px, 140px" className="object-cover" />
          </div>
          <div className="rental-extension-product-heading">
            <div><h3>{rental.name}</h3><p>Rental ID: {rental.id}</p></div>
            <RentalStatus rental={rental} />
          </div>
          <div className="rental-extension-facts">
            <ExtensionFact icon={FiCalendar} label="Current Plan" value={`${rental.durationMonths} months`} />
            <ExtensionFact icon={FiCalendar} label="Current End Date" value={rental.endDate} />
            <ExtensionFact icon={FiCreditCard} label="Monthly Rent" value={`${formatINR(rental.monthlyRent)}/month`} />
            <ExtensionFact icon={FiShield} label="Refundable Deposit" value={formatINR(rental.securityDeposit)} />
          </div>
        </section>

        {showSummary ? (
          <section className="rental-extension-complete" role="status" aria-live="polite">
            <h3><FiCheckCircle aria-hidden="true" /> Preview Summary</h3>
            <p>This is an informational preview only. The sample rental has not been changed.</p>
            <dl><div><dt>Selected extension</dt><dd>{extensionMonths} months</dd></div><div><dt>Preview end date</dt><dd>{newEndDate}</dd></div><div><dt>Estimated extension total</dt><dd>{formatINR(estimate)}</dd></div></dl>
            <div className="rental-extension-complete-actions"><button type="button" onClick={() => setShowSummary(false)} className="rental-extension-button rental-extension-button--secondary">Back to Options</button><button type="button" onClick={onClose} className="rental-extension-button rental-extension-button--primary">Close Preview</button></div>
          </section>
        ) : (
          <>
            <fieldset className="rental-extension-options">
              <legend>Choose extension period</legend>
              <div className="rental-extension-options-grid">
                {extensionOptions.map((months) => (
                  <label key={months} className={`rental-extension-option${extensionMonths === months ? " is-selected" : ""}`}>
                    <input type="radio" name="extension-period" value={months} checked={extensionMonths === months} onChange={() => setExtensionMonths(months)} />
                    <span className="rental-extension-radio" aria-hidden="true" />
                    <span className="rental-extension-option-copy"><strong>{months} Months</strong><small>Extend by {months} months</small></span>
                    {months === 6 && <span className="rental-extension-recommended">Recommended</span>}
                  </label>
                ))}
              </div>
            </fieldset>

            <section className="rental-extension-preview" aria-live="polite">
              <h3><FiFileText aria-hidden="true" /> Extension Preview</h3>
              <div className="rental-extension-preview-grid">
                <ExtensionFact icon={FiCalendar} label="New end date" value={newEndDate} />
                <ExtensionFact icon={FiCreditCard} label="Updated monthly rent" value={`${formatINR(rental.monthlyRent)}/month`} />
                <ExtensionFact icon={FiCreditCard} label="Estimated extension total" value={formatINR(estimate)} />
                <ExtensionFact icon={FiShield} label="Refundable deposit (unchanged)" value={formatINR(rental.securityDeposit)} />
              </div>
              <p className="rental-extension-estimate-note">Estimate only. Final extension pricing, fees and deposit rules are not configured.</p>
            </section>

            <footer className="rental-extension-actions">
              <button type="button" onClick={onClose} className="rental-extension-button rental-extension-button--secondary">Cancel</button>
              <button type="button" onClick={() => setShowSummary(true)} className="rental-extension-button rental-extension-button--primary">Continue Preview <FiArrowRight aria-hidden="true" /></button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

export default function AccountRentalsPreviewScreen({ rentals }) {
  const [filter, setFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState(null);
  const extendTriggerRef = useRef(null);
  const closePreview = useCallback(() => setSelection(null), []);

  useEffect(() => {
    if (selection || !extendTriggerRef.current?.isConnected) return;
    extendTriggerRef.current.focus();
    extendTriggerRef.current = null;
  }, [selection]);
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
      <RentalsWelcomeHero populatedPreview />
      <main className="account-rentals-main account-rentals-preview-main bg-[#f8f7f2] px-3 py-3 pb-28 sm:px-7 sm:py-5 md:pb-5 lg:px-0 xl:py-3 xl:pb-5">
        <AccountPageContainer as="section" className="account-rentals-preview-panel rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,.045)] sm:p-5 xl:p-5">
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
            {visibleRentals.map((rental) => <RentalCard key={rental.id} rental={rental} onAction={(selectedRental, action, trigger) => { extendTriggerRef.current = trigger; setSelection({ rental: selectedRental, action }); }} />)}
            {!visibleRentals.length && <p className="rounded-xl border border-dashed border-[#d8dad4] bg-[#fafbf8] px-4 py-8 text-center text-sm text-[#667068]">No sample rentals match this filter or search.</p>}
          </div>

          <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eceae4] pt-3">
            <p className="text-[11px] leading-5 text-[#69736b]">Illustrative sample records. No real customer rental data is connected.</p>
            <Link href="/account/rentals" className="inline-flex min-h-10 items-center rounded-lg px-3 text-xs font-semibold text-[#124734] underline decoration-[#9ab6a3] underline-offset-4 hover:text-[#017f36] focus-visible:outline-2 focus-visible:outline-[#017f36]">Exit preview and return to My Rentals</Link>
          </footer>
        </AccountPageContainer>
      </main>
      <RentalPreviewDialog selection={selection} onClose={closePreview} triggerRef={extendTriggerRef} />
    </>
  );
}
