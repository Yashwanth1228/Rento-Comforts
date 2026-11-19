"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiClock, FiRefreshCw } from "react-icons/fi";
import AccountPageContainer from "@/components/account/account-page-container";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";

export default function AccountPaymentsScreen() {
  const [pageState, setPageState] = useState("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    let current = true;
    async function verifyAccount() {
      try {
        const [profileResponse, statusResponse] = await Promise.all([
          fetch("/api/account/profile", { method: "GET", cache: "no-store", credentials: "same-origin", headers: { Accept: "application/json" } }),
          fetch("/api/account/onboarding-status", { method: "GET", cache: "no-store", credentials: "same-origin", headers: { Accept: "application/json" } }),
        ]);
        const [profileData, statusData] = await Promise.all([
          profileResponse.json().catch(() => null), statusResponse.json().catch(() => null),
        ]);
        if (!current) return;
        if (profileResponse.status === 401 || statusResponse.status === 401 || statusData?.authenticated === false) setPageState("signed-out");
        else if (profileResponse.status === 404 || statusData?.profileFound === false) setPageState("missing-profile");
        else if (!profileResponse.ok || !statusResponse.ok || profileData?.ok !== true || !profileData?.profile || statusData?.authenticated !== true || statusData?.profileFound !== true) setPageState("error");
        else {
          setFullName(typeof profileData.profile.full_name === "string" ? profileData.profile.full_name : "");
          setPageState("ready");
        }
      } catch {
        if (current) setPageState("error");
      }
    }
    verifyAccount();
    return () => { current = false; };
  }, [retryKey]);

  function retry() {
    setPageState("loading");
    setRetryKey((value) => value + 1);
  }

  return (
    <>
      <div className="hidden xl:block"><AccountWelcomeBanner fullName={fullName} title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact /></div>
      <main className="bg-[#f8f7f2] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-8 lg:px-10 xl:px-0 xl:py-4">
        <AccountPageContainer className="min-w-0 rounded-2xl border border-[#e5e3dc] bg-white p-4 shadow-[0_5px_22px_rgba(37,41,37,0.045)] sm:p-5">
          <header className="mb-4 sm:mb-5">
            <h1 className="text-[27px] font-extrabold leading-tight text-[#124734] sm:text-[32px]">Payments &amp; Invoices</h1>
            <p className="mt-1.5 text-sm leading-6 text-[#59635c] sm:text-base">Track your rental payments, invoices, receipts, and deposit refunds in one place.</p>
          </header>
          {pageState === "loading" ? (
            <div className="min-h-80 animate-pulse rounded-2xl bg-white" role="status"><span className="sr-only">Checking your account...</span></div>
          ) : pageState === "ready" ? (
            <section aria-labelledby="payments-empty-title" className="flex min-w-0 flex-col items-center px-1 py-3 text-center sm:px-3 sm:py-4">
              <Image src="/images/payments-empty-illustration.png" width={1536} height={1024} alt="" className="h-auto w-full max-w-[620px] object-contain" priority />
              <h2 id="payments-empty-title" className="mt-2 max-w-[700px] text-[25px] font-extrabold leading-tight text-[#124734] sm:text-[30px]">No payment history available yet</h2>
              <p className="mt-3 max-w-[700px] text-sm leading-6 text-[#59635c] sm:text-base">Your payment history, invoices, receipts, and refunds will appear here once billing is connected.</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e4f4dd] px-4 py-2 text-sm font-bold text-[#155b2d]"><FiClock aria-hidden="true" className="size-4" />Billing features coming soon</p>
              <div className="mt-5 flex w-full max-w-[520px] flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/account/orders" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#08763b] px-5 py-3 text-sm font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">View My Orders</Link>
                <Link href="/account/rentals" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#08763b] bg-white px-5 py-3 text-sm font-bold text-[#124734] hover:bg-[#e9f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">View My Rentals</Link>
              </div>
              {process.env.NODE_ENV === "development" && <Link href="/account/payments/preview" className="mt-5 rounded-full border border-[#b8d2bf] bg-[#f3f8f1] px-4 py-2 text-xs font-semibold text-[#124734] hover:bg-[#e9f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]">Open sample payments preview</Link>}
            </section>
          ) : (
            <section className="rounded-xl border border-[#e5e3dc] bg-white p-6" role={pageState === "signed-out" ? undefined : "alert"}>
              <h2 className="text-xl font-bold text-[#124734]">{pageState === "signed-out" ? "Sign in to view your account" : pageState === "missing-profile" ? "Account profile not available" : "Account information unavailable"}</h2>
              <p className="mt-2 text-sm leading-6 text-[#59635c]">{pageState === "signed-out" ? "Your session may have expired. Sign in using the Login control in the site header, then return here." : pageState === "missing-profile" ? "We could not find a customer profile for this account." : "We could not verify your account right now. Check your connection and try again."}</p>
              {pageState === "signed-out" ? <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#08763b] px-5 font-bold text-white">Go to the home page</Link> : <button type="button" onClick={retry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#08763b] px-5 font-bold text-white"><FiRefreshCw aria-hidden="true" /> Retry</button>}
            </section>
          )}
        </AccountPageContainer>
      </main>
    </>
  );
}
