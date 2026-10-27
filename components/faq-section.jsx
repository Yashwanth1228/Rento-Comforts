"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiChevronDown, FiHeadphones, FiSearch } from "react-icons/fi";

const faqs = [
  {
    number: "01",
    question: "What can I rent from Rento Comforts?",
    answer:
      "Rento Comforts focuses on furniture and home appliances. Rental options depend on the products offered in the catalogue.",
  },
  {
    number: "02",
    question: "Can I buy products instead of renting?",
    answer:
      "Yes. Rento Comforts offers rentals as its primary service, with selected products also available for direct purchase.",
  },
  {
    number: "03",
    question: "Which locations does Rento Comforts serve?",
    answer:
      "Rento Comforts is initially focused on Bengaluru, Karnataka. Delivery availability depends on the serviceable location and PIN code.",
  },
  {
    number: "04",
    question: "Is a security deposit required for rentals?",
    answer:
      "Product-specific refundable security deposits may apply. The applicable deposit and approved refund terms must be displayed before checkout.",
  },
  {
    number: "05",
    question: "Are prices displayed in Indian rupees?",
    answer:
      "Yes. Rental prices, purchase prices, security deposits and applicable charges are displayed in Indian rupees (₹).",
  },
];

export function FAQSection() {
  const [query, setQuery] = useState("");
  const [openNumber, setOpenNumber] = useState("01");
  const visibleFaqs = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return faqs;
    return faqs.filter(({ question, answer }) =>
      `${question} ${answer}`.toLocaleLowerCase().includes(term),
    );
  }, [query]);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="page-container">
        <div className="faq-section__main">
          <div className="faq-section__intro">
            <p className="eyebrow">Customer help</p>
            <h2 id="faq-heading">Frequently Asked Questions</h2>
            <p className="faq-section__description">
              Find quick answers to common questions about renting and buying with Rento Comforts.
            </p>
            <label className="faq-section__search">
              <span className="sr-only">Search questions</span>
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions..."
                aria-controls="faq-list"
              />
            </label>

            <div className="faq-section__visual" aria-label="Illustration of a lounge chair and indoor plant">
              <span className="faq-section__visual-orb" aria-hidden="true" />
              <Image
                src="/images/faq-lounge-cutout-v3.webp"
                alt="Illustrative sage-green lounge chair beside an indoor plant"
                width={1536}
                height={1024}
                sizes="(max-width: 640px) 90vw, (max-width: 1000px) 40vw, 34vw"
                className="faq-section__lifestyle-image"
              />
              <span className="faq-section__chat faq-section__chat--question" aria-hidden="true">?</span>
              <span className="faq-section__chat faq-section__chat--dots" aria-hidden="true"><i /><i /><i /></span>
            </div>
          </div>

          <div className="faq-section__list-wrap">
            <div className="faq-section__list" id="faq-list" aria-label="Frequently asked questions">
              {visibleFaqs.map(({ number, question, answer }) => {
                const isOpen = openNumber === number;
                const answerId = `faq-answer-${number}`;
                return (
                  <article className={`faq-item${isOpen ? " is-open" : ""}`} key={number}>
                    <h3 className="faq-item__heading">
                      <button
                        className="faq-item__trigger"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenNumber(isOpen ? "" : number)}
                      >
                        <span className="faq-item__number">{number}</span>
                        <span className="faq-item__question">{question}</span>
                        <FiChevronDown className="faq-item__chevron" aria-hidden="true" />
                      </button>
                    </h3>
                    <div className="faq-item__answer-shell" id={answerId} aria-hidden={!isOpen}>
                      <div className="faq-item__answer-inner">
                        <p>{answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {visibleFaqs.length === 0 && (
              <p className="faq-section__empty" role="status">
                No matching questions. Try a different search term.
              </p>
            )}
            <p className="sr-only" aria-live="polite">
              {visibleFaqs.length} {visibleFaqs.length === 1 ? "question" : "questions"} found.
            </p>
          </div>
        </div>

        <aside className="faq-support" aria-labelledby="faq-support-heading">
          <span className="faq-support__icon" aria-hidden="true"><FiHeadphones /></span>
          <div className="faq-support__copy">
            <h3 id="faq-support-heading">Still have a question?</h3>
            <p>Need more information about renting or purchasing? Visit our support page.</p>
          </div>
          <span className="faq-support__divider" aria-hidden="true" />
          <button className="faq-support__button" type="button" disabled aria-disabled="true" title="Support destination is not configured yet">
            Contact Support <FiArrowRight aria-hidden="true" />
          </button>
        </aside>
      </div>
    </section>
  );
}
