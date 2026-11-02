/**
 * DEVELOPMENT PREVIEW ONLY. These records are fabricated examples for local UI
 * review. They are never published customer feedback and must not be imported
 * by production routes.
 */
const demoPhoto = (src, view) => ({
  src,
  alt: `Illustrative ${view} development preview image; not a customer-submitted photo.`,
  demoImage: true,
});

export const productFeedbackPreview = {
  "preview-sofa": {
    reviews: [
      { id: "demo-review-01", demo: true, reviewerName: "Sample Customer 01", date: "2026-10-18", rating: 5, title: "Comfortable and a lovely fit", text: "The sofa looks inviting and feels comfortable for everyday lounging. The neutral green shade works well in the room.", photos: [demoPhoto("/images/product-gallery/sofa-2.webp", "sofa angle")] },
      { id: "demo-review-02", demo: true, reviewerName: "Sample Customer 02", date: "2026-10-12", rating: 4, title: "Good size for our living room", text: "A nicely proportioned sofa with a simple style. This is illustrative feedback for previewing the review layout.", photos: [] },
      { id: "demo-review-03", demo: true, reviewerName: "Sample Customer 03", date: "2026-10-05", rating: 5, title: "A calm, comfortable look", text: "The design feels understated and the cushions make the room feel more welcoming.", photos: [demoPhoto("/images/product-gallery/sofa-3.webp", "sofa close-up"), demoPhoto("/images/product-gallery/sofa-4.webp", "sofa side-view")] },
      { id: "demo-review-04", demo: true, reviewerName: "Sample Customer 04", date: "2026-09-29", rating: 3, title: "A little firm at first", text: "The seating feels firmer than I expected, though the overall appearance is attractive.", photos: [] },
      { id: "demo-review-05", demo: true, reviewerName: "Sample Customer 05", date: "2026-09-21", rating: 4, title: "Simple style", text: "A clean design that pairs easily with other furniture. Example content only; not a real customer review.", photos: [demoPhoto("/images/product-gallery/sofa-5.webp", "sofa in a styled room")] },
      { id: "demo-review-06", demo: true, reviewerName: "Sample Customer 06", date: "2026-09-14", rating: 5, title: "Looks just like the preview", text: "The classic shape and muted color make this an easy piece to imagine in a modern home.", photos: [] },
      { id: "demo-review-07", demo: true, reviewerName: "Sample Customer 07", date: "2026-09-08", rating: 4, title: "Roomy seating", text: "There is plenty of room to sit together, and the fabric texture gives it a warm feel.", photos: [] },
      { id: "demo-review-08", demo: true, reviewerName: "Sample Customer 08", date: "2026-08-30", rating: 3, title: "A useful style preview", text: "This sample review helps demonstrate the interface and is not feedback from an actual customer.", photos: [] },
    ],
    faqs: [
      { id: "demo-faq-start-date", demo: true, category: "Furniture", question: "How do I select a rental start date?", answer: "In this preview, a selected start date is a preference only. Final availability will need confirmation; the confirmation process is not configured yet." },
      { id: "demo-faq-minimum", demo: true, category: "Furniture", question: "What is the minimum rental duration?", answer: "The sample listing shows a one-month minimum for layout demonstration. Rental terms for a real order have not been confirmed." },
      { id: "demo-faq-deposit", demo: true, category: "Furniture", question: "How does the security deposit work?", answer: "A deposit amount is shown on this illustrative listing. Deposit collection, deductions, and return terms are not configured or confirmed." },
      { id: "demo-faq-delivery", demo: true, category: "Furniture", question: "Is delivery and setup included?", answer: "Delivery and setup terms have not been confirmed for this preview product. Please treat them as pending business configuration." },
      { id: "demo-faq-maintenance", demo: true, category: "Furniture", question: "Who handles maintenance during a rental?", answer: "Maintenance responsibilities and service arrangements have not been confirmed yet." },
      { id: "demo-faq-extension", demo: true, category: "Furniture", question: "Can I extend a rental?", answer: "Extension eligibility, pricing, and notice requirements are not configured in this preview." },
      { id: "demo-faq-return", demo: true, category: "Furniture", question: "What happens when a rental ends?", answer: "The return and pickup process, applicable charges, and timing are pending confirmation." },
      { id: "demo-faq-buy", demo: true, category: "Furniture", question: "Can I buy instead of rent?", answer: "The product page may show a purchase option when one is configured for the listing. Any purchase terms are illustrative until verified." },
    ],
  },
};
