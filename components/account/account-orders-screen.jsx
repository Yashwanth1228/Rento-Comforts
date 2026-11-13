"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiBox,
  FiRefreshCw,
} from "react-icons/fi";
import AccountOrdersEmptyState from "@/components/account/account-orders-empty-state";
import { AccountSidebar } from "@/components/account/account-dashboard";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";

export function MobileOrdersHero({ populated = false }) {
  const heroImage = populated ? "/images/orders-populated-mobile-hero.png" : "/images/orders-mobile-hero.png";
  return (
    <header
      className="mobile-orders-hero relative isolate overflow-hidden bg-[#f8f2e9] xl:hidden"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(248,247,242,0.98) 0%, rgba(248,247,242,0.94) 39%, rgba(248,247,242,0.36) 66%, rgba(248,247,242,0.02) 100%), url('${heroImage}')`,
        backgroundSize: "100% 100%, auto 85%",
        backgroundPosition: "center, right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto flex min-h-[122px] max-w-[1560px] items-center px-6 py-3 sm:min-h-[150px] sm:px-7">
        <div className="max-w-[64%] sm:max-w-[60%]">
          <h1 className="font-serif text-[32px] font-bold leading-tight text-[#124734] sm:text-[36px]">My Orders</h1>
          <p className="mt-1 max-w-[310px] text-base leading-6 text-[#454c47]">
            View and track your purchase and rental orders.
          </p>
        </div>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 xl:grid-cols-[clamp(280px,19.6vw,328px)_minmax(0,1fr)] xl:gap-4" role="status" aria-live="polite">
      <div className="hidden min-h-[500px] animate-pulse rounded-2xl bg-white xl:block" />
      <div className="min-h-[540px] animate-pulse rounded-2xl bg-white" />
      <span className="sr-only">Checking your account...</span>
    </div>
  );
}

function AccountState({ title, message, retry, signedOut = false }) {
  return (
    <section className="rounded-2xl border border-[#e5e3dc] bg-white p-6 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-8" role={signedOut ? undefined : "alert"}>
      <h2 className="text-xl font-bold text-[#124734]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">{message}</p>
      {signedOut ? (
        <Link href="/" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
          Go to the home page
        </Link>
      ) : (
        <button type="button" onClick={retry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
          <FiRefreshCw aria-hidden="true" className="size-4" /> Retry
        </button>
      )}
    </section>
  );
}

export default function AccountOrdersScreen() {
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [pageState, setPageState] = useState("loading");

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

        setAccount({ fullName: typeof profile.full_name === "string" ? profile.full_name : "" });
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

  return (
    <>
      <div className="hidden xl:block">
        <AccountWelcomeBanner fullName={account?.fullName ?? ""} title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact />
      </div>
      <MobileOrdersHero />

      <main className="mobile-orders-main bg-[#f8f7f2] px-3 py-3 pb-28 sm:px-7 sm:py-5 lg:px-10 xl:py-2 xl:pb-3 xl:pl-8 xl:pr-4">
        <div className="mx-auto max-w-[1640px]">
          {loading ? <LoadingState /> : pageState === "signed-out" ? (
            <AccountState title="Sign in to view your account" message="Your session may have expired. Sign in using the Login control in the site header, then return here." signedOut />
          ) : pageState === "missing-profile" ? (
            <AccountState title="Account profile not available" message="We could not find a customer profile for this account." retry={retry} />
          ) : pageState === "error" ? (
            <AccountState title="Account information unavailable" message="We could not verify your account right now. Check your connection and try again." retry={retry} />
          ) : account ? (
            <div className="grid items-start gap-4 xl:grid-cols-[clamp(280px,19.6vw,328px)_minmax(0,1fr)] xl:gap-4">
              <AccountSidebar activeSection="orders" />
              <section className="account-orders-panel min-w-0 rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-5 xl:p-5">
                <header className="hidden items-center gap-4 border-b border-[#eceae4] pb-3 xl:flex">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e9f1e9] text-[#124734]"><FiBox aria-hidden="true" className="size-7" /></span>
                  <div>
                    <h2 className="text-[28px] font-bold leading-tight text-[#252925]">My Orders</h2>
                    <p className="mt-1 text-base text-[#59635c]">View and track your purchases and rentals in one place.</p>
                  </div>
                </header>
                <AccountOrdersEmptyState />
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-4 flex justify-center xl:justify-start">
                    <Link href="/dev/orders-preview" className="rounded-full border border-[#b8d2bf] bg-[#f3f8f1] px-4 py-2 text-xs font-semibold text-[#124734] hover:bg-[#e9f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">
                      Sample Orders — UI Preview
                    </Link>
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
