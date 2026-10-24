"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    eyebrow: "A considered way to furnish",
    title: "Furnish Your Home, Your Way.",
    description: "Rent or buy furniture and appliances to suit your budget.",
    image: "/images/hero-living-room-cutout.webp",
    alt: "Illustrative sage-green sofa, cushions and floor lamp, shown as a furniture concept",
    note: "Illustrative furniture concept · not a product listing",
    actions: [
      { label: "Explore Rentals", href: "#rentals", primary: true },
      { label: "Shop to Buy", href: "#buy", primary: false },
    ],
    imagePosition: "center bottom",
  },
  {
    eyebrow: "Furniture · Rental discovery",
    title: "Make Every Space Feel Like Home.",
    description: "Explore furniture rental options for your living, bedroom and workspace needs.",
    image: "/images/hero-bedroom-cutout.webp",
    alt: "Illustrative oak bed with ivory linen, sage cushions and a bedside table",
    note: "Illustrative furniture concept · not a product listing",
    actions: [{ label: "Explore Furniture", href: "#furniture", primary: true }],
    imagePosition: "center bottom",
  },
  {
    eyebrow: "Home appliances · Rent or buy",
    title: "Everyday Comfort, Made Simple.",
    description: "Discover home appliances available for rental or purchase.",
    image: "/images/hero-appliances-cutout.webp",
    alt: "Illustrative group of an unbranded refrigerator, washing machine and microwave",
    note: "Illustrative appliance concept · not a product listing",
    actions: [{ label: "Explore Appliances", href: "#appliances", primary: true }],
    imagePosition: "center bottom",
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion() === true;
  const activeSlide = slides[activeIndex];

  function showSlide(index) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function handleKeyDown(event) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  }

  return (
    <section className="hero-carousel page-container" aria-label="Homepage highlights" aria-roledescription="carousel">
      <div className="hero-carousel__viewport" tabIndex={0} onKeyDown={handleKeyDown}>
        <AnimatePresence initial={false} mode="wait">
          <motion.article
            className="hero-slide"
            key={activeSlide.image}
            role="group"
            aria-roledescription="slide"
            aria-label={`${activeIndex + 1} of ${slides.length}: ${activeSlide.eyebrow}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.012 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: "easeOut" }}
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.alt}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1000px) calc(100vw - 44px), 1320px"
              className="hero-slide__image"
              style={{ objectPosition: activeSlide.imagePosition }}
            />
            <div className="hero-slide__field" aria-hidden="true" />
            <div className="hero-slide__content">
              <p className="hero-slide__eyebrow"><span />{activeSlide.eyebrow}</p>
              <h1 id="hero-heading">{activeSlide.title}</h1>
              <p className="hero-slide__description">{activeSlide.description}</p>
              <div className="hero-slide__actions">
                {activeSlide.actions.map((action) => (
                  <a
                    className={`button ${action.primary ? "button--primary" : "button--secondary"}`}
                    href={action.href}
                    key={action.label}
                  >
                    {action.label}<FiArrowRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <p className="hero-slide__image-note">{activeSlide.note}</p>
          </motion.article>
        </AnimatePresence>

        <button className="hero-carousel__arrow hero-carousel__arrow--previous" type="button" aria-label="Previous slide" onClick={() => showSlide(activeIndex - 1)}>
          <FiChevronLeft aria-hidden="true" />
        </button>
        <button className="hero-carousel__arrow hero-carousel__arrow--next" type="button" aria-label="Next slide" onClick={() => showSlide(activeIndex + 1)}>
          <FiChevronRight aria-hidden="true" />
        </button>

        <div className="hero-carousel__controls" aria-label="Choose a homepage slide">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              className={`hero-carousel__indicator${index === activeIndex ? " is-active" : ""}`}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
        <span className="sr-only" aria-live="polite">Slide {activeIndex + 1} of {slides.length}: {activeSlide.title}</span>
      </div>
    </section>
  );
}
