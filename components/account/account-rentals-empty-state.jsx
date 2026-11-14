import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiCheckCircle,
  FiTool,
  FiTruck,
} from "react-icons/fi";

const rentalGuidance = [
  { title: "Rental plans", description: "Terms vary by product.", Icon: FiCalendar },
  { title: "Delivery & setup", description: "Availability may vary by request.", Icon: FiTruck },
  { title: "Maintenance support", description: "Service details are not connected yet.", Icon: FiTool },
  { title: "Pickup & returns", description: "Terms will be shown when available.", Icon: FiCheckCircle },
];

export default function AccountRentalsEmptyState() {
  return (
    <section className="account-rentals-panel rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-5 xl:p-6" aria-labelledby="account-rentals-heading">
      <header className="flex items-center gap-4 border-b border-[#eceae4] pb-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734] sm:size-14">
          <FiTruck aria-hidden="true" className="size-6 sm:size-7" />
        </span>
        <div className="min-w-0">
          <h1 id="account-rentals-heading" className="text-[25px] font-bold leading-tight text-[#252925] sm:text-[28px]">My Rentals</h1>
          <p className="mt-1 text-sm leading-5 text-[#59635c] sm:text-base">Manage your active rentals, payments, renewals and returns in one place.</p>
        </div>
      </header>

      <div className="account-rentals-empty-body text-center">
        <div className="account-rentals-artwork relative mx-auto">
          <Image
            src="/images/rentals-empty-illustration-v1.webp"
            alt="A comfortable chair, moving box, potted plant and floor lamp"
            fill
            priority
            sizes="(max-width: 639px) 78vw, (max-width: 1279px) 44vw, 380px"
            className="object-contain"
          />
          <Image
            src="/brand/rento-symbol-green.png"
            alt=""
            aria-hidden="true"
            width={173}
            height={144}
            className="account-rentals-package-mark absolute left-[57%] top-[72%] w-[8%] mix-blend-multiply"
          />
        </div>

        <h2 className="account-rentals-empty-title mt-1 text-[26px] font-bold leading-tight text-[#124734] sm:text-[30px]">
          You don’t have any rentals yet
        </h2>
        <p className="account-rentals-empty-description mx-auto mt-2 max-w-[690px] text-base leading-6 text-[#5d625e] sm:text-[17px] sm:leading-7">
          <span className="block sm:hidden">Rent furniture and home appliances for a flexible, hassle-free lifestyle.</span>
          <span className="hidden sm:block xl:hidden">Rent furniture and home appliances for your home, office, or short-term needs and manage them here easily.</span>
          <span className="hidden xl:block">Rent furniture and home appliances for your home, office or any space, with flexible plans and hassle-free service.</span>
        </p>

        <Link
          href="/products?mode=rent"
          className="account-rentals-cta mt-5 inline-flex min-h-[52px] w-full max-w-[360px] items-center justify-center gap-3 rounded-xl bg-[#017f36] px-5 text-base font-bold text-white shadow-[0_3px_8px_rgba(1,127,54,0.15)] transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#124734] sm:mt-6 sm:min-h-[56px] sm:text-lg"
        >
          <FiTruck aria-hidden="true" className="size-5 shrink-0" />
          <span className="sm:hidden xl:inline">Explore Rental Products</span>
          <span className="hidden sm:inline xl:hidden">Explore Rental Collection</span>
          <span aria-hidden="true" className="text-xl leading-none">→</span>
        </Link>
      </div>

      <ul className="account-rentals-benefits grid grid-cols-2 divide-x divide-y divide-[#e8e6df] border-t border-[#eceae4] sm:grid-cols-4 sm:divide-y-0">
        {rentalGuidance.map(({ title, description, Icon }) => (
          <li key={title} className="flex min-w-0 items-center gap-2.5 px-2 py-3 first:pl-0 sm:justify-center sm:gap-3 sm:px-3 sm:py-2 lg:gap-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#017f36] sm:size-11">
              <Icon aria-hidden="true" className="size-5 sm:size-6" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-xs font-bold leading-4 text-[#252925] sm:text-sm">{title}</span>
              <span className="mt-0.5 hidden text-[11px] leading-4 text-[#687169] lg:block">{description}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
