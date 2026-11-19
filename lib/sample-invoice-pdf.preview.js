// This module is loaded only by the development-only payments preview.
const encoder = new TextEncoder();
const bytes = (value) => encoder.encode(value);
const escapePdfText = (value) => String(value).replace(/[^\x20-\x7e]/g, "?").replace(/([\\()])/g, "\\$1");
const formatMoney = (amount) => `INR ${amount.toLocaleString("en-IN")}`;
const formatDate = (date) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function validateSampleInvoice(record) {
  const validDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  const validText = (value, max) => typeof value === "string" && value.trim().length > 0 && value.length <= max && /^[\x20-\x7e]+$/.test(value);
  if (!record || !/^INV-SAMPLE-[A-Z0-9-]+$/.test(record.invoiceId || "") || !/^PAY-SAMPLE-[A-Z0-9-]+$/.test(record.id || "") || !/^(RT-UI-SAMPLE|ORD-SAMPLE)-[A-Z0-9-]+$/.test(record.relatedId || "") || !validText(record.product, 45) || !["Rental payment", "Purchase payment"].includes(record.type) || record.category !== "payment" || record.status !== "Paid" || !validDate(record.date) || !Number.isSafeInteger(record.amount) || record.amount <= 0 || record.amount > 99999999 || record.tax != null || record.lineItems != null) {
    throw new Error("This sample invoice is missing valid, consistent payment details. No PDF was generated.");
  }
  if (record.rentalPeriod && (!validDate(record.rentalPeriod.start) || !validDate(record.rentalPeriod.end) || record.rentalPeriod.start > record.rentalPeriod.end || record.type !== "Rental payment")) {
    throw new Error("The sample rental period is invalid. No PDF was generated.");
  }
  return record;
}

