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
}) {
  const firstName = getFirstName(fullName);
  const initial = getInitial(fullName);
  const heading = title || (firstName ? `Welcome back, ${firstName}` : "Welcome back");

  return (
    <header
      className="relative isolate min-h-[250px] w-full overflow-hidden bg-[#f8f2e9] bg-cover bg-[position:64%_center] sm:min-h-[190px] sm:bg-center lg:min-h-[176px]"
      style={{
        backgroundImage: "url('/images/account-welcome-banner-v1.png')",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#f8f7f2]/90 via-[#f8f7f2]/35 to-transparent sm:hidden"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex min-h-[250px] max-w-[1560px] items-center px-4 py-6 sm:min-h-[190px] sm:px-7 lg:min-h-[176px] lg:px-8 lg:py-3">
        <div className="flex max-w-[76%] items-center gap-3 sm:max-w-[68%] sm:gap-5 lg:max-w-[58%]">
          <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-[#005a3c] text-xl font-bold text-white shadow-sm sm:size-[76px] sm:text-3xl">
            {initial || <FiUser aria-hidden="true" className="size-7 sm:size-9" />}
            {initial && (
              <span
                className="absolute -bottom-0.5 -right-2 h-3.5 w-7 rotate-[-28deg] rounded-full bg-[#a9d77a] shadow-sm"
                aria-hidden="true"
              />
            )}
          </span>
          <span
            className="h-14 w-px shrink-0 bg-[#78a767] sm:h-[68px]"
            aria-hidden="true"
          />
          <span className="min-w-0">
            <h1 className={`${title ? "font-sans text-[30px] sm:text-[36px] lg:text-[40px]" : "font-serif text-[27px] sm:text-[36px] lg:text-[38px]"} font-bold leading-[1.05] tracking-tight text-[#124734]`}>
              {heading}
            </h1>
            <p className="mt-2 max-w-lg text-xs leading-5 text-[#3f4841] sm:text-sm sm:leading-6 lg:text-base">
              {description}
            </p>
          </span>
        </div>
      </div>
    </header>
  );
}

export default AccountWelcomeBanner;
