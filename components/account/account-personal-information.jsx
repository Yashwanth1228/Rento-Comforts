"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiLoader,
  FiLock,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiUser,
} from "react-icons/fi";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import { AccountSidebar } from "@/components/account/account-dashboard";

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return `${parts[0].charAt(0)}${parts.at(-1).charAt(0)}`.toUpperCase();
}

function getInitial(fullName) {
  return fullName.trim().charAt(0).toUpperCase();
}

function VerificationStatus({ label, verified }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#eceae4] py-3 last:border-b-0 sm:min-h-16">
      <span className="flex min-w-0 items-center gap-3 text-sm font-semibold text-[#303731] sm:text-base">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full ${
            verified ? "bg-[#e9f1e9] text-[#124734]" : "bg-[#f5f1e9] text-[#715e37]"
          }`}
          aria-hidden="true"
        >
          {verified ? <FiCheckCircle className="size-[18px]" /> : <FiAlertCircle className="size-[18px]" />}
        </span>
        {label}
      </span>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
          verified ? "bg-[#e4f5e3] text-[#155b2d]" : "bg-[#fbf0d9] text-[#715322]"
        }`}
      >
        {verified ? "Verified" : "Not verified"}
      </span>
    </div>
  );
}

function InformationSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-6" role="status" aria-live="polite">
      <div className="h-14 animate-pulse rounded-xl bg-[#edf4eb]" />
      <div className="mt-4 grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden h-64 animate-pulse rounded-xl bg-[#e9f1e9] xl:block" />
        <div className="h-64 animate-pulse rounded-xl bg-[#f3f5f0]" />
      </div>
      <span className="sr-only">Loading your personal information…</span>
    </div>
  );
}