function joinBytes(parts) {
  const total = parts.reduce((size, part) => size + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

export function createSampleInvoicePdf(record, logoBytes) {
  validateSampleInvoice(record);
  if (!(logoBytes instanceof Uint8Array) || logoBytes.length < 4 || logoBytes[0] !== 0xff || logoBytes[1] !== 0xd8) throw new Error("The brand image could not be loaded. No PDF was generated.");
  const commands = [];
  const text = (x, y, size, value, font = "F1", color = "0.14 0.16 0.14") => commands.push(`BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${escapePdfText(value)}) Tj ET`);
  const rect = (x, y, w, h, color) => commands.push(`${color} rg ${x} ${y} ${w} ${h} re f`);
  const rule = (x1, y, x2) => commands.push(`0.83 0.87 0.83 RG 0.7 w ${x1} ${y} m ${x2} ${y} l S`);
  rect(0, 0, 595, 842, "1 1 1");
  rect(36, 776, 523, 38, "0.99 0.94 0.82");
  // WinAnsi octal 227 is an em dash. The watermark is on the sole A4 page.
  commands.push("BT /F2 17 Tf 0.42 0.20 0.05 rg 1 0 0 1 119 788 Tm (SAMPLE \\227 NOT A TAX INVOICE) Tj ET");
  commands.push("q 76 0 0 74 40 682 cm /Logo Do Q");
  text(132, 737, 18, "RENTO COMFORTS", "F2", "0.04 0.32 0.20");
  text(132, 716, 12, "Sample Invoice", "F2");
  text(355, 737, 10, `Invoice: ${record.invoiceId}`);
  text(355, 720, 10, `Date: ${formatDate(record.date)}`);
  text(355, 703, 10, `Status: ${record.status}`);
  rule(40, 675, 555);
  text(42, 651, 12, "Billed To", "F2", "0.04 0.32 0.20");
  text(42, 632, 10, "Sample Customer");
  text(42, 616, 9, "Fictional details for UI preview");
  text(305, 651, 12, "Payment Details", "F2", "0.04 0.32 0.20");
  text(305, 632, 9, `Transaction: ${record.id}`);
  text(305, 616, 9, `Order / Rental: ${record.relatedId}`);
  text(305, 600, 9, `Payment date: ${formatDate(record.date)}`);
  rect(40, 556, 515, 29, "0.92 0.95 0.92");
  text(50, 566, 10, "Item and description", "F2");
  text(325, 566, 10, "Type", "F2");
  text(422, 566, 10, "Qty", "F2");
  text(473, 566, 10, "Amount", "F2");
  text(50, 532, 10, record.product, "F2");
  text(325, 532, 9, record.type === "Rental payment" ? "Rental" : "Purchase");
  text(428, 532, 10, "1");
  text(466, 532, 10, formatMoney(record.amount), "F2");
  rule(40, 514, 555);
  if (record.rentalPeriod) {
    rect(42, 446, 220, 46, "0.91 0.96 0.90");
    text(52, 475, 10, "Rental Period", "F2");
    text(52, 458, 9, `${formatDate(record.rentalPeriod.start)} - ${formatDate(record.rentalPeriod.end)}`);
  }
  text(325, 485, 10, "Subtotal"); text(466, 485, 10, formatMoney(record.amount), "F2");
  text(325, 465, 10, "Tax breakdown"); text(466, 465, 9, "Not provided");
  rect(315, 425, 240, 29, "0.89 0.96 0.88");
  text(325, 435, 11, "Total Paid", "F2"); text(466, 435, 11, formatMoney(record.amount), "F2");
  text(315, 410, 8, "Tax treatment is not specified in this sample.");
  rect(40, 250, 515, 78, "0.99 0.96 0.87");
  text(52, 309, 11, "FICTIONAL DEVELOPMENT PREVIEW", "F2", "0.38 0.19 0.04");
  text(52, 289, 10, "This document contains fictional development-preview data.");
  text(52, 273, 10, "It is not a valid tax invoice, receipt, proof of payment,");
  text(52, 257, 10, "or legally issued billing document.");
  rect(40, 100, 515, 66, "0.94 0.97 0.92");
  text(151, 125, 22, "Thank you!", "F3");
  text(282, 128, 11, "for choosing Rento Comforts.");
  const stream = bytes(commands.join("\n"));
  const objects = [
    bytes("<< /Type /Catalog /Pages 2 0 R >>"),
    bytes("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    bytes("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> /XObject << /Logo 7 0 R >> >> /Contents 8 0 R >>"),
    bytes("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"),
    bytes("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"),
    bytes("<< /Type /Font /Subtype /Type1 /BaseFont /ZapfChancery-MediumItalic /Encoding /WinAnsiEncoding >>"),
    joinBytes([bytes(`<< /Type /XObject /Subtype /Image /Width 1080 /Height 1048 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n`), logoBytes, bytes("\nendstream")]),
    joinBytes([bytes(`<< /Length ${stream.length} >>\nstream\n`), stream, bytes("\nendstream")]),
  ];
  const parts = [bytes("%PDF-1.4\n")];
  const offsets = [0];
  let offset = parts[0].length;
  objects.forEach((object, index) => {
    const part = joinBytes([bytes(`${index + 1} 0 obj\n`), object, bytes("\nendobj\n")]);
    offsets.push(offset); parts.push(part); offset += part.length;
  });
  const xref = offset;
  parts.push(bytes(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((entry) => `${String(entry).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
  return joinBytes(parts);
}

export async function downloadSampleInvoice(invoiceId, records) {
  if (process.env.NODE_ENV !== "development") throw new Error("Sample invoice downloads are available only in development.");
  const matching = records.filter((record) => record.invoiceId === invoiceId);
  if (matching.length !== 1) throw new Error("The selected sample invoice could not be found uniquely.");
  const record = validateSampleInvoice(matching[0]);
  const response = await fetch("/brand/rento-comforts.jpeg", { credentials: "same-origin" });
  if (!response.ok) throw new Error("The brand image could not be loaded. No PDF was generated.");
  const pdf = createSampleInvoicePdf(record, new Uint8Array(await response.arrayBuffer()));
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `rento-comforts-SAMPLE-${record.invoiceId.replace(/^INV-SAMPLE-/, "INV-")}.pdf`;
    document.body.appendChild(link);
    try { link.click(); } finally { link.remove(); }
  } finally { window.setTimeout(() => URL.revokeObjectURL(url), 60000); }
}
