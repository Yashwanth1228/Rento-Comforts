"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function formatINRFromPaise(amountPaise) {
  if (!Number.isSafeInteger(amountPaise) || amountPaise < 0) {
    return null;
  }

  const rupees = Math.floor(amountPaise / 100);
  const paise = amountPaise % 100;
  const formattedRupees = new Intl.NumberFormat("en-IN").format(rupees);

  return `₹${formattedRupees}${
    paise === 0 ? "" : `.${String(paise).padStart(2, "0")}`
  }`;
}

export default function CartPage() {
  const { items, removeItem } = useCart();
  const hasPreviewItems = items.some((item) => item.previewOnly);

  return (
    <>
      <SiteHeader />
      <main className="page-container min-h-[60vh] py-10 sm:py-16">
      <p className="eyebrow">Your selections</p>
      <h1 className="mt-2 font-editorial text-4xl font-medium text-[#124734] sm:text-5xl">
        Your Cart
      </h1>

      {hasPreviewItems && (
        <aside
          role="note"
          className="mt-6 border-l-4 border-[#017F36] bg-[#E9F1E9] p-4 text-sm text-[#124734]"
        >
          Development preview only. Sample products and prices are not real
          inventory or approved business terms. Nothing here reserves stock,
          creates a booking, or places an order.
        </aside>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#e2e2dc] bg-white p-6 sm:p-8">
          <p className="text-[#606860]">Your cart is empty.</p>
          <Link
            href="/#featured-products"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#017F36] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"
          >
            Continue browsing
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ul className="space-y-4">
            {items.map((item) => {
              const isPurchase = item.mode === "buy";
              const itemPrice = formatINRFromPaise(
                isPurchase
                  ? item.purchasePricePaise
                  : item.monthlyRentalPricePaise,
              );

              return (
                <li
                  key={item.cartKey}
                  className="grid gap-4 rounded-2xl border border-[#e2e2dc] bg-white p-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F8F7F2]">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 90vw, 144px"
                      className="object-contain p-3"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#252925]">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#017F36]">
                      {isPurchase ? "Purchase item" : "Rental item"}
                    </p>
                    {item.category && (
                      <p className="mt-1 text-sm text-[#606860]">
                        {item.category}
                      </p>
                    )}
                    {itemPrice !== null && (
                      <p className="mt-2 text-sm font-semibold text-[#124734]">
                        {itemPrice}
                        {isPurchase ? (
                          <span className="ml-1 font-normal text-[#606860]">
                            one-time purchase price
                          </span>
                        ) : (
                          <span className="ml-1 font-normal text-[#606860]">
                            /mo
                          </span>
                        )}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[#606860]">
                      {isPurchase
                        ? "Adding to cart does not reserve inventory or place an order."
                        : "Rental plan and dates are pending selection. Adding to cart does not reserve inventory or confirm availability."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.cartKey)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b8c9bc] px-4 text-sm font-semibold text-[#124734] transition-colors hover:bg-[#E9F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017F36]"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-2xl border border-[#e2e2dc] bg-white p-5">
            <h2 className="font-semibold text-[#124734]">Cart summary</h2>
            <p className="mt-3 text-sm text-[#606860]">
              Checkout, backend price validation, stock checks, and payments
              are not configured. Rental terms and dates also remain pending.
            </p>
          </aside>
        </div>
      )}
      </main>
      <SiteFooter />
    </>
  );
}
