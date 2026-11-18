"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiPlus, FiRefreshCw, FiX } from "react-icons/fi";
import AccountPageContainer from "@/components/account/account-page-container";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import AddressEmptyIllustration from "@/components/account/address-empty-illustration";

function AccountMessage({ title, description, signedOut, onRetry }) {
  return (
    <section className="account-address-message" role={signedOut ? undefined : "alert"}>
      <h2>{title}</h2>
      <p>{description}</p>
      {signedOut ? (
        <Link href="/" className="account-address-secondary-link">Go to the home page</Link>
      ) : (
        <button type="button" onClick={onRetry} className="account-address-secondary-link">
          <FiRefreshCw aria-hidden="true" /> Retry
        </button>
      )}
    </section>
  );
}

function AddAddressInfoDialog({ isDevelopmentPreview, onClose, triggerRef }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const trigger = triggerRef.current;
    if (!dialog) return undefined;
    dialog.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("button:not([disabled]), a[href]")];
      if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return; }
      const [first] = focusable;
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (trigger?.isConnected) trigger.focus();
      else if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [onClose, triggerRef]);

  return (
    <div className="account-address-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="address-dialog-title" className="account-address-dialog">
        <button type="button" onClick={onClose} aria-label="Close information" className="account-address-dialog__close"><FiX aria-hidden="true" /></button>
        <h2 id="address-dialog-title">{isDevelopmentPreview ? "Coming in Step 20H-3" : "Address management is not available yet"}</h2>
        <p>{isDevelopmentPreview ? "The address form is planned for the next step. No address has been added or saved." : "Your saved delivery and pickup addresses will appear here once address management is connected."}</p>
        <button type="button" onClick={onClose} className="account-address-dialog__button">Close</button>
      </section>
    </div>
  );
}

export default function AccountAddressesScreen({ isDevelopmentPreview = false }) {
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [pageState, setPageState] = useState("loading");
  const [showInfo, setShowInfo] = useState(false);
  const addAddressButtonRef = useRef(null);
  const closeInfo = useCallback(() => setShowInfo(false), []);

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
        if (!profileResponse.ok || !statusResponse.ok || profileData?.ok !== true || !profileData?.profile || statusData?.authenticated !== true || statusData?.profileFound !== true) {
          setPageState("error");
          return;
        }

        setAccount({ fullName: typeof profileData.profile.full_name === "string" ? profileData.profile.full_name : "" });
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
      <header className="account-address-mobile-heading xl:hidden">
        <Link href="/account" aria-label="Back to account overview" className="account-address-back"><FiArrowLeft aria-hidden="true" /></Link>
        <h1>My Addresses</h1>
      </header>

      <main className="account-address-main">
        <AccountPageContainer as="section" className="account-address-panel" aria-label="My Addresses">
          <header className="account-address-panel__heading hidden xl:block">
            <h1 id="account-address-title">My Addresses</h1>
            <p>Manage your delivery and pickup addresses for rentals and purchases.</p>
          </header>
          <p className="account-address-panel__mobile-description xl:hidden">Manage your delivery and pickup addresses for rentals and purchases.</p>

          {loading ? (
            <div className="account-address-loading" role="status" aria-live="polite"><span /><span /><span className="sr-only">Checking your account...</span></div>
          ) : pageState === "signed-out" ? (
            <AccountMessage title="Sign in to view your account" description="Your session may have expired. Sign in using the Login control in the site header, then return here." signedOut />
          ) : pageState === "missing-profile" ? (
            <AccountMessage title="Account profile not available" description="We could not find a customer profile for this account." onRetry={retry} />
          ) : pageState === "error" ? (
            <AccountMessage title="Account information unavailable" description="We could not verify your account right now. Check your connection and try again." onRetry={retry} />
          ) : pageState === "ready" ? (
            <div className="account-address-empty-state">
              <AddressEmptyIllustration />
              {isDevelopmentPreview && <p className="account-address-preview-label">Sample Addresses — UI Preview · No saved-address data is connected</p>}
              <h2>{isDevelopmentPreview ? "No addresses saved yet" : "Address management is not available yet."}</h2>
              <p>{isDevelopmentPreview ? "Add a delivery address to make your rentals and purchases faster and easier." : "Your saved delivery and pickup addresses will appear here once address management is connected."}</p>
              <button ref={addAddressButtonRef} type="button" onClick={() => setShowInfo(true)} className="account-address-add-button"><FiPlus aria-hidden="true" /><span>Add New Address</span></button>
            </div>
          ) : null}
        </AccountPageContainer>
      </main>
      {showInfo && <AddAddressInfoDialog isDevelopmentPreview={isDevelopmentPreview} onClose={closeInfo} triggerRef={addAddressButtonRef} />}
    </>
  );
}
