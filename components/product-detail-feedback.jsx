"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiImage, FiMinus, FiPlus, FiStar, FiX } from "react-icons/fi";

const validReview = (review) => {
  const allowedReview = review?.demo === true || (review?.verified === true && review?.published === true);
  return allowedReview && Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5 && typeof review.text === "string" && review.text.trim().length > 0;
};

const validFaq = (faq) =>
  (faq?.approved === true || faq?.demo === true) &&
  typeof faq.question === "string" && faq.question.trim().length > 0 &&
  typeof faq.answer === "string" && faq.answer.trim().length > 0;

const dateLabel = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

function ReviewStars({ rating, interactive = false, value, onChange }) {
  if (interactive) return <fieldset><legend className="mb-1 text-xs font-medium text-[#59635c]">Your rating</legend><div className="flex" role="radiogroup" aria-label="Choose a rating from one to five stars">{[1, 2, 3, 4, 5].map((star) => <label key={star} className="cursor-pointer rounded-sm p-0.5 text-[#d59a32] focus-within:outline-2 focus-within:outline-[#017F36]"><input className="sr-only" type="radio" name="demo-review-rating" value={star} checked={value === star} onChange={() => onChange(star)} aria-label={`${star} ${star === 1 ? "star" : "stars"}`} /><FiStar aria-hidden="true" className={`size-6 ${star <= value ? "fill-current" : "fill-transparent"}`} /></label>)}</div></fieldset>;
  return <span className="inline-flex items-center gap-0.5 text-[#d59a32]" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <FiStar key={star} aria-hidden="true" className={`size-3.5 ${star <= Math.round(rating) ? "fill-current" : "fill-transparent"}`} />)}</span>;
}

