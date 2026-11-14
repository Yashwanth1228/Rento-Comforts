"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import AccountRentalsEmptyState from "@/components/account/account-rentals-empty-state";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";

function RentalsWelcomeHero() {
  return (
    <header
      className="account-rentals-mobile-hero relative isolate overflow-hidden bg-[#f8f2e9] xl:hidden"
      style={{ backgroundImage: "linear-gradient(90deg, rgba(248,247,242,.98) 0%, rgba(248,247,242,.92) 47%, rgba(248,247,242,.18) 100%), url('/images/account-welcome-banner-v1.png')" }}
    >
      <div className="mx-auto flex min-h-[142px] max-w-[1560px] items-center px-5 py-4 sm:min-h-[158px] sm:px-8">
        <div className="max-w-[78%] sm:max-w-[70%]">
          <h1 className="text-[32px] font-bold leading-tight text-[#124734] sm:text-[36px]">My Rentals</h1>
          <p className="mt-1 max-w-[420px] text-base leading-6 text-[#454c47] sm:text-lg">Manage your active rentals, payments, and renewals.</p>
        </div>
      </div>
    </header>
  );
}

function RentalAccountMessage({ title, message, retry, signedOut = false }) {
  return (
    <section className="rounded-2xl border border-[#e5e3dc] bg-white p-6 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-8" role={signedOut ? undefined : "alert"}>
      <div className="flex items-center gap-3 text-[#124734]">
        <FiAlertCircle aria-hidden="true" className="size-5" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">{message}</p>
      {signedOut ? (
        <Link href="/" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Go to the home page</Link>
      ) : (
        <button type="button" onClick={retry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
          <FiRefreshCw aria-hidden="true" className="size-4" /> Retry
        </button>
      )}
    </section>
  );
}

export default function AccountRentalsScreen() {
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState("loading");

  useEffect(() => {
    let current = true;

    async function verifyAccount() {
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
          setPageState("signed-out");
        } else if (profileResponse.status === 404 || statusData?.profileFound === false) {
          setPageState("missing-profile");
        } else if (!profileResponse.ok || !statusResponse.ok || profileData?.ok !== true || !profileData?.profile || statusData?.authenticated !== true || statusData?.profileFound !== true) {
          setPageState("error");
        } else {
          setPageState("ready");
        }
      } catch {
        if (current) setPageState("error");
      } finally {
        if (current) setLoading(false);
      }
    }

    verifyAccount();
    return () => { current = false; };
  }, [retryKey]);

  function retry() {
    setLoading(true);
    setPageState("loading");
    setRetryKey((value) => value + 1);
  }

  return (
    <>
      <div className="hidden xl:block">
        <AccountWelcomeBanner title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact />
      </div>
      <RentalsWelcomeHero />
      <main className="account-rentals-main bg-[#f8f7f2] px-3 py-3 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:px-0 xl:py-3 xl:pb-5">
        <div className="mx-auto max-w-[1640px]">
          {loading ? (
            <div className="min-h-[360px] animate-pulse rounded-2xl bg-white" role="status" aria-live="polite"><span className="sr-only">Checking your account…</span></div>
          ) : pageState === "ready" ? (
            <AccountRentalsEmptyState />
          ) : pageState === "signed-out" ? (
            <RentalAccountMessage title="Sign in to view your rentals" message="Your session may have expired. Sign in using the Login control in the site header, then return here." signedOut />
          ) : pageState === "missing-profile" ? (
            <RentalAccountMessage title="Account profile not available" message="We could not find a customer profile for this account." retry={retry} />
          ) : (
            <RentalAccountMessage title="Account information unavailable" message="We could not verify your account right now. Check your connection and try again." retry={retry} />
          )}
        </div>
      </main>
    </>
  );
}
