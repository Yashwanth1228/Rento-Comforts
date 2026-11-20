"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiClock, FiCreditCard, FiInfo, FiRefreshCcw, FiRefreshCw, FiTag, FiX, FiXCircle } from "react-icons/fi";
import "./payment-details-drawer.css";

export default function PaymentDetailsDrawer({ type, record, relatedPayment, triggerRef, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [triggerRef]);

  if (!record || !((type === "upcoming" && record.category === "payment" && record.status === "Upcoming") || (type === "failed" && record.category === "payment" && record.status === "Failed") || (type === "refund" && record.category === "refund"))) return null;
  const failed = type === "failed";
  const refund = type === "refund";
  const progressStages = Array.isArray(record.progressStages) ? record.progressStages.filter((stage) => stage && typeof stage.label === "string" && typeof stage.completed === "boolean") : [];
  const dueDate = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${record.date}T00:00:00Z`));
  const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  const facts = refund ? [
    ...(record.reference ? [{ label: "Refund Reference", value: record.reference, Icon: FiTag }] : []),
    ...(record.originalPaymentId ? [{ label: "Original Payment Reference", value: record.originalPaymentId, Icon: FiCreditCard }] : []),
    ...(record.refundMethod ? [{ label: "Refund Method", value: record.refundMethod, Icon: FiCreditCard }] : []),
    ...(record.requestedDate ? [{ label: "Requested On", value: formatDate(record.requestedDate), Icon: FiCalendar }] : []),
    ...(record.expectedDate ? [{ label: "Expected By", value: formatDate(record.expectedDate), Icon: FiCalendar }] : []),
  ] : [
    { label: failed ? "Attempted On" : "Due Date", value: dueDate, Icon: FiCalendar },
    { label: "Payment Type", value: record.type, Icon: FiRefreshCw },
    ...(failed ? [{ label: "Payment Method", value: record.paymentMethod || "Not provided", Icon: FiCreditCard }] : [{ label: "Billing Cycle", value: record.billingCycle || "Not provided", Icon: FiCalendar }]),
    ...((record.reference || (failed && record.id)) ? [{ label: failed ? "Payment Reference" : "Reference", value: record.reference || record.id, Icon: FiTag }] : []),
    ...(failed && record.failureReason ? [{ label: "Failure Reason", value: record.failureReason, Icon: FiAlertCircle }] : []),
  ];

  return <dialog ref={dialogRef} className={`payment-details-drawer${failed ? " payment-details-drawer--failed" : refund ? " payment-details-drawer--refund" : ""}`} aria-labelledby="payment-due-title" aria-describedby="payment-due-notice" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="payment-details-drawer__handle" aria-hidden="true" />
    <header className="payment-details-drawer__heading"><span className="payment-details-drawer__heading-icon">{failed ? <FiAlertCircle aria-hidden="true" /> : refund ? <FiRefreshCcw aria-hidden="true" /> : <FiCalendar aria-hidden="true" />}</span><div><h2 id="payment-due-title">{failed ? "Failed Payment" : refund ? "Refund Status" : "Payment Due"}</h2><p>{failed ? "Your rental payment attempt was unsuccessful." : refund ? "Track your sample refund progress and payment details." : "Your upcoming rental payment details."}</p></div><button ref={closeRef} type="button" className="payment-details-drawer__close" aria-label={failed ? "Close failed payment details" : refund ? "Close refund status" : "Close payment due details"} onClick={onClose}><FiX aria-hidden="true" /></button></header>
    {refund && <p className="payment-details-drawer__refund-label">Sample Refund — UI Preview</p>}
    <div className="payment-details-drawer__amount"><div><span>{failed ? "Attempted Amount" : refund ? "Refund Amount" : "Amount Due"}</span><strong>₹{record.amount.toLocaleString("en-IN")}</strong></div><span className="payment-details-drawer__status">{failed ? <FiXCircle aria-hidden="true" /> : refund && record.status === "Refunded" ? <FiCheckCircle aria-hidden="true" /> : <FiClock aria-hidden="true" />} {record.status}</span></div>
    <section className="payment-details-drawer__product" aria-label={refund ? "Related transaction" : "Related rental"}>{record.image && <Image src={record.image} width={96} height={72} alt="" />}<div><span>{refund ? "Related Transaction" : "Related Rental"}</span><strong>{record.product}{refund && relatedPayment ? ` – ${relatedPayment.type}` : ""}</strong>{record.relatedId && <p>Rental ID: {record.relatedId}</p>}</div></section>
    <dl className="payment-details-drawer__facts">{facts.map(({ label, value, Icon }) => <div key={label}><Icon aria-hidden="true" /><div><dt>{label}</dt><dd>{value}</dd></div></div>)}</dl>
    {refund && progressStages.length > 0 && <section className="payment-details-drawer__progress" aria-label="Refund progress"><h3>Refund Progress</h3><ol>{progressStages.map((stage) => <li key={stage.label} className={stage.completed ? "is-completed" : "is-pending"}><span className="payment-details-drawer__progress-marker" aria-hidden="true">{stage.completed && <FiCheckCircle />}</span><strong>{stage.label}</strong><span className="payment-details-drawer__progress-caption">{stage.date ? formatDate(stage.date) : stage.completed ? "Completed" : "Pending"}</span><span className="sr-only">{stage.completed ? "Completed" : "Pending"}</span></li>)}</ol></section>}
    {failed && <p className="payment-details-drawer__next-step">Review the sample payment attempt. Payment retry is not available in this preview.</p>}
    <div id="payment-due-notice" className="payment-details-drawer__notice"><FiInfo aria-hidden="true" /><p><strong>Sample Payments — UI Preview</strong><br />{refund ? "This is fictional preview data for development and testing only. No refund will be processed." : "This is fictional preview data for development and testing only. No payment will be processed."}</p></div>
    <button type="button" className="payment-details-drawer__done" onClick={onClose}>{refund ? "Close Preview" : "Close"}</button>
    {refund && <button type="button" className="payment-details-drawer__back" onClick={onClose}>Back to Payments</button>}
  </dialog>;
}
