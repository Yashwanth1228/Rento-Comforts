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
  mobileTitle = "Order history unavailable",
  mobileDescription = "Your purchase or rental orders will appear here once order history is connected to Rento Comforts.",
}) {
  return (
    <div className="account-orders-content flex min-h-0 flex-col items-center justify-center px-3 py-1 text-center sm:px-8 sm:py-5 xl:flex-1 xl:py-3">
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
      <div className="mobile-orders-artwork relative shrink-0 xl:hidden">
        <Image
          src="/images/orders-empty-illustration-mobile-v2.png"
          alt="Two parcels beside a potted plant"
          width={1536}
          height={1024}
          className="h-full w-full object-contain"
          priority
        />
        <Image
          src="/brand/rento-symbol-green.png"
          alt=""
          aria-hidden="true"
          width={173}
          height={144}
          className="mobile-orders-package-logo absolute left-[45%] top-[51%] w-[8%] mix-blend-multiply"
          priority
        />
      </div>
      <h2 className="account-orders-title mt-2 max-w-[680px] text-[28px] font-bold leading-tight text-[#252925] sm:text-[30px] xl:mt-2 xl:text-[30px] xl:text-[#124734]">
        <span className="xl:hidden">{mobileTitle}</span>
        <span className="hidden xl:inline">{title}</span>
      </h2>
      <p className="account-orders-description mt-2 max-w-[600px] text-base leading-6 text-[#5d625e]">
        <span className="xl:hidden">{mobileDescription}</span>
        <span className="hidden xl:inline">{description}</span>
      </p>
      <Link
        href="/products"
        className="account-orders-cta mt-6 inline-flex min-h-12 w-full max-w-[260px] items-center justify-center gap-3 rounded-xl bg-[#017f36] px-6 text-lg font-bold text-white shadow-[0_3px_8px_rgba(1,127,54,0.15)] transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124734] sm:min-h-[54px] sm:max-w-[310px]"
      >
        <FiShoppingCart aria-hidden="true" className="size-5" />
        Start Shopping
      </Link>
    </div>
  );
}
