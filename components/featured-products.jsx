"use client";

import { useState } from "react";
import { ProductCard } from "./rental-product-card";

const productModes = [
  { id: "rent", label: "Rent" },
  { id: "buy", label: "Buy" },
];

export function FeaturedProducts({
  rentalProducts = [],
  purchaseProducts = [],
  isDevelopmentPreview = false,
}) {
  const [selectedMode, setSelectedMode] = useState("rent");
  const products = selectedMode === "rent" ? rentalProducts : purchaseProducts;
  const displayProducts =
    process.env.NODE_ENV === "development"
      ? products
      : products.filter((product) => !product.previewOnly);
  const hasPreviewProducts =
    process.env.NODE_ENV === "development" &&
    isDevelopmentPreview &&
    displayProducts.some((product) => product.previewOnly);
  const headingId = "featured-products-heading";

  return (
    <section
      id="featured-products"
      className="page-container py-12 sm:py-16"
      aria-labelledby={headingId}
    >
      <div className="featured-products__toolbar mb-6">
        <div>
          <p className="eyebrow">Product discovery</p>
          <h2
            id={headingId}
            className="mt-2 font-editorial text-3xl font-medium text-[#124734] sm:text-4xl"
          >
            Featured Products
          </h2>
        </div>

        <div
          className="featured-products__tabs"
          role="group"
          aria-label="Choose rental or purchase products"
        >
          {productModes.map((mode) => {
            const isSelected = selectedMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={isSelected}
                aria-controls="featured-products-panel"
                onClick={() => setSelectedMode(mode.id)}
                className={`featured-products__tab ${
                  isSelected ? "is-active" : ""
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasPreviewProducts && (
        <aside
          role="note"
          className="mb-5 border-l-4 border-[#017F36] bg-[#E9F1E9] p-4 text-sm text-[#124734]"
        >
          <p className="font-semibold">Development preview only</p>
          <p className="mt-1">
            {selectedMode === "rent"
              ? "These illustrative products and all prices, deposits, rental durations, and availability messages are sample data, not actual inventory or approved business terms."
              : "These illustrative products and prices are sample data for local design review, not actual inventory or approved business prices."}
          </p>
        </aside>
      )}

      {displayProducts.length > 0 ? (
        <div
          id="featured-products-panel"
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          aria-live="polite"
        >
          {displayProducts.map((product) => (
            <ProductCard
              key={`${selectedMode}:${product.id}`}
              product={{ ...product, mode: selectedMode }}
            />
          ))}
        </div>
      ) : (
        <p
          id="featured-products-panel"
          className="rounded-lg border border-[#e2e2dc] bg-white px-5 py-6 text-sm text-[#606860]"
          aria-live="polite"
        >
          {selectedMode === "rent"
            ? "Rental listings will appear here when verified catalogue data is available."
            : "Purchase listings will appear here when verified catalogue data is available."}
        </p>
      )}
    </section>
  );
}
