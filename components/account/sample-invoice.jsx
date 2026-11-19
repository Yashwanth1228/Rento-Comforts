"use client";

import Image from "next/image";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiCreditCard, FiExternalLink, FiFileText, FiInfo, FiUser } from "react-icons/fi";
import "./sample-invoice.css";

const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const date = (value) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));

export default function SampleInvoice({ record, onBack, onDetails }) {
  const summary = [["Order / Rental ID", record.relatedId], ["Invoice Number", record.invoiceId], ["Transaction ID", record.id], ["Invoice Date", date(record.date)], ["Payment Status", record.status], ["Amount Paid", money(record.amount)]];
  return <div className="sample-invoice">
    <nav aria-label="Breadcrumb" className="sample-invoice-breadcrumb"><button type="button" onClick={onBack}>Payments &amp; Invoices</button><span aria-hidden="true">›</span><span>View Invoice</span></nav>
    <div className="sample-invoice-top"><div className="sample-invoice-heading"><button type="button" onClick={onBack} aria-label="Back to Payments"><FiArrowLeft aria-hidden="true" /></button><span><FiFileText aria-hidden="true" /></span><div><h1>View Invoice</h1><p>Invoice details and payment information for your transaction.</p></div></div><aside className="sample-invoice-warning"><FiInfo aria-hidden="true" /><div><strong>Sample Invoice — UI Preview</strong><p>This is a fictional invoice for design and development only, not a real billing document.</p></div></aside></div>
    <div className="sample-invoice-layout">
      <article className="sample-invoice-document" aria-label={`Sample invoice ${record.invoiceId}`}>
        <header className="sample-invoice-document-head"><Image src="/brand/rento-comforts.jpeg" width={180} height={70} alt="Rento Comforts" className="sample-invoice-logo" /><div><h2>Sample Invoice</h2><p>Invoice No: {record.invoiceId}</p><p>Invoice Date: {date(record.date)}</p></div><span className="sample-invoice-badge"><FiCheckCircle aria-hidden="true" /> {record.status}</span></header>
        <div className="sample-invoice-parties"><section><h3><FiUser aria-hidden="true" /> Billed To</h3><p><strong>Sample Customer</strong><br />Fictional details for UI preview</p></section><section><h3><FiCreditCard aria-hidden="true" /> Payment Details</h3><dl><div><dt>Transaction ID</dt><dd>{record.id}</dd></div><div><dt>Payment date</dt><dd>{date(record.date)}</dd></div><div><dt>Status</dt><dd>{record.status}</dd></div></dl></section></div>
        <div className="sample-invoice-item"><div className="sample-invoice-item-heading"><span>Item &amp; Description</span><span>Qty</span><span>Amount</span></div><div className="sample-invoice-item-row"><div>{record.image && <Image src={record.image} width={68} height={52} alt="" />}<span><strong>{record.product}</strong><small>{record.type}</small></span></div><span>1</span><strong>{money(record.amount)}</strong></div></div>
        <div className="sample-invoice-totals-row">{record.rentalPeriod && <div className="sample-invoice-period"><FiCalendar aria-hidden="true" /><p><strong>Rental Period</strong><br />{date(record.rentalPeriod.start)} – {date(record.rentalPeriod.end)}</p></div>}<dl className="sample-invoice-totals"><div><dt>Subtotal</dt><dd>{money(record.amount)}</dd></div><div><dt>Tax breakdown</dt><dd>Not provided</dd></div><div><dt>Total Paid</dt><dd>{money(record.amount)}</dd></div></dl></div>
        <p className="sample-invoice-tax-note">Tax treatment is not specified in this sample.</p>
        <footer className="sample-invoice-footer"><span>Thank you!</span> for choosing Rento Comforts.</footer>
      </article>
      <aside className="sample-invoice-side"><section className="sample-invoice-summary"><h2><FiFileText aria-hidden="true" /> Invoice Summary</h2><dl>{summary.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section><div className="sample-invoice-development"><FiInfo aria-hidden="true" /><p><strong>Development Preview</strong><br />This sample is for UI design and testing only. No real invoice has been issued.</p></div><button type="button" className="sample-invoice-back" onClick={onBack}><FiArrowLeft aria-hidden="true" /> Back to Payments</button><button type="button" className="sample-invoice-details" onClick={onDetails}><FiExternalLink aria-hidden="true" /> View Transaction Details</button></aside>
    </div>
  </div>;
}
