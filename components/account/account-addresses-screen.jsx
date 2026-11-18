"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiBriefcase, FiCheck, FiEdit2, FiHome, FiMapPin, FiMoreVertical, FiPhone, FiPlus, FiRefreshCw, FiStar, FiTrash2, FiX } from "react-icons/fi";
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

const SAMPLE_ADDRESSES = [
  { id: "sample-home", type: "Home", recipient: "Sample Resident One", address: "#42, 2nd Cross, Kengeri Satellite Town, Bengaluru – 560060, Karnataka", phone: "+91 90000 10001", isDefault: true },
  { id: "sample-work", type: "Work", recipient: "Sample Resident Two", address: "Rento Comforts Sample Office, 4th Floor, Prestige Tech Park, Marathahalli, Bengaluru – 560037, Karnataka", phone: "+91 90000 10002", isDefault: false },
  { id: "sample-other", type: "Other", recipient: "Sample Resident Three", address: "#18, 1st Main, 3rd Cross, JP Nagar 6th Phase, Bengaluru – 560078, Karnataka", phone: "+91 90000 10003", isDefault: false },
];

function AddAddressInfoDialog({ title, description, onClose, triggerRef }) {
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
        <h2 id="address-dialog-title">{title}</h2>
        <p>{description}</p>
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
  const [infoContent, setInfoContent] = useState(null);
  const [showPopulatedPreview, setShowPopulatedPreview] = useState(false);
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

  function showActionPreview(event, action) {
    addAddressButtonRef.current = event.currentTarget;
    const descriptions = {
      "Add New Address": "The address form is planned for Step 20H-3. No address has been added or saved.",
      Edit: "Address editing is not available in this preview. No address has been changed.",
      Delete: "Address deletion is not available in this preview. No address has been deleted.",
      "Set as Default": "Changing the default address is not available in this preview. No address settings have changed.",
    };
    setInfoContent({ title: `${action} — Sample Preview`, description: descriptions[action] });
    setShowInfo(true);
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
          ) : pageState === "ready" && isDevelopmentPreview && showPopulatedPreview ? (
            <div className="account-address-list-view">
              <div className="account-address-list-toolbar">
                <div>
                  <p className="account-address-preview-label">Sample Addresses — UI Preview · Fictional local data</p>
                  <h2>Saved Addresses</h2>
                </div>
                <button ref={addAddressButtonRef} type="button" onClick={(event) => showActionPreview(event, "Add New Address")} className="account-address-add-button"><FiPlus aria-hidden="true" /><span>Add New Address</span></button>
              </div>
              <div className="account-address-cards">
                {SAMPLE_ADDRESSES.map((address) => {
                  const TypeIcon = address.type === "Home" ? FiHome : address.type === "Work" ? FiBriefcase : FiMapPin;
                  return (
                    <article key={address.id} className={`account-address-card${address.isDefault ? " account-address-card--default" : ""}`}>
                      <span className="account-address-card__icon"><TypeIcon aria-hidden="true" /></span>
                      <div className="account-address-card__details">
                        <div className="account-address-card__title-row">
                          <h3>{address.type}</h3>
                          {address.isDefault && <span className="account-address-default-badge"><FiCheck aria-hidden="true" /> Default Address</span>}
                        </div>
                        <p className="account-address-card__recipient">{address.recipient} <span>· Fictional sample</span></p>
                        <p className="account-address-card__address"><FiMapPin aria-hidden="true" /><span>{address.address}</span></p>
                        <p className="account-address-card__phone"><FiPhone aria-hidden="true" /><span>{address.phone}</span></p>
                      </div>
                      <div className="account-address-card__actions">
                        <button type="button" onClick={(event) => showActionPreview(event, "Edit")}><FiEdit2 aria-hidden="true" /> Edit</button>
                        <button type="button" className="account-address-card__delete" onClick={(event) => showActionPreview(event, "Delete")}><FiTrash2 aria-hidden="true" /> Delete</button>
                        {address.isDefault ? (
                          <span className="account-address-card__current-default"><FiCheck aria-hidden="true" /> Default</span>
                        ) : (
                          <button type="button" className="account-address-card__set-default" onClick={(event) => showActionPreview(event, "Set as Default")}><FiStar aria-hidden="true" /> Set as Default</button>
                        )}
                        <button type="button" className="account-address-card__more" aria-label={`More actions for ${address.type} address`} onClick={(event) => showActionPreview(event, "Edit")}><FiMoreVertical aria-hidden="true" /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <button type="button" className="account-address-preview-exit" onClick={() => setShowPopulatedPreview(false)}>Return to My Addresses empty state</button>
            </div>
          ) : pageState === "ready" ? (
            <div className="account-address-empty-state">
              <AddressEmptyIllustration />
              {isDevelopmentPreview && <p className="account-address-preview-label">Sample Addresses — UI Preview · No saved-address data is connected</p>}
              <h2>{isDevelopmentPreview ? "No addresses saved yet" : "Address management is not available yet."}</h2>
              <p>{isDevelopmentPreview ? "Add a delivery address to make your rentals and purchases faster and easier." : "Your saved delivery and pickup addresses will appear here once address management is connected."}</p>
              <div className="account-address-empty-actions">
                <button ref={addAddressButtonRef} type="button" onClick={(event) => showActionPreview(event, "Add New Address")} className="account-address-add-button"><FiPlus aria-hidden="true" /><span>Add New Address</span></button>
                {isDevelopmentPreview && <button type="button" className="account-address-open-preview" onClick={() => setShowPopulatedPreview(true)}>Open populated sample preview</button>}
              </div>
            </div>
          ) : null}
        </AccountPageContainer>
      </main>
      {showInfo && infoContent && <AddAddressInfoDialog title={infoContent.title} description={infoContent.description} onClose={closeInfo} triggerRef={addAddressButtonRef} />}
    </>
  );
}
