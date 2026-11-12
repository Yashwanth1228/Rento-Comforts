import { FiUser } from "react-icons/fi";

function getFirstName(fullName) {
  return fullName.trim().split(/\s+/).filter(Boolean)[0] ?? "";
}

function getInitial(fullName) {
  return getFirstName(fullName).charAt(0).toUpperCase();
}

export function AccountWelcomeBanner({
  fullName = "",
  title,
  description = "Manage your account, orders, rentals, and saved items.",
  compact = false,
}) {
  const firstName = getFirstName(fullName);
  const initial = getInitial(fullName);
  const heading = title || (firstName ? `Welcome back, ${firstName}` : "Welcome back");

  return (
    <header
      className={`relative isolate w-full overflow-hidden bg-[#f8f2e9] bg-cover ${compact ? "min-h-[128px] bg-center" : "min-h-[250px] bg-[position:64%_center] sm:min-h-[190px] sm:bg-center lg:min-h-[176px]"}`}
      style={{
        backgroundImage: "url('/images/account-welcome-banner-v1.png')",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#f8f7f2]/90 via-[#f8f7f2]/35 to-transparent sm:hidden"
        aria-hidden="true"
      />
      <div className={`relative z-10 mx-auto flex max-w-[1560px] items-center px-4 sm:px-7 lg:px-8 ${compact ? "min-h-[128px] py-2" : "min-h-[250px] py-6 sm:min-h-[190px] lg:min-h-[176px] lg:py-3"}`}>
        <div className="flex max-w-[76%] items-center gap-3 sm:max-w-[68%] sm:gap-5 lg:max-w-[58%]">
          <span className={`relative grid shrink-0 place-items-center rounded-full bg-[#005a3c] font-bold text-white shadow-sm ${compact ? "size-12 text-xl sm:size-14 sm:text-2xl" : "size-14 text-xl sm:size-[76px] sm:text-3xl"}`}>
            {initial || <FiUser aria-hidden="true" className="size-7 sm:size-9" />}
            {initial && (
              <span
                className="absolute -bottom-0.5 -right-2 h-3.5 w-7 rotate-[-28deg] rounded-full bg-[#a9d77a] shadow-sm"
                aria-hidden="true"
              />
            )}
          </span>
          <span
            className={`w-px shrink-0 bg-[#78a767] ${compact ? "h-12 sm:h-14" : "h-14 sm:h-[68px]"}`}
            aria-hidden="true"
          />
          <span className="min-w-0">
            <h1 className={`${title ? (compact ? "font-sans text-[27px] sm:text-[32px]" : "font-sans text-[30px] sm:text-[36px] lg:text-[40px]") : "font-serif text-[27px] sm:text-[36px] lg:text-[38px]"} font-bold leading-[1.05] tracking-tight text-[#124734]`}>
              {heading}
            </h1>
            <p className={`max-w-lg text-[#3f4841] ${compact ? "mt-1 text-xs leading-5 sm:text-sm" : "mt-2 text-xs leading-5 sm:text-sm sm:leading-6 lg:text-base"}`}>
              {description}
            </p>
          </span>
        </div>
      </div>
    </header>
  );
}

export default AccountWelcomeBanner;