function MobilePersonalInformationHero() {
  return (
    <header
      className="relative isolate mb-4 overflow-hidden bg-[#e9f1e9] xl:hidden"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(233,241,233,0.98) 0%, rgba(233,241,233,0.91) 42%, rgba(233,241,233,0.08) 100%), url('/images/account-welcome-banner-v1.png')",
        backgroundSize: "100% 100%, auto 340px",
        backgroundPosition: "center, 68% 56%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto flex min-h-[178px] max-w-[1560px] items-center px-5 py-6 sm:min-h-[190px] sm:px-7">
        <div className="flex max-w-[82%] items-start gap-3 sm:max-w-[70%]">
          <Link
            href="/account"
            aria-label="Back to account overview"
            className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#124734] hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
          >
            <FiArrowLeft aria-hidden="true" className="size-6" />
          </Link>
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-[#124734] sm:text-3xl">Personal Information</h1>
            <p className="mt-2 max-w-[320px] text-sm leading-6 text-[#3f4841] sm:text-base">
              Manage your personal details and keep your account up to date.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function AccountSetupStep({ label, complete }) {
  return (
    <li className="flex min-w-0 items-center gap-2 text-sm text-[#303731]">
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-full ${
          complete ? "bg-[#d6edda] text-[#08763b]" : "bg-[#f5f1e9] text-[#715e37]"
        }`}
        aria-hidden="true"
      >
        {complete ? <FiCheckCircle className="size-4" /> : <FiAlertCircle className="size-4" />}
      </span>
      <span className="min-w-0">{label}</span>
    </li>
  );
}

function InformationMessage({ title, children, onRetry, signInRequired = false }) {
  return (
    <section
      className="rounded-2xl border border-[#e5e3dc] bg-white p-6 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-8"
      role={signInRequired ? undefined : "alert"}
    >
      <h2 className="text-xl font-bold text-[#124734]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">{children}</p>
      {signInRequired ? (
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
        >
          Go to Login
        </Link>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#017f36] px-5 font-bold text-white transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
        >
          <FiRefreshCw aria-hidden="true" className="size-4" /> Retry
        </button>
      )}
    </section>
  );
}

export default function AccountPersonalInformation() {
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [pageState, setPageState] = useState("loading");
  const [nameInput, setNameInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadAccount() {
      try {
        const [profileResponse, statusResponse] = await Promise.all([
          fetch("/api/account/profile", {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin",
            headers: { Accept: "application/json" },
          }),
          fetch("/api/account/onboarding-status", {
            method: "GET",
            cache: "no-store",
            credentials: "same-origin",
            headers: { Accept: "application/json" },
          }),
        ]);
        const [profileData, statusData] = await Promise.all([
          profileResponse.json().catch(() => null),
          statusResponse.json().catch(() => null),
        ]);

        if (!isCurrentRequest) return;

        if (
          profileResponse.status === 401 ||
          statusResponse.status === 401 ||
          statusData?.authenticated === false
        ) {
          setAccount(null);
          setPageState("signed-out");
          return;
        }

        if (profileResponse.status === 404 || statusData?.profileFound === false) {
          setAccount(null);
          setPageState("missing-profile");
          return;
        }

        if (!profileResponse.ok || !statusResponse.ok) {
          setPageState("error");
          return;
        }

        const profile = profileData?.profile;

        if (
          profileData?.ok !== true ||
          !profile ||
          statusData?.authenticated !== true ||
          statusData?.profileFound !== true
        ) {
          setPageState("error");
          return;
        }

        const fullName = typeof profile.full_name === "string" ? profile.full_name : "";
        const onboardingCompleted =
          statusData.onboardingCompleted === true &&
          profile.onboardingCompleted === true;

        const nextAccount = {
          fullName,
          hasFullName: statusData.hasFullName === true,
          emailVerified: statusData.emailVerified === true,
          phoneVerified: statusData.phoneVerified === true,
          onboardingCompleted,
        };

        setAccount(nextAccount);
        setNameInput(fullName);
        setIsEditing(!onboardingCompleted);
        setPageState("ready");
      } catch {
        if (isCurrentRequest) setPageState("error");
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    }

    loadAccount();
    return () => {
      isCurrentRequest = false;
    };
  }, [retryKey]);

  function retryLoading() {
    setLoading(true);
    setPageState("loading");
    setRetryKey((currentKey) => currentKey + 1);
  }

  function cancelEditing() {
    setNameInput(account?.fullName ?? "");
    setNameError("");
    setSaveMessage("");
    setIsEditing(false);
  }

  async function saveName(event) {
    event.preventDefault();
    const fullName = nameInput.trim();
    const nameLength = Array.from(fullName).length;

    if (nameLength < 1 || nameLength > 100) {
      setNameError("Enter a name between 1 and 100 characters.");
      setSaveMessage("");
      return;
    }

    setSaving(true);
    setNameError("");
    setSaveMessage("");

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: fullName }),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        setAccount(null);
        setPageState("signed-out");
        setIsEditing(false);
        return;
      }

      if (!response.ok || data?.ok !== true || !data?.profile) {
        setNameError(
          response.status === 409
            ? "This profile cannot be edited in its current onboarding state."
            : data?.message || "Your name could not be saved. Please try again."
        );
        return;
      }

      const savedName =
        typeof data.profile.full_name === "string" ? data.profile.full_name : fullName;
      setAccount((currentAccount) =>
        currentAccount
          ? { ...currentAccount, fullName: savedName, hasFullName: true }
          : currentAccount
      );
      setNameInput(savedName);
      setIsEditing(false);
      setSaveMessage("Your name was updated.");
    } catch {
      setNameError("We could not connect to save your name. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const avatarInitials = account ? getInitials(account.fullName) : "";
  const initial = account ? getInitial(account.fullName) : "";
  const accountSteps = account
    ? [
        { label: "Profile details", complete: account.hasFullName },
        { label: "Email verified", complete: account.emailVerified },
        { label: "Phone verified", complete: account.phoneVerified },
      ]
    : [];

  return (
    <>
      <div className="hidden xl:block">
        <AccountWelcomeBanner
          fullName={account?.fullName ?? ""}
          title="My Account"
          description="Manage your profile, orders, rentals, and account preferences."
        />
      </div>
      <MobilePersonalInformationHero />

      <main className="bg-[#f8f7f2] px-4 py-4 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:py-4 xl:pb-6 xl:pl-8 xl:pr-10">
        <div className="mx-auto max-w-[1680px]">
          <div className="grid items-start gap-4 xl:grid-cols-[clamp(250px,19.1vw,320px)_minmax(0,1fr)] xl:gap-5">
            <AccountSidebar activeSection="personal-information" spacious />
            <div className="min-w-0">
              {loading ? (
                <InformationSkeleton />
              ) : pageState === "signed-out" ? (
                <InformationMessage title="Sign in to view your information" signInRequired>
                  Your session may have expired. Sign in using the Login control in the site header, then return here.
                </InformationMessage>
              ) : pageState === "missing-profile" ? (
                <InformationMessage title="Profile not available" onRetry={retryLoading}>
                  We could not find a customer profile for this account. Your profile has not been changed.
                </InformationMessage>
              ) : pageState === "error" ? (
                <InformationMessage title="Personal information unavailable" onRetry={retryLoading}>
                  We could not load your personal information. Check your connection and retry.
                </InformationMessage>
              ) : account ? (
                <div className="space-y-4 xl:space-y-4">
                  <section className="flex items-center gap-4 px-3 py-1 xl:hidden">
                    <span className="grid size-[76px] shrink-0 place-items-center rounded-full bg-[#005a3c] text-3xl font-bold text-white shadow-sm">
                      {avatarInitials || <FiUser aria-hidden="true" className="size-9" />}
                    </span>
                    <div className="min-w-0">
                      <h2 className="break-words text-2xl font-bold text-[#124734]">
                        {account.hasFullName ? account.fullName : "Name not added yet"}
                      </h2>
                      <p className="mt-1 text-sm text-[#59635c]">Rento Comforts customer profile</p>
                    </div>
                  </section>

                  <section className="rounded-[20px] border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,0.035)] sm:p-6 xl:p-4">
                    <header className="hidden items-center gap-[22px] border-b border-[#eceae4] pb-5 xl:mx-[10px] xl:flex">
                      <span className="grid size-[72px] shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]">
                        <FiUser aria-hidden="true" className="size-8" />
                      </span>
                      <div className="min-w-0">
                        <h1 className="text-[28px] font-bold leading-tight text-[#252925]">Personal Information</h1>
                        <p className="mt-1 text-base text-[#687169]">View and manage your account details. Keep your information up to date for a better experience.</p>
                      </div>
                    </header>

                    <div className="mt-4 grid gap-4 xl:mt-0 xl:min-h-[320px] xl:grid-cols-[290px_minmax(0,1fr)] xl:items-start xl:rounded-[16px] xl:border xl:border-[#e8e7e1] xl:px-3 xl:py-[14px]">
                      <aside className="hidden h-[282px] min-h-[282px] flex-col items-center justify-center rounded-[13px] bg-[#e9f4e7] px-5 py-7 text-center xl:flex">
                        <span className="grid size-[108px] place-items-center rounded-full border-[3px] border-white bg-[#005a3c] text-5xl font-bold text-white shadow-[0_2px_5px_rgba(18,71,52,0.16)]">
                          {initial || <FiUser aria-hidden="true" className="size-11" />}
                        </span>
                        <h2 className="mt-3 max-w-full break-words text-[22px] font-bold leading-tight text-[#252925]">
                          {account.hasFullName ? account.fullName : "Name not added yet"}
                        </h2>
                        <p className="mt-1.5 text-base text-[#124734]">Rento Comforts customer</p>
                      </aside>

                      <div className="min-w-0 xl:flex xl:flex-col xl:pl-8 xl:pr-2 xl:pb-1">
                        {isEditing && !account.onboardingCompleted && (
                          <div className="hidden min-h-[45px] items-start justify-end gap-2 xl:flex">
                            <button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#aebdb4] bg-white px-5 text-sm font-semibold text-[#124734] hover:bg-[#f7f8f5] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
                              Cancel
                            </button>
                            <button type="submit" form="personal-information-name-form" disabled={saving} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#017f36] px-6 text-sm font-bold text-white transition-colors hover:bg-[#124734] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
                              {saving ? <FiLoader aria-hidden="true" className="size-4 animate-spin" /> : <FiCheckCircle aria-hidden="true" className="size-4" />}
                              {saving ? "Saving…" : "Save Changes"}
                            </button>
                          </div>
                        )}

                        <div className="divide-y divide-[#eceae4] xl:flex-1">
                          <div className="grid gap-3 py-4 xl:min-h-[64px] xl:grid-cols-[207px_minmax(0,1fr)] xl:items-center xl:gap-0 xl:py-2">
                            <div className="hidden items-center gap-6 text-base font-bold text-[#303731] xl:flex">
                              <FiUser aria-hidden="true" className="size-[22px] shrink-0 text-[#124734]" />
                              <span>Full name</span>
                            </div>
                            <div className="flex items-center gap-3 text-lg font-bold text-[#124734] xl:hidden">
                              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiUser aria-hidden="true" className="size-5" /></span>
                              Full Name
                            </div>
                            {isEditing && !account.onboardingCompleted ? (
                              <form id="personal-information-name-form" onSubmit={saveName} className="min-w-0">
                                <div className="min-w-0">
                                  <label className="sr-only" htmlFor="personal-information-full-name">Full name</label>
                                  <input
                                    id="personal-information-full-name"
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
                                    aria-describedby={nameError ? "personal-information-name-error" : undefined}
                                    className="min-h-11 w-full rounded-lg border border-[#c7cbd1] bg-white px-4 text-base text-[#252925] outline-none transition focus:border-[#789889] focus:ring-2 focus:ring-[#124734]/10 xl:max-w-[365px]"
                                  />
                                  {nameError && <p id="personal-information-name-error" className="mt-1 text-sm text-[#a23d32]" role="alert">{nameError}</p>}
                                </div>
                                <div className="mt-3 flex gap-2 xl:hidden">
                                  <button type="submit" disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#017f36] px-4 text-sm font-bold text-white transition-colors hover:bg-[#124734] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
                                    {saving ? <FiLoader aria-hidden="true" className="size-4 animate-spin" /> : <FiCheckCircle aria-hidden="true" className="size-4" />}
                                    {saving ? "Saving…" : "Save Changes"}
                                  </button>
                                  <button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#aebdb4] px-4 text-sm font-semibold text-[#124734] hover:bg-[#f7f8f5] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="break-words text-base font-semibold text-[#252925] sm:text-lg">
                                  {account.hasFullName ? account.fullName : "Name not added yet"}
                                </p>
                                {account.onboardingCompleted ? (
                                  <span className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#f3f5f0] px-3 text-sm font-semibold text-[#59635c]">
                                    <FiLock aria-hidden="true" className="size-4" /> Read only
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNameInput(account.fullName);
                                      setNameError("");
                                      setSaveMessage("");
                                      setIsEditing(true);
                                    }}
                                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#08763b] px-4 text-sm font-bold text-[#124734] hover:bg-[#e9f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
                                  >
                                    Edit name
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="hidden min-h-[58px] grid-cols-[221px_minmax(0,1fr)_auto] items-center gap-0 py-2.5 xl:grid">
                            <div className="flex items-center gap-6 text-base font-bold text-[#303731]">
                              <FiMail aria-hidden="true" className="size-[22px] shrink-0 text-[#124734]" /> Email address
                            </div>
                            <span className="text-sm text-[#687169]" aria-label="Email address value not provided by the current account APIs">—</span>
                            <StatusBadge verified={account.emailVerified} />
                          </div>

                          <div className="hidden min-h-[58px] grid-cols-[221px_minmax(0,1fr)_auto] items-center gap-0 py-2.5 xl:grid">
                            <div className="flex items-center gap-6 text-base font-bold text-[#303731]">
                              <FiPhone aria-hidden="true" className="size-[22px] shrink-0 text-[#124734]" /> Mobile number
                            </div>
                            <span className="text-sm text-[#687169]" aria-label="Mobile number value not provided by the current account APIs">—</span>
                            <StatusBadge verified={account.phoneVerified} />
                          </div>

                          <div className="hidden min-h-[58px] grid-cols-[221px_minmax(0,1fr)_auto] items-center gap-0 py-2.5 xl:grid">
                            <div className="flex items-center gap-6 text-base font-bold text-[#303731]">
                              <FiShield aria-hidden="true" className="size-[22px] shrink-0 text-[#124734]" /> Account setup
                            </div>
                            <span className="text-sm text-[#59635c]">{account.onboardingCompleted ? "Profile setup complete" : "Profile setup pending"}</span>
                            <StatusBadge verified={account.onboardingCompleted} completeLabel="Complete" pendingLabel="Pending" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {saveMessage && <p className="mt-3 text-sm font-semibold text-[#155b2d] xl:text-right" role="status" aria-live="polite">{saveMessage}</p>}
                  </section>

                  <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.045)] xl:hidden">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiShield aria-hidden="true" className="size-5" /></span>
                      <div>
                        <h2 className="text-lg font-bold text-[#252925]">Contact Verification</h2>
                        <p className="mt-0.5 text-sm leading-5 text-[#687169]">Your contact details are used for account verification.</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <VerificationStatus label="Email address" verified={account.emailVerified} />
                      <VerificationStatus label="Mobile number" verified={account.phoneVerified} />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#687169]">Contact values are not provided by the current account APIs.</p>
                  </section>

                  <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.045)] xl:hidden">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiCheckCircle aria-hidden="true" className="size-5" /></span>
                      <div>
                        <h2 className="text-lg font-bold text-[#252925]">Account Setup</h2>
                        <p className="mt-0.5 text-sm leading-5 text-[#687169]">{account.onboardingCompleted ? "Your account setup is complete." : "Your account setup is still pending."}</p>
                      </div>
                    </div>
                    <ul className="mt-4 grid gap-3 rounded-xl bg-[#edf4eb] p-4 sm:grid-cols-3">
                      {accountSteps.map((step) => <AccountSetupStep key={step.label} {...step} />)}
                    </ul>
                  </section>

                  {(!account.emailVerified || !account.phoneVerified || !account.onboardingCompleted) && (
                    <aside className="hidden min-h-[86px] items-center justify-between gap-5 rounded-[14px] border border-[#dce9d9] bg-[#edf4eb] px-6 py-4 text-[#124734] xl:flex" aria-live="polite">
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="grid size-[54px] shrink-0 place-items-center rounded-full bg-[#d8eed5] text-[#08763b]">
                          <FiAlertCircle aria-hidden="true" className="size-7" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold">{!account.phoneVerified ? "Your account is almost complete!" : "Your account setup is still in progress"}</h2>
                          <p className="mt-1 text-sm leading-5 text-[#59635c]">
                            {!account.phoneVerified
                              ? "Your phone verification status is shown above. Mobile verification is not connected yet."
                              : "Your verification and onboarding status are shown from your account records."}
                          </p>
                        </div>
                      </div>
                      <span aria-disabled="true" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#08763b] bg-white px-5 text-sm font-bold text-[#124734]">
                        Verification unavailable
                      </span>
                    </aside>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function StatusBadge({ verified, completeLabel = "Verified", pendingLabel = "Not verified" }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold sm:px-3 sm:text-sm ${verified ? "bg-[#e4f5e3] text-[#155b2d]" : "bg-[#fbf0d9] text-[#715322]"}`}>
      {verified ? <FiCheckCircle aria-hidden="true" className="size-4" /> : <FiAlertCircle aria-hidden="true" className="size-4" />}
      {verified ? completeLabel : pendingLabel}
    </span>
  );
}
