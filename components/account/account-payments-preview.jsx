"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiCheckCircle, FiClock, FiCreditCard, FiFileText, FiSearch, FiShield, FiX, FiXCircle } from "react-icons/fi";
import AccountPageContainer from "@/components/account/account-page-container";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import SampleInvoice from "@/components/account/sample-invoice";
import PaymentDetailsDrawer from "@/components/account/payment-details-drawer";
import "./account-payments-preview.css";

const styles = Object.fromEntries([
  "panel", "heading", "previewNotice", "summaryGrid", "summaryCard", "paid", "due", "invoice", "deposit", "summaryIcon", "summaryText", "cardAccent", "toolbar", "filters", "search", "listHeading", "tableWrap", "table", "transaction", "recordIcon", "amount", "status", "upcoming", "actions", "noResults", "exit", "dialog", "dialogHead", "dialogLabel", "dialogClose", "accountMessage",
].map((name) => [name, `payment-preview-${name}`]));

const formatMoney = (value) => `₹${value.toLocaleString("en-IN")}`;
const formatDate = (date) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const matchesFilter = (record, filter) => filter === "All Activity" || (filter === "Payments" && record.category === "payment") || (filter === "Invoices" && Boolean(record.invoiceId)) || (filter === "Refunds & Deposits" && ["refund", "deposit"].includes(record.category));

function PreviewDialog({ action, close }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="payment-dialog-title" onCancel={(event) => { event.preventDefault(); close(); }}>
      <div className={styles.dialogHead}><div><p className={styles.dialogLabel}>Sample Payments — UI Preview</p><h2 id="payment-dialog-title">{action}</h2></div><button type="button" aria-label="Close preview" onClick={close}><FiX aria-hidden="true" /></button></div>
      <p>This is a fictional development preview. {action === "View Invoice" ? "Invoice viewing is not connected and no document has been issued or downloaded." : "Transaction details are not connected."}</p>
      <button type="button" className={styles.dialogClose} onClick={close}>Close</button>
    </dialog>
  );
}

function SummaryCard({ label, value, note, tone, Icon }) {
  return <article className={`${styles.summaryCard} ${styles[tone]}`}><span className={styles.summaryIcon}><Icon aria-hidden="true" /></span><div className={styles.summaryText}><h2>{label}</h2><strong>{value}</strong><p>{note}</p></div><span className={styles.cardAccent} aria-hidden="true"><Icon /></span></article>;
}

