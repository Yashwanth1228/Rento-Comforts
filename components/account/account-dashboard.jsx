import Link from "next/link";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import {
  FiAlertCircle,
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiCreditCard,
  FiEdit2,
  FiHeadphones,
  FiHeart,
  FiHome,
  FiLoader,
  FiMapPin,
  FiSettings,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";

const sidebarItems = [
  { label: "Overview", Icon: FiHome, href: "/account", section: "overview" },
  { label: "Personal Information", Icon: FiUser, href: "/account/personal-information", section: "personal-information" },
  { label: "My Orders", Icon: FiBox, href: "/account/orders", section: "orders" },
  { label: "My Rentals", Icon: FiTruck },
  { label: "Wishlist", Icon: FiHeart },
  { label: "My Addresses", Icon: FiMapPin },
  { label: "Payments & Invoices", Icon: FiCreditCard },
  { label: "Help & Support", Icon: FiHeadphones },
  { label: "Account Settings", Icon: FiSettings },
];

const quickActions = [
  {
    label: "Personal Information",
    compactLabel: "Personal info",
    description: "View and manage your profile",
    Icon: FiUser,
    href: "/account/personal-information",
  },
  {
    label: "My Addresses",
    compactLabel: "Addresses",
    description: "Address management is not connected yet",
    Icon: FiMapPin,
  },
  {
    label: "Wishlist",
    compactLabel: "Wishlist",
    description: "Saved items are not connected yet",
    Icon: FiHeart,
  },
  {
    label: "Account Settings",
    compactLabel: "Settings",
    description: "Settings are not connected yet",
    Icon: FiSettings,
  },
];

function StatusRow({ label, verified }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#e9ebe5] py-3 last:border-b-0 xl:min-h-10 xl:gap-2 xl:py-0.5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full xl:size-7 ${
            verified ? "bg-[#e9f1e9] text-[#124734]" : "bg-[#f5f1e9] text-[#715e37]"
          }`}
          aria-hidden="true"
        >
          {verified ? <FiCheckCircle className="size-[18px] xl:size-4" /> : <FiAlertCircle className="size-[18px] xl:size-4" />}
        </span>
        <span className="text-sm font-semibold text-[#303731]">{label}</span>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold xl:px-2.5 xl:py-0.5 ${
          verified ? "bg-[#e4f5e3] text-[#155b2d]" : "bg-[#fbf0d9] text-[#715322]"
        }`}
      >
        {verified ? "Verified" : "Not verified"}
      </span>
    </div>
  );
}

function RetryPanel({ title, message, onRetry, alert = false }) {
  return (
    <section
      className={`rounded-2xl border bg-white p-6 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-8 ${
        alert ? "border-[#ead8d4]" : "border-[#e5e7e1]"
      }`}
      role={alert ? "alert" : undefined}
    >
      <h2 className="text-xl font-bold text-[#124734]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#017f36] px-5 font-bold text-white transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
      >
        Retry
      </button>
    </section>
  );
}

