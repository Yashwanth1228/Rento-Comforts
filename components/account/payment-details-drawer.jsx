"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FiAlertCircle, FiCalendar, FiClock, FiCreditCard, FiInfo, FiRefreshCw, FiTag, FiX, FiXCircle } from "react-icons/fi";
import "./payment-details-drawer.css";

export default function PaymentDetailsDrawer({ type, record, triggerRef, onClose }) {
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

  if (!record || record.category !== "payment" || !((type === "upcoming" && record.status === "Upcoming") || (type === "failed" && record.status === "Failed"))) return null;
  const failed = type === "failed";
  const dueDate = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${record.date}T00:00:00Z`));
  const facts = [
    { label: failed ? "Attempted On" : "Due Date", value: dueDate, Icon: FiCalendar },
    { label: "Payment Type", value: record.type, Icon: FiRefreshCw },
    ...(failed ? [{ label: "Payment Method", value: record.paymentMethod || "Not provided", Icon: FiCreditCard }] : [{ label: "Billing Cycle", value: record.billingCycle || "Not provided", Icon: FiCalendar }]),
    ...((record.reference || (failed && record.id)) ? [{ label: failed ? "Payment Reference" : "Reference", value: record.reference || record.id, Icon: FiTag }] : []),
    ...(failed && record.failureReason ? [{ label: "Failure Reason", value: record.failureReason, Icon: FiAlertCircle }] : []),
  ];

  return <dialog ref={dialogRef} className={`payment-details-drawer${failed ? " payment-details-drawer--failed" : ""}`} aria-labelledby="payment-due-title" aria-describedby="payment-due-notice" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="payment-details-drawer__handle" aria-hidden="true" />
    <header className="payment-details-drawer__heading"><span className="payment-details-drawer__heading-icon">{failed ? <FiAlertCircle aria-hidden="true" /> : <FiCalendar aria-hidden="true" />}</span><div><h2 id="payment-due-title">{failed ? "Failed Payment" : "Payment Due"}</h2><p>{failed ? "Your rental payment attempt was unsuccessful." : "Your upcoming rental payment details."}</p></div><button ref={closeRef} type="button" className="payment-details-drawer__close" aria-label={failed ? "Close failed payment details" : "Close payment due details"} onClick={onClose}><FiX aria-hidden="true" /></button></header>
    <div className="payment-details-drawer__amount"><div><span>{failed ? "Attempted Amount" : "Amount Due"}</span><strong>₹{record.amount.toLocaleString("en-IN")}</strong></div><span className="payment-details-drawer__status">{failed ? <FiXCircle aria-hidden="true" /> : <FiClock aria-hidden="true" />} {record.status}</span></div>
    <section className="payment-details-drawer__product" aria-label="Related rental">{record.image && <Image src={record.image} width={96} height={72} alt="" />}<div><span>Related Rental</span><strong>{record.product}</strong>{record.relatedId && <p>Rental ID: {record.relatedId}</p>}</div></section>
    <dl className="payment-details-drawer__facts">{facts.map(({ label, value, Icon }) => <div key={label}><Icon aria-hidden="true" /><div><dt>{label}</dt><dd>{value}</dd></div></div>)}</dl>
    {failed && <p className="payment-details-drawer__next-step">Review the sample payment attempt. Payment retry is not available in this preview.</p>}
    <div id="payment-due-notice" className="payment-details-drawer__notice"><FiInfo aria-hidden="true" /><p><strong>Sample Payments — UI Preview</strong><br />This is fictional preview data for development and testing only. No payment will be processed.</p></div>
    <button type="button" className="payment-details-drawer__done" onClick={onClose}>Close</button>
  </dialog>;
}