export default function AccountPaymentsPreview({ records }) {
  const [pageState, setPageState] = useState("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [fullName, setFullName] = useState("");
  const [filter, setFilter] = useState("All Activity");
  const [search, setSearch] = useState("");
  const [action, setAction] = useState(null);
  const [duePaymentId, setDuePaymentId] = useState(null);
  const dueTriggerRef = useRef(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    let current = true;
    async function verify() {
      try {
        const [profile, status] = await Promise.all([
          fetch("/api/account/profile", { method: "GET", cache: "no-store", credentials: "same-origin", headers: { Accept: "application/json" } }),
          fetch("/api/account/onboarding-status", { method: "GET", cache: "no-store", credentials: "same-origin", headers: { Accept: "application/json" } }),
        ]);
        const [profileData, statusData] = await Promise.all([profile.json().catch(() => null), status.json().catch(() => null)]);
        if (!current) return;
        if (profile.status === 401 || status.status === 401 || statusData?.authenticated === false) setPageState("signed-out");
        else if (profile.status === 404 || statusData?.profileFound === false) setPageState("missing-profile");
        else if (!profile.ok || !status.ok || profileData?.ok !== true || !profileData.profile || statusData?.authenticated !== true || statusData?.profileFound !== true) setPageState("error");
        else { setFullName(typeof profileData.profile.full_name === "string" ? profileData.profile.full_name : ""); setPageState("ready"); }
      } catch { if (current) setPageState("error"); }
    }
    verify();
    return () => { current = false; };
  }, [retryKey]);

  const totalPaid = records.filter((item) => item.category === "payment" && item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const upcoming = records.filter((item) => item.category === "payment" && item.status === "Upcoming").reduce((sum, item) => sum + item.amount, 0);
  const heldDeposits = records.filter((item) => item.category === "deposit" && item.status === "Held").reduce((sum, item) => sum + item.amount, 0);
  const invoices = records.filter((item) => item.invoiceId).length;
  const filters = ["All Activity", "Payments", "Invoices", "Refunds & Deposits"];
  const query = search.trim().toLowerCase();
  const visible = records.filter((item) => matchesFilter(item, filter) && [item.product, item.id, item.invoiceId, item.relatedId, item.reference].some((value) => value?.toLowerCase().includes(query)));
  const selectedInvoice = records.find((item) => item.invoiceId && item.invoiceId === invoiceId);
  const selectedPayment = records.find((item) => item.id === duePaymentId && ["Upcoming", "Failed"].includes(item.status) && item.category === "payment");

  async function handleDownload(selectedId) {
    if (process.env.NODE_ENV !== "development" || downloadingId) return;
    setDownloadError("");
    setDownloadingId(selectedId);
    try {
      const { downloadSampleInvoice } = await import("@/lib/sample-invoice-pdf.preview");
      await downloadSampleInvoice(selectedId, records);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "The sample PDF could not be generated. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  return <>
    <div className="hidden xl:block"><AccountWelcomeBanner fullName={fullName} title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact /></div>
    <main className="bg-[#f8f7f2] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-8 lg:px-10 xl:px-0 xl:py-4">
      <AccountPageContainer className={styles.panel}>
        {!selectedInvoice && <header className={styles.heading}><span><FiCreditCard aria-hidden="true" /></span><div><h1>Payments &amp; Invoices</h1><p>Track your rental payments, invoices, receipts, and deposit refunds in one place.</p></div></header>}
        {pageState === "loading" ? <p role="status">Checking your account...</p> : pageState !== "ready" ? <section className={styles.accountMessage}><h2>{pageState === "signed-out" ? "Sign in to view your account" : pageState === "missing-profile" ? "Account profile not available" : "Account information unavailable"}</h2><p>{pageState === "signed-out" ? "Your session may have expired. Sign in using the Login control in the site header, then return here." : pageState === "missing-profile" ? "We could not find a customer profile for this account." : "We could not verify your account right now. Check your connection and try again."}</p>{pageState === "signed-out" ? <Link href="/">Go to the home page</Link> : <button type="button" onClick={() => { setPageState("loading"); setRetryKey((n) => n + 1); }}>Retry</button>}</section> : selectedInvoice ? <SampleInvoice record={selectedInvoice} onBack={() => { setInvoiceId(null); setDownloadError(""); }} onDownload={() => handleDownload(selectedInvoice.invoiceId)} downloading={Boolean(downloadingId)} downloadError={downloadError} /> : <>
          <p className={styles.previewNotice}>Sample Payments — UI Preview · Fictional records, local development only</p>
          {downloadError && <p role="alert" className="payment-preview-download-error">{downloadError}</p>}
          <div className={styles.summaryGrid}>
            <SummaryCard label="Total Paid" value={formatMoney(totalPaid)} note="Completed payments" tone="paid" Icon={FiCreditCard} />
            <SummaryCard label="Upcoming Due" value={formatMoney(upcoming)} note="Scheduled payments" tone="due" Icon={FiCalendar} />
            <SummaryCard label="Invoices" value={invoices} note="Documents available" tone="invoice" Icon={FiFileText} />
            <SummaryCard label="Security Deposits" value={formatMoney(heldDeposits)} note="Refundable balance held" tone="deposit" Icon={FiShield} />
          </div>
          <div className={styles.toolbar}><div role="group" aria-label="Filter activity" className={styles.filters}>{filters.map((name) => <button type="button" key={name} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name} ({records.filter((item) => matchesFilter(item, name)).length})</button>)}</div><label className={styles.search}><FiSearch aria-hidden="true" /><span className="sr-only">Search transactions</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transactions, invoices..." /></label></div>
          <h2 className={styles.listHeading}>Transaction History</h2>
          <div className={styles.tableWrap}><table className={styles.table}><caption className="sr-only">Sample financial activity</caption><thead><tr><th>Transaction</th><th>Type</th><th>Date</th><th>Amount</th><th>Status</th><th>Invoice / Receipt</th><th>Actions</th></tr></thead><tbody>{visible.map((record) => <tr key={record.id}>
            <td data-label="Transaction"><div className={styles.transaction}>{record.image ? <Image src={record.image} width={58} height={48} alt="" /> : <span className={styles.recordIcon}><FiShield aria-hidden="true" /></span>}<div><strong>{record.product}</strong><small>{record.type} · {record.id}<br />{record.relatedId}</small></div></div></td>
            <td data-label="Type">{record.type}</td><td data-label={record.status === "Upcoming" ? "Due date" : "Date"}>{formatDate(record.date)}</td><td data-label="Amount" className={styles.amount}>{formatMoney(record.amount)}</td><td data-label="Status"><span className={`${styles.status} ${record.status === "Upcoming" ? styles.upcoming : record.status === "Failed" ? "payment-preview-failed" : ""}`}>{record.status === "Failed" ? <FiXCircle aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}{record.status}</span></td><td data-label="Invoice / Receipt">{record.invoiceId || record.reference || "—"}</td><td data-label="Actions"><div className={styles.actions}>{record.invoiceId ? <><button type="button" onClick={() => { setDownloadError(""); setInvoiceId(record.invoiceId); }}>View Invoice<span className="sr-only"> for {record.product}</span></button><button type="button" disabled={Boolean(downloadingId)} onClick={() => handleDownload(record.invoiceId)} aria-label={`Download sample invoice for ${record.product}`}>{downloadingId === record.invoiceId ? "Preparing…" : "Download"}</button></> : <button type="button" onClick={(event) => { if (record.category === "payment" && ["Upcoming", "Failed"].includes(record.status)) { dueTriggerRef.current = event.currentTarget; setDuePaymentId(record.id); } else setAction("Details"); }}>Details<span className="sr-only"> for {record.product}</span></button>}</div></td>
          </tr>)}</tbody></table>{visible.length === 0 && <p className={styles.noResults} role="status">No sample activity matches your search and filter.</p>}</div>
          <Link href="/account/payments" className={styles.exit}>Exit preview and return to Payments &amp; Invoices</Link>
        </>}
      </AccountPageContainer>
    </main>
    {action && <PreviewDialog action={action} close={() => setAction(null)} />}
    {selectedPayment && <PaymentDetailsDrawer type={selectedPayment.status === "Failed" ? "failed" : "upcoming"} record={selectedPayment} triggerRef={dueTriggerRef} onClose={() => setDuePaymentId(null)} />}
  </>;
}