export function AccountSidebar({ activeSection = "overview", spacious = false }) {
  return (
    <aside className="hidden xl:block">
      <nav
        aria-label="Account sections"
        className={`sticky top-6 rounded-2xl border border-[#e8e6df] bg-white shadow-[0_5px_22px_rgba(37,41,37,0.05)] ${spacious ? "p-3" : "p-2.5"}`}
      >
        <ul className="space-y-0">
          {sidebarItems.map(({ label, Icon, href, section }) => (
            <li key={label} className="border-b border-[#eceae4] last:border-b-0">
              {href ? (
                <Link
                  href={href}
                  aria-current={activeSection === section ? "page" : undefined}
                  className={`flex items-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] ${spacious ? "min-h-[54px] gap-3 px-3 text-sm" : "min-h-[40px] gap-2.5 px-2.5 text-[13px]"} ${
                    activeSection === section
                      ? "my-0.5 bg-[#08763b] font-bold !text-white"
                      : "font-semibold text-[#303731] hover:bg-[#f3f6f1] hover:text-[#124734]"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                  {label}
                </Link>
              ) : (
                <span
                  className={`flex cursor-not-allowed items-center text-[#687169] ${spacious ? "min-h-[54px] gap-3 px-3 text-sm" : "min-h-[40px] gap-2.5 px-2.5 text-[13px]"}`}
                  aria-disabled="true"
                  title={`${label} is not connected yet`}
                >
                  <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                  <span className="min-w-0 flex-1">{label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8b928b]">Soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function MobileAccountSections() {
  return (
    <nav aria-label="Account overview sections" className="mb-4 grid grid-cols-3 rounded-2xl border border-[#e8e6df] bg-white p-2 shadow-sm xl:hidden">
      <a
        href="#overview"
        aria-current="page"
        className="flex min-h-12 items-center justify-center rounded-xl bg-[#08763b] px-2 text-center text-xs font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:text-sm"
      >
        Overview
      </a>
      <span aria-disabled="true" className="flex min-h-12 flex-col items-center justify-center text-xs font-semibold text-[#687169] sm:text-sm">
        My Orders <span className="text-[9px] font-medium text-[#858b85]">Not connected</span>
      </span>
      <span aria-disabled="true" className="flex min-h-12 flex-col items-center justify-center text-xs font-semibold text-[#687169] sm:text-sm">
        My Rentals <span className="text-[9px] font-medium text-[#858b85]">Not connected</span>
      </span>
    </nav>
  );
}

function ProfileCard({
  account,
  isEditingName,
  nameInput,
  setNameInput,
  nameError,
  setNameError,
  setSaveMessage,
  saving,
  saveName,
  startEditingName,
  cancelEditingName,
  saveMessage,
}) {
  return (
    <section
      id="personal-information"
      aria-labelledby="personal-information-heading"
      className="scroll-mt-24 rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-6 xl:p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734] xl:size-10">
            <FiUser aria-hidden="true" className="size-6 xl:size-5" />
          </span>
          <div>
            <h2 id="personal-information-heading" className="text-lg font-bold text-[#252925] sm:text-xl xl:text-lg">
              Profile information
            </h2>
            <p className="mt-0.5 text-sm text-[#687169] xl:text-xs">Your basic account details.</p>
          </div>
        </div>
        {!account.onboardingCompleted && !isEditingName && (
          <button
            type="button"
            onClick={startEditingName}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-2 text-sm font-bold text-[#08763b] transition-colors hover:bg-[#e9f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:px-3 xl:hidden"
          >
            <FiEdit2 aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Edit profile</span>
            <span className="sm:hidden">Edit</span>
          </button>
        )}
      </div>

      <div className="mt-4 border-t border-[#eceae4] pt-3 xl:mt-2 xl:flex xl:items-center xl:justify-between xl:gap-3 xl:pt-1.5">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#687169] xl:shrink-0 xl:text-sm xl:font-semibold xl:normal-case xl:tracking-normal">Full name</p>
        {isEditingName && !account.onboardingCompleted ? (
          <form className="mt-3 grid gap-3 xl:mt-2 xl:flex-1" onSubmit={saveName}>
            <label className="sr-only" htmlFor="account-full-name">Full name</label>
            <input
              id="account-full-name"
              name="full_name"
              type="text"
              autoComplete="name"
              maxLength={100}
              value={nameInput}
              onChange={(event) => {
                setNameInput(event.target.value);
                setNameError("");
                setSaveMessage("");
              }}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "account-name-error" : undefined}
              className="min-h-12 w-full rounded-xl border border-[#c7cbd1] bg-white px-4 text-base text-[#252925] outline-none transition focus:border-[#789889] focus:ring-2 focus:ring-[#124734]/10"
            />
            {nameError && <p id="account-name-error" className="text-sm text-[#a23d32]" role="alert">{nameError}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#017f36] px-5 font-bold text-white transition-colors hover:bg-[#124734] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
              >
                {saving && <FiLoader aria-hidden="true" className="size-4 animate-spin" />}
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={cancelEditingName}
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#c7cbd1] px-5 font-semibold text-[#303731] transition-colors hover:bg-[#f7f8f5] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 xl:mt-0 xl:flex-1">
            <p className="break-words text-lg font-bold text-[#252925] sm:text-xl xl:text-lg">
              {account.hasFullName ? account.fullName : "Name not added yet"}
            </p>
            {saveMessage && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f5e3] px-3 py-1 text-xs font-bold text-[#155b2d]">
                <FiCheckCircle aria-hidden="true" className="size-3.5" /> Updated
              </span>
            )}
          </div>
        )}
        {account.onboardingCompleted && (
          <p className="mt-2 text-xs leading-5 text-[#687169]">
            Name editing is unavailable for completed accounts under the current profile permissions.
          </p>
        )}
        {saveMessage && <p className="mt-3 text-sm font-semibold text-[#124734]" role="status" aria-live="polite">{saveMessage}</p>}
      </div>
      {!account.onboardingCompleted && !isEditingName && (
        <a
          href="#personal-information"
          onClick={startEditingName}
          className="mt-4 inline-flex min-h-11 items-center gap-3 border-t border-[#eceae4] pt-3 text-sm font-bold text-[#08763b] hover:text-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] xl:mt-1 xl:min-h-8 xl:pt-1.5"
        >
          <FiEdit2 aria-hidden="true" className="size-5" /> Edit profile <FiArrowRight aria-hidden="true" className="size-4" />
        </a>
      )}
    </section>
  );
}

function VerificationCard({ account }) {
  return (
    <section aria-labelledby="account-verification-heading" className="rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-6 xl:p-3.5">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734] xl:size-10">
          <FiShield aria-hidden="true" className="size-6 xl:size-5" />
        </span>
        <div>
          <h2 id="account-verification-heading" className="text-lg font-bold text-[#252925] sm:text-xl xl:text-lg">Account verification</h2>
          <p className="mt-0.5 text-sm text-[#687169] xl:text-xs">Verify your details to keep your account secure.</p>
        </div>
      </div>
      <div className="mt-3 xl:mt-1">
        <StatusRow label="Email verification" verified={account.emailVerified} />
        <StatusRow label="Phone verification" verified={account.phoneVerified} />
      </div>
      <p className="mt-2 text-[11px] leading-4 text-[#687169] xl:mt-1">
        Verification actions are not connected yet.
      </p>
    </section>
  );
}

function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-6 xl:p-3.5">
      <div>
        <h2 id="quick-actions-heading" className="text-lg font-bold text-[#252925] sm:text-xl xl:text-base">Quick actions</h2>
        <p className="mt-1 text-sm text-[#687169] xl:hidden">Frequently used account sections.</p>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:mt-2 xl:grid-cols-4 xl:gap-2.5">
        {quickActions.map(({ label, compactLabel, description, Icon, href }) => (
          <li key={label}>
            {href ? (
              <a href={href} className="group flex min-h-[84px] items-center gap-3 rounded-xl bg-[#edf4eb] p-3 text-[#124734] transition-colors hover:bg-[#e1eddf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] xl:min-h-[54px] xl:gap-2 xl:rounded-lg xl:px-2.5 xl:py-2">
                <Icon aria-hidden="true" className="size-6 shrink-0 xl:size-5" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-[#252925] xl:hidden">{label}</span>
                  <span className="hidden truncate text-sm font-bold text-[#252925] xl:block">{compactLabel}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#59635c] xl:hidden">{description}</span>
                </span>
                <FiArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : (
              <div aria-disabled="true" title={`${label} is not connected yet`} className="flex min-h-[84px] cursor-not-allowed items-center gap-3 rounded-xl bg-[#f1f3ee] p-3 text-[#687169] xl:min-h-[54px] xl:gap-2 xl:rounded-lg xl:px-2.5 xl:py-2">
                <Icon aria-hidden="true" className="size-6 shrink-0 text-[#59705f] xl:size-5" />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-[#3d443e] xl:hidden">{label}</span>
                  <span className="hidden truncate text-sm font-bold text-[#3d443e] xl:block">{compactLabel}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#687169] xl:hidden">{description}</span>
                </span>
                <span className="shrink-0 rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#737b73]">Soon</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function AccountSetupBanner({ account }) {
  return (
    <section aria-label="Account setup status" className="flex flex-col gap-4 rounded-2xl border border-[#e2eadf] bg-[#edf4eb] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 xl:min-h-0 xl:gap-3 xl:px-4 xl:py-2">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d7ecd5] text-[#124734] sm:size-14 xl:size-10">
          {account.onboardingCompleted ? <FiCheckCircle aria-hidden="true" className="size-6" /> : <FiAlertCircle aria-hidden="true" className="size-6" />}
        </span>
        <div>
          <h2 className="text-base font-bold text-[#124734] sm:text-lg xl:text-base">
            {account.onboardingCompleted ? "Account setup complete" : "Complete your account setup"}
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#59635c] xl:mt-0 xl:text-xs xl:leading-4">
            {account.onboardingCompleted
              ? "Your account setup status is complete."
              : "Keep your profile up to date for a smoother rental and purchase experience."}
          </p>
        </div>
      </div>
      <a href="#personal-information" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#08763b] bg-white px-4 text-sm font-bold text-[#124734] transition-colors hover:bg-[#f8fbf7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36] sm:px-5 xl:min-h-9 xl:rounded-lg xl:px-3 xl:text-xs">
        Update Profile
        <FiArrowRight aria-hidden="true" className="size-4" />
      </a>
    </section>
  );
}

function DashboardLoading() {
  return (
    <div className="grid gap-5 xl:grid-cols-[305px_minmax(0,1fr)]" role="status" aria-live="polite">
      <div className="hidden min-h-[470px] animate-pulse rounded-2xl bg-white xl:block" />
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-white" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
        <div className="h-52 animate-pulse rounded-2xl bg-white" />
        <span className="sr-only">Loading your account information…</span>
      </div>
    </div>
  );
}

export function AccountDashboard({
  loading,
  account,
  signInRequired,
  profileMissing,
  pageError,
  retryLoading,
  isEditingName,
  nameInput,
  setNameInput,
  nameError,
  setNameError,
  setSaveMessage,
  saving,
  saveName,
  startEditingName,
  cancelEditingName,
  saveMessage,
}) {
  return (
    <>
      <AccountWelcomeBanner fullName={account?.fullName ?? ""} />

      <main id="overview" className="overflow-x-clip bg-[#f8f7f2] px-4 py-4 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:py-2 xl:pb-2">
        <div className="mx-auto max-w-[1560px]">
          {loading ? (
            <DashboardLoading />
          ) : signInRequired ? (
            <section className="mx-auto max-w-3xl rounded-2xl border border-[#e5e3dc] bg-white p-6 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-8">
              <h2 className="text-xl font-bold text-[#124734]">Sign in to view your account</h2>
              <p className="mt-2 text-sm leading-6 text-[#59635c]">Your session may have expired. Use the Login control in the site header to sign in, then return to this page.</p>
              <Link href="/" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Go to the home page</Link>
            </section>
          ) : profileMissing ? (
            <RetryPanel title="Profile not available" message="We could not find a customer profile for this account. Your account information has not been changed." onRetry={retryLoading} />
          ) : pageError ? (
            <RetryPanel title="Account information unavailable" message={pageError} onRetry={retryLoading} alert />
          ) : account ? (
            <>
              <MobileAccountSections />
              <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-4">
                <AccountSidebar activeSection="overview" />
                <div className="min-w-0 space-y-4 sm:space-y-5 xl:space-y-2.5">
                  <AccountSetupBanner account={account} />
                  <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5 xl:gap-4">
                    <ProfileCard
                      account={account}
                      isEditingName={isEditingName}
                      nameInput={nameInput}
                      setNameInput={setNameInput}
                      nameError={nameError}
                      setNameError={setNameError}
                      setSaveMessage={setSaveMessage}
                      saving={saving}
                      saveName={saveName}
                      startEditingName={startEditingName}
                      cancelEditingName={cancelEditingName}
                      saveMessage={saveMessage}
                    />
                    <VerificationCard account={account} />
                  </div>
                  <QuickActions />
                </div>
              </div>
            </>
          ) : (
            <RetryPanel title="Account information unavailable" message="Account information is not available right now. Please retry." onRetry={retryLoading} />
          )}
        </div>
      </main>
    </>
  );
}

export default AccountDashboard;
