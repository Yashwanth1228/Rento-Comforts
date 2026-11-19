// Fictional development data. Amounts are whole Indian rupees.
export const samplePayments = [
  { id: "PAY-SAMPLE-001", relatedId: "RT-UI-SAMPLE-003", product: "3-Seater Fabric Sofa", image: "/images/product-gallery/sofa-2.webp", category: "payment", type: "Rental payment", amount: 1499, date: "2026-11-05", status: "Paid", invoiceId: "INV-SAMPLE-001" },
  { id: "PAY-SAMPLE-002", relatedId: "ORD-SAMPLE-002", product: "Double Door Refrigerator", image: "/images/product-gallery/refrigerator-2.webp", category: "payment", type: "Purchase payment", amount: 28990, date: "2026-11-01", status: "Paid", invoiceId: "INV-SAMPLE-002" },
  { id: "DEP-SAMPLE-001", relatedId: "RT-UI-SAMPLE-003", product: "Security Deposit – Sofa Rental", category: "deposit", type: "Refundable deposit", amount: 3000, date: "2026-10-28", status: "Held" },
  { id: "REF-SAMPLE-001", relatedId: "RT-UI-SAMPLE-001", product: "Security Deposit – Previous Rental", category: "refund", type: "Deposit refund", amount: 2500, date: "2026-10-25", status: "Refunded", reference: "REF-UI-SAMPLE-001" },
  { id: "PAY-SAMPLE-003", relatedId: "RT-UI-SAMPLE-002", product: "Bed + Mattress", image: "/images/product-gallery/bed-2.webp", category: "payment", type: "Rental payment", amount: 1999, date: "2026-12-05", status: "Upcoming" },
];