export function ProductDetailFeedback({ reviews, faqs, developmentFeedback }) {
  const [localReviews, setLocalReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [photoIndex, setPhotoIndex] = useState(-1);
  const [formOpen, setFormOpen] = useState(false);
  const photoUrls = useRef(new Set());
  const isDevelopmentPreview = Boolean(developmentFeedback);
  const baseReviews = isDevelopmentPreview ? developmentFeedback.reviews : reviews;
  const reviewItems = useMemo(() => [...(Array.isArray(baseReviews) ? baseReviews.filter(validReview) : []), ...localReviews], [baseReviews, localReviews]);
  const faqItems = useMemo(() => {
    const configured = Array.isArray(faqs) ? faqs.filter(validFaq) : [];
    return isDevelopmentPreview ? [...configured, ...(developmentFeedback.faqs || []).filter(validFaq)] : configured;
  }, [faqs, developmentFeedback, isDevelopmentPreview]);
  const average = reviewItems.length ? reviewItems.reduce((total, review) => total + review.rating, 0) / reviewItems.length : null;
  const photos = useMemo(() => reviewItems.flatMap((review) => (Array.isArray(review.photos) ? review.photos : []).map((photo) => ({ ...photo, reviewId: review.id, reviewerName: review.reviewerName, reviewTitle: review.title || "Customer review", demo: review.demo === true }))), [reviewItems]);
  const visibleReviews = useMemo(() => {
    let result = reviewItems.filter((review) => filter !== "photos" || review.photos?.length);
    result = [...result].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    return result;
  }, [reviewItems, filter, sort]);

  useEffect(() => () => { photoUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);
  useEffect(() => {
    if (photoIndex < 0) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setPhotoIndex(-1);
      if (photos.length > 1 && event.key === "ArrowRight") setPhotoIndex((current) => (current + 1) % photos.length);
      if (photos.length > 1 && event.key === "ArrowLeft") setPhotoIndex((current) => (current - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photoIndex, photos.length]);

  return <section className="mt-5 grid min-w-0 items-start gap-4 lg:grid-cols-2" aria-label="Customer reviews and product FAQs">
    <article className="min-w-0 rounded-2xl border border-[#e7e4dc] bg-white p-4 shadow-[0_2px_10px_rgba(37,41,37,0.045)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-editorial text-xl font-semibold text-[#124734] sm:text-2xl">Customer Reviews</h2>{average !== null && <div className="flex items-center gap-2"><strong className="text-sm text-[#252925]">{average.toFixed(1)}</strong><ReviewStars rating={average} /><span className="text-xs text-[#69736b]">({reviewItems.length})</span></div>}</div>
      {isDevelopmentPreview && <p className="mt-2 rounded-lg bg-[#edf5ec] px-3 py-2 text-xs font-semibold text-[#124734]">Demo reviews — development preview only</p>}
      {reviewItems.length === 0 ? <div className="mt-4 rounded-xl bg-[#f8f7f2] px-4 py-5 text-center"><p className="text-sm font-semibold text-[#252925]">No customer reviews yet</p><p className="mt-1 text-xs leading-5 text-[#69736b]">Reviews and product photos from customers will appear here once available.</p></div> : <>
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(120px,.7fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#f8f7f2] p-3 text-center"><strong className="font-editorial text-4xl leading-none text-[#124734]">{average.toFixed(1)}</strong><ReviewStars rating={average} /><span className="mt-1 text-xs text-[#69736b]">out of 5 · {reviewItems.length} {isDevelopmentPreview ? "demo reviews" : reviewItems.length === 1 ? "review" : "reviews"}</span></div>
          <div className="grid content-center gap-1" aria-label="Review rating distribution">{[5, 4, 3, 2, 1].map((rating) => { const count = reviewItems.filter((review) => Math.round(review.rating) === rating).length; const percent = Math.round(count / reviewItems.length * 100); return <div key={rating} className="grid grid-cols-[1.5rem_1fr_2.25rem] items-center gap-2 text-[11px] text-[#59635c]"><span>{rating} <FiStar aria-hidden="true" className="inline size-3 fill-[#d59a32] text-[#d59a32]" /></span><span className="h-1.5 overflow-hidden rounded-full bg-[#e8ece6]"><span className="block h-full rounded-full bg-[#258b5c]" style={{ width: `${percent}%` }} /></span><span className="text-right">{percent}%</span></div>; })}</div>
        </div>
        {photos.length > 0 && <div className="mt-4 border-t border-[#eeece7] pt-3"><div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-[#124734]">Customer Photos</h3>{isDevelopmentPreview && <span className="text-[10px] font-medium text-[#69736b]">Illustrative demo images, not customer uploads</span>}</div><div className="flex gap-2 overflow-x-auto pb-1" aria-label="Customer review photo gallery">{photos.map((photo, index) => <button key={`${photo.reviewId}-${index}`} type="button" onClick={() => setPhotoIndex(index)} aria-label={`View photo for ${photo.reviewerName}'s review: ${photo.reviewTitle}`} className="relative size-[68px] shrink-0 overflow-hidden rounded-lg border border-[#e2e2dc] bg-[#f8f7f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"><Image src={photo.src} alt={photo.alt || "Photo attached to customer review"} fill sizes="68px" className="object-cover" />{photo.demo && <span className="absolute inset-x-0 bottom-0 bg-[#124734]/85 py-0.5 text-[8px] font-semibold text-white">DEMO</span>}</button>)}</div></div>}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#eeece7] pt-3"><div className="flex gap-1.5" aria-label="Filter reviews">{[["all", "All Reviews"], ["photos", "With Photos"]].map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${filter === value ? "bg-[#124734] text-white" : "bg-[#f4f3ef] text-[#46534a] hover:bg-[#e9f1e9]"}`}>{label}</button>)}</div><label className="ml-auto flex items-center gap-1.5 text-[11px] text-[#59635c]">Sort <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-md border border-[#e2e2dc] bg-white px-2 py-1 text-xs text-[#252925] focus-visible:outline-2 focus-visible:outline-[#017F36]"><option value="newest">Newest</option><option value="highest">Highest Rated</option><option value="lowest">Lowest Rated</option></select></label></div>
        <ul className="mt-1 divide-y divide-[#eeece7]">{visibleReviews.map((review) => <li key={review.id} className="py-3 first:pt-3 last:pb-0"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="text-xs font-semibold text-[#252925]">{review.reviewerName || "Customer"}</span>{review.demo && <span className="rounded-full bg-[#edf5ec] px-2 py-0.5 text-[10px] font-semibold text-[#124734]">Demo</span>}{review.verified === true && review.published === true && <span className="text-[10px] font-medium text-[#4f6858]">Verified purchase</span>}</div><div className="flex items-center gap-2"><ReviewStars rating={review.rating} /><span className="text-xs text-[#69736b]">{dateLabel(review.date)}</span></div></div>{review.title && <h3 className="mt-1 text-sm font-semibold text-[#252925]">{review.title}</h3>}<p className="mt-1 text-sm leading-5 text-[#59635c]">{review.text}</p>{review.photos?.length > 0 && <div className="mt-2 flex gap-2">{review.photos.map((photo, index) => { const galleryIndex = photos.findIndex((item) => item.reviewId === review.id && item.src === photo.src); return <button key={`${review.id}-photo-${index}`} type="button" onClick={() => setPhotoIndex(Math.max(0, galleryIndex))} aria-label={`Enlarge photo attached to ${review.reviewerName}'s review`} className="relative size-14 overflow-hidden rounded-lg border border-[#e2e2dc] focus-visible:outline-2 focus-visible:outline-[#017F36]"><Image src={photo.src} alt={photo.alt || "Photo attached to review"} fill sizes="56px" className="object-cover" />{review.demo && <span className="absolute inset-x-0 bottom-0 bg-[#124734]/85 py-0.5 text-[8px] font-semibold text-white">DEMO</span>}</button>; })}</div>}</li>)}</ul>
      </>}
      {isDevelopmentPreview && <div className="mt-4 border-t border-[#eeece7] pt-3"><button type="button" onClick={() => setFormOpen((open) => !open)} aria-expanded={formOpen} className="rounded-lg border border-[#9ab6a3] bg-white px-3 py-2 text-sm font-semibold text-[#124734] hover:bg-[#f2f7f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]">{formOpen ? "Close Review Preview" : "Try Review Form"}</button><p className="mt-1 text-[11px] text-[#69736b]">Local preview only — no review is sent to a server.</p><div hidden={!formOpen}><DemoReviewForm onAdd={(review) => setLocalReviews((current) => [review, ...current])} photoUrlsRef={photoUrls} /></div></div>}
    </article>

    <article className="min-w-0 rounded-2xl border border-[#e7e4dc] bg-white p-4 shadow-[0_2px_10px_rgba(37,41,37,0.045)] sm:p-5"><div className="flex items-center justify-between gap-2"><h2 className="font-editorial text-xl font-semibold text-[#124734] sm:text-2xl">Frequently Asked Questions</h2>{isDevelopmentPreview && <span className="shrink-0 rounded-full bg-[#edf5ec] px-2.5 py-1 text-[10px] font-semibold text-[#124734]">DEMO</span>}</div>{faqItems.length === 0 ? <div className="mt-4 rounded-xl bg-[#f8f7f2] px-4 py-5 text-center"><p className="text-sm font-semibold text-[#252925]">Product-specific FAQs will appear here once confirmed.</p></div> : <FaqAccordion faqs={faqItems} />}{isDevelopmentPreview && <p className="mt-3 text-[11px] leading-4 text-[#69736b]">Illustrative answers for development preview only. Policy-dependent terms are pending confirmation.</p>}</article>

    {photoIndex >= 0 && photos[photoIndex] && <PhotoViewer photo={photos[photoIndex]} index={photoIndex} count={photos.length} onClose={() => setPhotoIndex(-1)} onChange={setPhotoIndex} />}
  </section>;
}

function DemoReviewForm({ onAdd, photoUrlsRef }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const inputRef = useRef(null);

  function selectFiles(event) {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    setError("");
    const valid = [];
    for (const file of selected) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setError(`${file.name}: choose a JPEG, PNG, or WebP image.`); continue; }
      if (file.size > 5 * 1024 * 1024) { setError(`${file.name}: each image must be 5 MB or smaller.`); continue; }
      if (files.length + valid.length >= 5) { setError("You can add up to 5 photos per review."); break; }
      const url = URL.createObjectURL(file);
      photoUrlsRef.current.add(url);
      valid.push({ file, url });
    }
    setFiles((current) => [...current, ...valid].slice(0, 5));
  }

  function removeFile(index) {
    setFiles((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed) { URL.revokeObjectURL(removed.url); photoUrlsRef.current.delete(removed.url); }
      return next;
    });
  }

  function saveLocalDemo() {
    if (!rating) { setError("Select a star rating."); return; }
    if (title.trim().length < 3 || title.trim().length > 80) { setError("Title must be between 3 and 80 characters."); return; }
    if (text.trim().length < 10 || text.trim().length > 1000) { setError("Review must be between 10 and 1,000 characters."); return; }
    onAdd({ id: `local-demo-${Date.now()}`, demo: true, reviewerName: "Local Demo Customer", date: new Date().toISOString().slice(0, 10), rating, title: title.trim(), text: text.trim(), photos: files.map(({ url, file }) => ({ src: url, alt: `Local photo preview selected from ${file.name}`, demo: true })) });
    setRating(0); setTitle(""); setText(""); setFiles([]); setPreview(false); setError("");
  }

  return <form className="mt-3 rounded-xl border border-[#e7e4dc] bg-[#fcfbf8] p-3" onSubmit={(event) => { event.preventDefault(); saveLocalDemo(); }}><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-[#124734]">Local review form preview</h3><span className="text-[10px] font-semibold text-[#69736b]">Resets on refresh</span></div><p className="mt-1 text-[11px] leading-4 text-[#69736b]">Do not enter personal information. This stays in this browser tab and is not submitted.</p>
    <div className="mt-3"><ReviewStars interactive value={rating} onChange={setRating} /></div><label className="mt-2 block text-xs font-medium text-[#59635c]">Review title<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} className="mt-1 min-h-10 w-full rounded-lg border border-[#d8d8d0] bg-white px-3 text-sm text-[#252925] focus-visible:outline-2 focus-visible:outline-[#017F36]" /></label><label className="mt-2 block text-xs font-medium text-[#59635c]">Your review<textarea value={text} onChange={(event) => setText(event.target.value)} minLength={10} maxLength={1000} rows={3} className="mt-1 w-full rounded-lg border border-[#d8d8d0] bg-white px-3 py-2 text-sm text-[#252925] focus-visible:outline-2 focus-visible:outline-[#017F36]" /><span className="mt-0.5 block text-right text-[10px] text-[#69736b]">{text.length}/1,000</span></label>
    <div className="mt-2"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} className="sr-only" aria-label="Select review photos" /><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#9ab6a3] px-3 text-xs font-semibold text-[#124734] hover:bg-[#edf5ec] focus-visible:outline-2 focus-visible:outline-[#017F36]"><FiImage aria-hidden="true" />Add product photos ({files.length}/5)</button><p className="mt-1 text-[10px] text-[#69736b]">JPEG, PNG or WebP · up to 5 MB each</p>{files.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{files.map(({ url, file }, index) => <div key={url} className="relative"><Image src={url} alt={`Selected local preview ${index + 1}`} width={62} height={62} unoptimized className="size-[62px] rounded-lg border border-[#e2e2dc] object-cover" /><button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#124734] text-white"><FiX className="size-3" /></button></div>)}</div>}</div>
    {error && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{error}</p>}
    <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setPreview((open) => !open)} className="min-h-9 rounded-lg border border-[#9ab6a3] px-3 text-xs font-semibold text-[#124734] hover:bg-[#edf5ec]">{preview ? "Hide preview" : "Preview review"}</button><button type="submit" className="min-h-9 rounded-lg bg-[#124734] px-3 text-xs font-semibold text-white hover:bg-[#017F36]">Add to Local Demo</button></div>
    {preview && <div className="mt-3 rounded-lg border border-[#e2e2dc] bg-white p-3"><div className="flex items-center gap-2"><span className="text-xs font-semibold">Local Demo Customer</span><span className="rounded-full bg-[#edf5ec] px-2 py-0.5 text-[10px] font-semibold text-[#124734]">Demo</span><ReviewStars rating={rating || 0} /></div><p className="mt-1 text-sm font-semibold text-[#252925]">{title || "Your review title"}</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#59635c]">{text || "Your review preview will appear here."}</p>{files.length > 0 && <div className="mt-2 flex gap-2">{files.map(({ url }, index) => <Image key={url} src={url} alt={`Preview photo ${index + 1}`} width={58} height={58} unoptimized className="size-[58px] rounded-lg object-cover" />)}</div>}</div>}</form>;
}

function PhotoViewer({ photo, index, count, onClose, onChange }) {
  return <div role="dialog" aria-modal="true" aria-label={`${photo.reviewerName}'s review photo`} className="fixed inset-0 z-[220] grid place-items-center bg-black/85 p-4" onClick={onClose}><button type="button" onClick={onClose} aria-label="Close photo viewer" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-[#252925] shadow"><FiX className="size-5" /></button>{count > 1 && <button type="button" aria-label="Previous review photo" onClick={(event) => { event.stopPropagation(); onChange((index - 1 + count) % count); }} className="absolute left-3 grid size-11 place-items-center rounded-full bg-white text-[#252925] shadow sm:left-8"><FiChevronLeft className="size-6" /></button>}<figure className="relative flex max-h-[88vh] max-w-[min(90vw,1100px)] flex-col items-center" onClick={(event) => event.stopPropagation()}><div className="relative h-[min(72vh,780px)] w-[min(88vw,1000px)]"><Image src={photo.src} alt={photo.alt || "Review photo"} fill sizes="90vw" unoptimized={photo.src.startsWith("blob:")} className="object-contain" /></div><figcaption className="mt-2 rounded-full bg-white/95 px-3 py-1 text-xs text-[#252925]">{photo.reviewerName} · {photo.reviewTitle}{photo.demo && " · Demo preview"}{count > 1 && ` · ${index + 1} of ${count}`}</figcaption></figure>{count > 1 && <button type="button" aria-label="Next review photo" onClick={(event) => { event.stopPropagation(); onChange((index + 1) % count); }} className="absolute right-3 grid size-11 place-items-center rounded-full bg-white text-[#252925] shadow sm:right-8"><FiChevronRight className="size-6" /></button>}</div>;
}

function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(-1);
  return <div className="mt-3 divide-y divide-[#e9e7e1] border-y border-[#e9e7e1]">{faqs.map((faq, index) => { const isOpen = openIndex === index; const answerId = `product-faq-answer-${faq.id || index}`; return <div key={faq.id || faq.question} className="py-0.5"><h3><button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(isOpen ? -1 : index)} className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-sm font-medium text-[#252925] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#017F36]"><span>{faq.question}</span>{isOpen ? <FiMinus aria-hidden="true" className="size-4 shrink-0 text-[#124734]" /> : <FiPlus aria-hidden="true" className="size-4 shrink-0 text-[#124734]" />}</button></h3><div id={answerId} aria-hidden={!isOpen} className={`overflow-hidden pr-7 text-sm leading-5 text-[#59635c] transition-[max-height,opacity] duration-300 motion-reduce:transition-none ${isOpen ? "max-h-40 pb-3 opacity-100" : "max-h-0 opacity-0"}`}>{faq.answer}</div></div>; })}</div>;
}
