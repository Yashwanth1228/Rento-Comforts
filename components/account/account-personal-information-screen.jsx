"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheck,
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

function StatusBadge({ verified, completeLabel = "Verified", pendingLabel = "Not Verified" }) {
  return (
    <span className={`inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold ${verified ? "bg-[#e4f5e3] text-[#155b2d]" : "bg-[#fff0cf] text-[#8a4e0a]"}`}>
      {verified ? <FiCheckCircle aria-hidden="true" className="size-4" /> : <FiAlertCircle aria-hidden="true" className="size-4" />}
      {verified ? completeLabel : pendingLabel}
    </span>
  );
}

function MobileStatusRow({ label, verified }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#eceae4] py-3 last:border-b-0">
      <span className="flex min-w-0 items-center gap-3 text-sm font-semibold text-[#303731]">
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${verified ? "bg-[#e9f1e9] text-[#124734]" : "bg-[#f5f1e9] text-[#715e37]"}`}>
          {verified ? <FiCheckCircle aria-hidden="true" className="size-5" /> : <FiAlertCircle aria-hidden="true" className="size-5" />}
        </span>
        {label}
      </span>
      <StatusBadge verified={verified} />
    </div>
  );
}

function MobileHero() {
  return (
    <header
      className="relative isolate mb-4 overflow-hidden bg-[#e9f1e9] xl:hidden"
      style={{
        backgroundImage: "linear-gradient(90deg, rgba(233,241,233,0.98) 0%, rgba(233,241,233,0.91) 42%, rgba(233,241,233,0.08) 100%), url('/images/account-welcome-banner-v1.png')",
        backgroundSize: "100% 100%, auto 340px",
        backgroundPosition: "center, 68% 56%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto flex min-h-[178px] max-w-[1560px] items-center px-5 py-6 sm:min-h-[190px] sm:px-7">
        <div className="flex max-w-[82%] items-start gap-3 sm:max-w-[70%]">
          <Link href="/account" aria-label="Back to account overview" className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[#124734] hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
            <FiArrowLeft aria-hidden="true" className="size-6" />
          </Link>
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-[#124734] sm:text-3xl">Personal Information</h1>
            <p className="mt-2 max-w-[320px] text-sm leading-6 text-[#3f4841] sm:text-base">Manage your personal details and keep your account up to date.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-2xl border border-[#e5e3dc] bg-white p-5" role="status" aria-live="polite">
      <div className="h-16 animate-pulse rounded-xl bg-[#edf4eb]" />
      <div className="mt-4 grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
        <div className="hidden h-[252px] animate-pulse rounded-xl bg-[#e9f1e9] xl:block" />
        <div className="h-[252px] animate-pulse rounded-xl bg-[#f3f5f0]" />
      </div>
      <span className="sr-only">Loading personal information</span>
    </div>
  );
}

function StateCard({ title, message, retry, signedOut = false }) {
  return (
    <section className="rounded-2xl border border-[#e5e3dc] bg-white p-6 sm:p-8" role={signedOut ? undefined : "alert"}>
      <h2 className="text-xl font-bold text-[#124734]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">{message}</p>
      {signedOut ? (
        <Link href="/" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#017f36] px-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Go to Login</Link>
      ) : (
        <button type="button" onClick={retry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"><FiRefreshCw aria-hidden="true" className="size-4" /> Retry</button>
      )}
    </section>
  );
}

function SetupStep({ label, complete }) {
  return (
    <li className="flex min-w-0 items-center gap-2 text-sm text-[#303731]">
      <span className={`grid size-6 shrink-0 place-items-center rounded-full ${complete ? "bg-[#d6edda] text-[#08763b]" : "bg-[#f5f1e9] text-[#715e37]"}`}>
        {complete ? <FiCheckCircle aria-hidden="true" className="size-4" /> : <FiAlertCircle aria-hidden="true" className="size-4" />}
      </span>
      <span>{label}</span>
    </li>
  );
}

export default function AccountPersonalInformationScreen() {
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
    let current = true;

    async function loadAccount() {
      try {
        const [profileResponse, statusResponse] = await Promise.all([
          fetch("/api/account/profile", { method: "GET", cache: "no-store", credentials: "same-origin", headers: { Accept: "application/json" } }),
          fetch("/api/account/onboarding-status", { method: "GET", cache: "no-store", credentials: "same-origin", headers: { Accept: "application/json" } }),
        ]);
        const [profileData, statusData] = await Promise.all([
          profileResponse.json().catch(() => null),
          statusResponse.json().catch(() => null),
        ]);
        if (!current) return;

        if (profileResponse.status === 401 || statusResponse.status === 401 || statusData?.authenticated === false) {
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
        if (profileData?.ok !== true || !profile || statusData?.authenticated !== true || statusData?.profileFound !== true) {
          setPageState("error");
          return;
        }

        const fullName = typeof profile.full_name === "string" ? profile.full_name : "";
        const onboardingCompleted = statusData.onboardingCompleted === true && profile.onboardingCompleted === true;
        setAccount({
          fullName,
          hasFullName: statusData.hasFullName === true,
          emailVerified: statusData.emailVerified === true,
          phoneVerified: statusData.phoneVerified === true,
          onboardingCompleted,
        });
        setNameInput(fullName);
        setIsEditing(!onboardingCompleted);
        setPageState("ready");
      } catch {
        if (current) setPageState("error");
      } finally {
        if (current) setLoading(false);
      }
    }

    loadAccount();
    return () => { current = false; };
  }, [retryKey]);

  function retry() {
    setLoading(true);
    setPageState("loading");
    setRetryKey((value) => value + 1);
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
    const length = Array.from(fullName).length;
    if (length < 1 || length > 100) {
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
        headers: { Accept: "application/json", "Content-Type": "application/json" },
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
        setNameError(response.status === 409 ? "This profile cannot be edited in its current onboarding state." : data?.message || "Your name could not be saved. Please try again.");
        return;
      }

      const savedName = typeof data.profile.full_name === "string" ? data.profile.full_name : fullName;
      setAccount((value) => value ? { ...value, fullName: savedName, hasFullName: true } : value);
      setNameInput(savedName);
      setIsEditing(false);
      setSaveMessage("Your name was updated.");
    } catch {
      setNameError("We could not connect to save your name. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const initial = account?.fullName.trim().charAt(0).toUpperCase() || "";
  const initials = account?.fullName.trim().split(/\s+/).filter(Boolean).map((part) => part.charAt(0)).slice(0, 2).join("").toUpperCase() || "";
  const steps = account ? [
    { label: "Profile details", complete: account.hasFullName },
    { label: "Email verified", complete: account.emailVerified },
    { label: "Phone verified", complete: account.phoneVerified },
  ] : [];

  return (
    <>
      <div className="hidden xl:block">
        <AccountWelcomeBanner fullName={account?.fullName ?? ""} title="My Account" description="Manage your profile, orders, rentals, and account preferences." />
      </div>
      <MobileHero />

      <main className="bg-[#f8f7f2] px-4 py-4 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:py-4 xl:pb-6 xl:pl-0 xl:pr-4">
        <div className="mx-auto max-w-[1640px] xl:h-full xl:min-h-0">
          <div className="min-w-0">
              {loading ? <LoadingCard /> : pageState === "signed-out" ? (
                <StateCard title="Sign in to view your information" message="Your session may have expired. Sign in using the Login control in the site header, then return here." signedOut />
              ) : pageState === "missing-profile" ? (
                <StateCard title="Profile not available" message="We could not find a customer profile for this account. Your profile has not been changed." retry={retry} />
              ) : pageState === "error" ? (
                <StateCard title="Personal information unavailable" message="We could not load your personal information. Check your connection and retry." retry={retry} />
              ) : account ? (
                <div className="space-y-3 xl:space-y-2.5">
                  <div className="flex items-center gap-4 px-3 py-1 xl:hidden">
                    <span className="grid size-[76px] shrink-0 place-items-center rounded-full bg-[#005a3c] text-3xl font-bold text-white shadow-sm">{initials || <FiUser aria-hidden="true" className="size-9" />}</span>
                    <div className="min-w-0">
                      <p className="break-words text-2xl font-bold text-[#124734]">{account.hasFullName ? account.fullName : "Name not added yet"}</p>
                      <p className="mt-1 text-sm text-[#59635c]">Rento Comforts customer profile</p>
                    </div>
                  </div>

                  <section className="rounded-[16px] border border-[#e7e5df] bg-white p-3 shadow-[0_3px_15px_rgba(37,41,37,0.035)] sm:p-4 xl:p-2.5">
                    <header className="hidden items-center gap-3 xl:mx-2 xl:flex">
                      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiUser aria-hidden="true" className="size-6" /></span>
                      <div className="min-w-0">
                        <h2 className="text-[22px] font-bold leading-tight text-[#252925]">Personal Information</h2>
                        <p className="mt-1 text-[13px] text-[#555d57]">View and manage your account details. Keep your information up to date for a better experience.</p>
                      </div>
                    </header>

                    <div className="mt-3 grid gap-3 rounded-[14px] border border-[#ecebe6] p-2.5 xl:mt-3 xl:min-h-[238px] xl:grid-cols-[220px_minmax(0,1fr)] xl:items-center xl:gap-3 xl:p-2.5">
                      <aside className="hidden h-[218px] flex-col items-center justify-center rounded-[12px] bg-[#e9f4e7] px-3 text-center xl:flex">
                        <span className="grid size-[82px] place-items-center rounded-full border-[3px] border-white bg-[#005a3c] text-[36px] font-bold text-white shadow-sm">{initial || <FiUser aria-hidden="true" className="size-9" />}</span>
                        <h3 className="mt-2.5 max-w-full break-words text-[18px] font-bold leading-tight text-[#252925]">{account.hasFullName ? account.fullName : "Name not added yet"}</h3>
                        <p className="mt-1 text-[12px] text-[#124734]">Rento Comforts customer</p>
                        <span className="mt-2 inline-flex min-h-6 items-center gap-1.5 rounded-full bg-[#dff1dd] px-2.5 text-[11px] font-semibold text-[#155b2d]" aria-label="Membership date is not provided by the current account APIs">
                          <FiCalendar aria-hidden="true" className="size-3.5" />
                          Member since —
                        </span>
                      </aside>

                      <div className="min-w-0 xl:px-2">
                        {isEditing && !account.onboardingCompleted && (
                          <div className="hidden min-h-[40px] items-start xl:grid" style={{ gridTemplateColumns: "160px minmax(0, min(325px, calc(100% - 380px))) minmax(0, 1fr)" }}>
                            <div className="col-start-3 flex items-center gap-2">
                              <button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex min-h-[34px] min-w-[76px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[#9db6a9] bg-white px-3 text-xs font-semibold text-[#124734] hover:bg-[#f7f8f5] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Cancel</button>
                              <button type="submit" form="personal-information-name-form-v2" disabled={saving} className="inline-flex min-h-[34px] min-w-[136px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#087b3d] px-3 text-xs font-bold text-white shadow-sm hover:bg-[#124734] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
                                {saving ? <FiLoader aria-hidden="true" className="size-3.5 animate-spin" /> : <FiCheck aria-hidden="true" className="size-3.5" />}
                                {saving ? "Saving..." : "Save Changes"}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="divide-y divide-[#e9ebe5]">
                          <div className="grid gap-3 py-4 xl:min-h-[42px] xl:items-center xl:gap-0 xl:py-0.5 xl:pb-2" style={{ gridTemplateColumns: "160px minmax(0, min(325px, calc(100% - 380px)))" }}>
                            <div className="hidden items-center gap-4 text-[13px] font-bold text-[#252925] xl:flex"><FiUser aria-hidden="true" className="size-5 shrink-0 text-[#124734]" />Full name</div>
                            <div className="flex items-center gap-3 text-lg font-bold text-[#124734] xl:hidden"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e9f1e9]"><FiUser aria-hidden="true" className="size-5" /></span>Full Name</div>
                            {isEditing && !account.onboardingCompleted ? (
                              <form id="personal-information-name-form-v2" onSubmit={saveName} className="min-w-0">
                                <label className="sr-only" htmlFor="personal-information-full-name-v2">Full name</label>
                                <input id="personal-information-full-name-v2" name="full_name" type="text" autoComplete="name" maxLength={100} value={nameInput} onChange={(event) => { setNameInput(event.target.value); setNameError(""); setSaveMessage(""); }} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? "personal-information-name-error-v2" : undefined} className="min-h-[38px] w-full rounded-lg border border-[#cdd1d3] bg-white px-4 text-[13px] text-[#252925] outline-none focus:border-[#789889] focus:ring-2 focus:ring-[#124734]/10 xl:max-w-[325px]" />
                                {nameError && <p id="personal-information-name-error-v2" className="mt-1 text-xs text-[#a23d32]" role="alert">{nameError}</p>}
                                <div className="mt-3 flex gap-2 xl:hidden">
                                  <button type="submit" disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#087b3d] px-4 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
                                  <button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#9db6a9] px-4 text-sm font-semibold text-[#124734] disabled:opacity-60">Cancel</button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="break-words text-[15px] font-semibold text-[#252925]">{account.hasFullName ? account.fullName : "Name not added yet"}</p>
                                {account.onboardingCompleted ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#59635c]"><FiLock aria-hidden="true" className="size-4" /> Read only</span> : <button type="button" onClick={() => { setNameInput(account.fullName); setNameError(""); setSaveMessage(""); setIsEditing(true); }} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#08763b] px-3 text-sm font-semibold text-[#124734] hover:bg-[#e9f1e9]">Edit name</button>}
                              </div>
                            )}
                          </div>

                          <div className="hidden min-h-[42px] grid-cols-[160px_minmax(0,1fr)_auto] items-center gap-0 py-0.5 xl:grid">
                            <div className="flex items-center gap-4 text-[13px] font-bold text-[#252925]"><FiMail aria-hidden="true" className="size-5 shrink-0 text-[#124734]" />Email address</div>
                            <span className="text-[13px] text-[#59635c]" aria-label="Email address value is not provided by the current account APIs">-</span>
                            <StatusBadge verified={account.emailVerified} />
                          </div>
                          <div className="hidden min-h-[42px] grid-cols-[160px_minmax(0,1fr)_auto] items-center gap-0 py-0.5 xl:grid">
                            <div className="flex items-center gap-4 text-[13px] font-bold text-[#252925]"><FiPhone aria-hidden="true" className="size-5 shrink-0 text-[#124734]" />Mobile number</div>
                            <span className="text-[13px] text-[#59635c]" aria-label="Mobile number value is not provided by the current account APIs">-</span>
                            <StatusBadge verified={account.phoneVerified} />
                          </div>
                          <div className="hidden min-h-[42px] grid-cols-[160px_minmax(0,1fr)_auto] items-center gap-0 py-0.5 xl:grid">
                            <div className="flex items-center gap-4 text-[13px] font-bold text-[#252925]"><FiShield aria-hidden="true" className="size-5 shrink-0 text-[#124734]" />Account setup</div>
                            <span className="text-[13px] text-[#59635c]">{account.onboardingCompleted ? "Profile details completed" : "Profile setup pending"}</span>
                            <StatusBadge verified={account.onboardingCompleted} completeLabel="Completed" pendingLabel="Pending" />
                          </div>
                        </div>
                        {saveMessage && <p className="mt-2 text-xs font-semibold text-[#155b2d]" role="status" aria-live="polite">{saveMessage}</p>}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 xl:hidden">
                    <h2 className="text-lg font-bold text-[#252925]">Contact Verification</h2>
                    <p className="mt-1 text-sm text-[#687169]">Your contact details are used for account verification.</p>
                    <div className="mt-3"><MobileStatusRow label="Email address" verified={account.emailVerified} /><MobileStatusRow label="Mobile number" verified={account.phoneVerified} /></div>
                    <p className="mt-2 text-xs leading-5 text-[#687169]">Contact values are not provided by the current account APIs.</p>
                  </section>

                  <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 xl:hidden">
                    <h2 className="text-lg font-bold text-[#252925]">Account Setup</h2>
                    <p className="mt-1 text-sm leading-5 text-[#687169]">{account.onboardingCompleted ? "Your account setup is complete." : "Your account setup is still pending."}</p>
                    <ul className="mt-4 grid gap-3 rounded-xl bg-[#edf4eb] p-4 sm:grid-cols-3">{steps.map((step) => <SetupStep key={step.label} {...step} />)}</ul>
                  </section>

                  {(!account.emailVerified || !account.phoneVerified || !account.onboardingCompleted) && (
                    <aside className="flex min-h-[68px] flex-col justify-between gap-3 rounded-[12px] border border-[#dce9d9] bg-[#edf4eb] px-4 py-2.5 sm:flex-row sm:items-center sm:px-5 xl:min-h-[68px] xl:px-4" aria-live="polite">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d8eed5] text-[#08763b]"><FiCheckCircle aria-hidden="true" className="size-5" /></span>
                        <div className="min-w-0">
                          <h2 className="text-[14px] font-bold text-[#124734]">{!account.phoneVerified ? "Your account is almost complete!" : "Your account setup is in progress"}</h2>
                          <p className="mt-0.5 text-xs leading-4 text-[#59635c]">{!account.phoneVerified ? "Your phone verification status is shown above. Mobile verification is not connected yet." : "Your current verification and account setup statuses are shown above."}</p>
                        </div>
                      </div>
                      <span aria-disabled="true" className="inline-flex min-h-9 shrink-0 items-center justify-center self-start rounded-lg border border-[#08763b] bg-white px-4 text-xs font-bold text-[#124734] sm:self-center">Verification not available yet</span>
                    </aside>
                  )}
                </div>
              ) : null}
          </div>
        </div>
      </main>
    </>
  );
}
