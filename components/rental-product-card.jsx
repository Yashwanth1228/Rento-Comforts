import Image from "next/image";
import Link from "next/link";

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
/**
 * Displays one rental product using only values supplied by its parent.
 *
 * Required:
 * id, name, imageUrl, imageAlt
 *
 * Optional:
  * brand, category, monthlyRentalPricePaise, refundableDepositPaise,
 * minimumRentalMonths, availabilityMessage, detailsHref
 */
export function RentalProductCard({ product }) {
    const monthlyRent = formatINRFromPaise(product.monthlyRentalPricePaise);
  const refundableDeposit = formatINRFromPaise(product.refundableDepositPaise);

  return (
    <article className="group overflow-hidden rounded-lg border border-[#e2e2dc] bg-white transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F7F2]">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1000px) 30vw, 22vw"
          className="object-contain p-4 transition-transform duration-200 motion-safe:group-hover:scale-[1.02]"
        />
      </div>

      <div className="space-y-3 p-4">
        {(product.brand || product.category) && (
          <p className="text-xs text-[#606860]">
            {[product.brand, product.category].filter(Boolean).join(" · ")}
          </p>
        )}

        <h3 className="font-medium text-[#124734]">{product.name}</h3>

        {monthlyRent !== null && (
          <p className="font-semibold text-[#252925]">
            {monthlyRent}
            <span className="ml-1 text-sm font-normal text-[#606860]">
              / month
            </span>
          </p>
        )}

        {(refundableDeposit !== null ||
          typeof product.minimumRentalMonths === "number") && (
          <dl className="space-y-1 text-sm text-[#606860]">
            {refundableDeposit !== null && (
              <div className="flex justify-between gap-3">
                <dt>Refundable deposit</dt>
                <dd>{refundableDeposit}</dd>
              </div>
            )}

            {typeof product.minimumRentalMonths === "number" && (
              <div className="flex justify-between gap-3">
                <dt>Minimum duration</dt>
                <dd>
                  {product.minimumRentalMonths}{" "}
                  {product.minimumRentalMonths === 1 ? "month" : "months"}
                </dd>
              </div>
            )}
          </dl>
        )}

        {product.availabilityMessage && (
          <p className="text-sm text-[#124734]" aria-live="polite">
            {product.availabilityMessage}
          </p>
        )}

        {product.detailsHref && (
          <Link
            href={product.detailsHref}
            className="inline-flex min-h-10 items-center text-sm font-semibold text-[#017F36] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#017F36]"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  );
}