import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

/**
 * Reusable illustration and message for an empty or not-yet-connected order list.
 * The Orders route uses the unavailable copy until an authenticated orders API exists.
 */
export default function AccountOrdersEmptyState({
  title = "Order history is not available yet",
  description = "When order history is connected, your purchases and rentals will appear here.",
}) {
  return (
    <div className="account-orders-content flex min-h-[430px] flex-col items-center justify-center px-4 py-8 text-center sm:px-8 xl:min-h-0 xl:flex-1 xl:py-3">
      <div className="account-orders-artwork relative hidden w-full max-w-[430px] shrink-0 xl:block">
        <Image
          src="/images/orders-empty-illustration-v2.png"
          alt="A parcel beside a potted plant and a warm table lamp"
          width={1669}
          height={1024}
          className="account-orders-artwork-image h-full w-full object-contain"
          priority
        />
        <Image
          src="/brand/rento-symbol-green.png"
          alt=""
          aria-hidden="true"
          width={173}
          height={144}
          className="account-orders-package-logo absolute left-[46%] top-[50%] w-[12%] mix-blend-multiply"
          priority
        />
      </div>
      <Image
        src="/images/orders-empty-illustration-mobile.png"
        alt="Two parcels beside a potted plant"
        width={1536}
        height={1024}
        className="h-[205px] w-full max-w-[430px] object-contain sm:h-[225px] xl:hidden"
        priority
      />
      <h2 className="account-orders-title mt-3 max-w-[680px] text-[25px] font-bold leading-tight text-[#124734] sm:text-[28px] xl:mt-2 xl:text-[30px]">
        {title}
      </h2>
      <p className="account-orders-description mt-2 max-w-[600px] text-sm leading-6 text-[#5d625e] sm:text-base sm:leading-6">
        {description}
      </p>
      <Link
        href="/products"
        className="account-orders-cta mt-6 inline-flex min-h-12 w-full max-w-[310px] items-center justify-center gap-3 rounded-xl bg-[#017f36] px-6 text-base font-bold text-white shadow-[0_3px_8px_rgba(1,127,54,0.15)] transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124734] sm:min-h-[54px] sm:text-lg"
      >
        <FiShoppingCart aria-hidden="true" className="size-5" />
        Start Shopping
      </Link>
    </div>
  );
}
