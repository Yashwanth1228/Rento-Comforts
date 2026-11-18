"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiBriefcase, FiCheck, FiEdit2, FiHome, FiMapPin, FiMoreVertical, FiPhone, FiPlus, FiRefreshCw, FiStar, FiTrash2, FiX } from "react-icons/fi";
import AccountPageContainer from "@/components/account/account-page-container";
import AccountWelcomeBanner from "@/components/account/account-welcome-banner";
import AddressEmptyIllustration from "@/components/account/address-empty-illustration";
import AddressFormIllustration from "@/components/account/address-form-illustration";

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

const EMPTY_ADDRESS_FORM = {
  addressType: "Home",
  fullName: "",
  mobile: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pinCode: "",
  isDefault: false,
};

function AddAddressInfoDialog({ title, description, onClose, triggerRef, confirmLabel, onConfirm, destructive = false }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const trigger = triggerRef.current;
    if (!dialog) return undefined;
    const initialFocus = dialog.querySelector("[data-dialog-initial-focus]");
    if (initialFocus instanceof HTMLElement) initialFocus.focus();
    else dialog.focus();

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
      else document.querySelector(".account-address-list-view h2, .account-address-empty-state h2")?.focus();
    };
  }, [onClose, triggerRef]);

  return (
    <div className="account-address-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="address-dialog-title" className="account-address-dialog">
        <button type="button" onClick={onClose} aria-label="Close dialog" className="account-address-dialog__close"><FiX aria-hidden="true" /></button>
        <h2 id="address-dialog-title">{title}</h2>
        <p>{description}</p>
        {onConfirm ? (
          <div className="account-address-dialog__actions">
            <button type="button" data-dialog-initial-focus onClick={onClose} className="account-address-dialog__button account-address-dialog__button--cancel">Cancel</button>
            <button type="button" onClick={onConfirm} className={`account-address-dialog__button${destructive ? " account-address-dialog__button--destructive" : ""}`}>{confirmLabel}</button>
          </div>
        ) : (
          <button type="button" data-dialog-initial-focus onClick={onClose} className="account-address-dialog__button">Close</button>
        )}
      </section>
    </div>
  );
}

export default function AccountAddressesScreen({ isDevelopmentPreview = false, sampleAddresses = [] }) {
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [pageState, setPageState] = useState("loading");
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState(null);
  const [showPopulatedPreview, setShowPopulatedPreview] = useState(false);
  const [previewAddresses, setPreviewAddresses] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewNotice, setPreviewNotice] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_ADDRESS_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formPreview, setFormPreview] = useState(null);
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

  function showActionPreview(event, action, address) {
    if (action === "Add New Address") {
      if (!isDevelopmentPreview) {
        addAddressButtonRef.current = event.currentTarget;
        setInfoContent({ title: "Address management is not available yet", description: "Address management will be available once the saved-address service is connected." });
        setShowInfo(true);
        return;
      }
      setFormMode("add");
      setSelectedAddressId(null);
      setFormValues({ ...EMPTY_ADDRESS_FORM });
      setFormErrors({});
      setFormPreview(null);
      setFormOpen(true);
      return;
    }
    if (action === "Delete" && address && isDevelopmentPreview) {
      addAddressButtonRef.current = event.currentTarget;
      setDeleteTarget({ id: address.id, type: address.type, isDefault: address.isDefault });
      return;
    }
    if (action === "Set as Default" && address && isDevelopmentPreview) {
      setPreviewAddresses((current) => current.map((item) => ({ ...item, isDefault: item.id === address.id })));
      setPreviewNotice(`${address.type} is marked as the default in this sample preview. No account address was updated.`);
      return;
    }
    addAddressButtonRef.current = event.currentTarget;
    const descriptions = {
      Delete: "Address deletion is not available in this preview. No address has been deleted.",
      "Set as Default": "Changing the default address is not available in this preview. No address settings have changed.",
    };
    setInfoContent({ title: `${action} — Sample Preview`, description: descriptions[action] });
    setShowInfo(true);
  }

  function openEditAddress(event, addressId) {
    if (!isDevelopmentPreview) return;
    const address = previewAddresses.find((item) => item.id === addressId);
    if (!address) return;
    addAddressButtonRef.current = event.currentTarget;
    setFormMode("edit");
    setSelectedAddressId(address.id);
    setFormValues({
      ...EMPTY_ADDRESS_FORM,
      addressType: address.type,
      fullName: address.recipient,
      mobile: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setFormPreview(null);
    setFormOpen(true);
  }

  function updateFormField(event) {
    const { name, value, checked, type } = event.target;
    setFormValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
  }

  function validateAddressForm() {
    const errors = {};
    const required = [
      ["fullName", "Enter the recipient’s full name."],
      ["mobile", "Enter a valid 10-digit Indian mobile number."],
      ["line1", "Enter the house or flat number, street, and area."],
      ["city", "Enter the city."],
      ["state", "Enter the state."],
      ["pinCode", "Enter a six-digit PIN code."],
    ];
    for (const [field, message] of required) {
      if (!String(formValues[field]).trim()) errors[field] = message;
    }
    const normalizedMobile = formValues.mobile.trim().replace(/[\s()-]/g, "");
    if (formValues.mobile.trim() && !/^(?:\+?91)?[6-9]\d{9}$/.test(normalizedMobile)) {
      errors.mobile = "Enter a valid 10-digit Indian mobile number, with or without +91.";
    }
    if (formValues.pinCode.trim() && !/^\d{6}$/.test(formValues.pinCode.trim())) {
      errors.pinCode = "PIN code must contain exactly six digits.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAddressFormSubmit(event) {
    event.preventDefault();
    if (!isDevelopmentPreview || !validateAddressForm()) return;
    const digits = formValues.mobile.replace(/\D/g, "");
    setFormPreview({ ...formValues, fullName: formValues.fullName.trim(), mobile: digits.slice(-10), addressId: selectedAddressId });
  }

  function returnToAddresses() {
    setFormOpen(false);
    setFormMode("add");
    setSelectedAddressId(null);
    setFormValues({ ...EMPTY_ADDRESS_FORM });
    setFormErrors({});
    setFormPreview(null);
  }

  function enterPopulatedPreview() {
    setPreviewAddresses(sampleAddresses.map((address) => ({ ...address })));
    setPreviewNotice("");
    setShowPopulatedPreview(true);
  }

  function exitPopulatedPreview() {
    setShowPopulatedPreview(false);
    setPreviewAddresses([]);
    setPreviewNotice("");
  }

  function confirmDeleteAddress() {
    if (!deleteTarget) return;
    setPreviewAddresses((current) => {
      const remaining = current.filter((address) => address.id !== deleteTarget.id);
      if (deleteTarget.isDefault && remaining.length > 0) {
        return remaining.map((address, index) => ({ ...address, isDefault: index === 0 }));
      }
      return remaining.map((address) => ({ ...address, isDefault: address.isDefault && !deleteTarget.isDefault }));
    });
    setPreviewNotice(`${deleteTarget.type} sample address removed from this preview only. No real address was deleted.`);
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="hidden xl:block">
        <AccountWelcomeBanner fullName={account?.fullName ?? ""} title="My Account" description="Manage your profile, orders, rentals, and account preferences." compact />
      </div>
      <header className="account-address-mobile-heading xl:hidden">
        {formOpen ? (
          <button type="button" onClick={returnToAddresses} aria-label="Back to My Addresses" className="account-address-back"><FiArrowLeft aria-hidden="true" /></button>
        ) : (
          <Link href="/account" aria-label="Back to account overview" className="account-address-back"><FiArrowLeft aria-hidden="true" /></Link>
        )}
        <h1>{formOpen ? `${formMode === "edit" ? "Edit" : "Add New"} Address` : "My Addresses"}</h1>
      </header>

      <main className="account-address-main">
        <AccountPageContainer as="section" className="account-address-panel" aria-label="My Addresses">
          <header className="account-address-panel__heading hidden xl:block">
            {formOpen ? (
              <div className="account-address-form-heading">
                <button type="button" onClick={returnToAddresses} aria-label="Back to My Addresses" className="account-address-back"><FiArrowLeft aria-hidden="true" /></button>
                <div><h1 id="account-address-title">{formMode === "edit" ? "Edit Address" : "Add New Address"}</h1><p>Save your address for faster rentals and purchases.</p></div>
              </div>
            ) : (
              <><h1 id="account-address-title">My Addresses</h1><p>Manage your delivery and pickup addresses for rentals and purchases.</p></>
            )}
          </header>
          {!formOpen && <p className="account-address-panel__mobile-description xl:hidden">Manage your delivery and pickup addresses for rentals and purchases.</p>}

          {loading ? (
            <div className="account-address-loading" role="status" aria-live="polite"><span /><span /><span className="sr-only">Checking your account...</span></div>
          ) : pageState === "signed-out" ? (
            <AccountMessage title="Sign in to view your account" description="Your session may have expired. Sign in using the Login control in the site header, then return here." signedOut />
          ) : pageState === "missing-profile" ? (
            <AccountMessage title="Account profile not available" description="We could not find a customer profile for this account." onRetry={retry} />
          ) : pageState === "error" ? (
            <AccountMessage title="Account information unavailable" description="We could not verify your account right now. Check your connection and try again." onRetry={retry} />
          ) : pageState === "ready" && isDevelopmentPreview && formOpen ? (
            formPreview ? (
              <section className="account-address-form-preview" aria-labelledby="address-form-preview-title">
                <p className="account-address-preview-label">Sample Addresses — UI Preview</p>
                <h2 id="address-form-preview-title">{formMode === "edit" ? "Edit Address Preview" : "Address Form Preview"}</h2>
                <p className="account-address-preview-notice">{formMode === "edit" ? "Your changes have been validated locally. No address has been updated in your account." : "This form has been validated locally. No address has been saved to your account."}</p>
                <dl>
                  <div><dt>Address type</dt><dd>{formPreview.addressType}{formPreview.isDefault ? " · Set as default" : ""}</dd></div>
                  <div><dt>Recipient</dt><dd>{formPreview.fullName}</dd></div>
                  <div><dt>Mobile number</dt><dd>+91 {formPreview.mobile}</dd></div>
                  <div><dt>Address</dt><dd>{[formPreview.line1, formPreview.line2, formPreview.city, formPreview.state, formPreview.pinCode].filter(Boolean).join(", ")}</dd></div>
                </dl>
                <div className="account-address-form-actions"><button type="button" className="account-address-form-cancel" onClick={returnToAddresses}>Back to My Addresses</button><button type="button" className="account-address-form-save" onClick={returnToAddresses}>Done</button></div>
              </section>
            ) : (
              <div className="account-address-form-layout">
                <aside className="account-address-form-aside">
                  <AddressFormIllustration />
                  <h2>Add a Delivery Address</h2>
                  <p>Save your address for faster rentals and purchases.</p>
                </aside>
                <form className="account-address-form" noValidate onSubmit={handleAddressFormSubmit}>
                  <fieldset className="account-address-type-fieldset">
                    <legend>Address Type <span aria-hidden="true">*</span></legend>
                    <div className="account-address-type-options">
                      {[{ value: "Home", Icon: FiHome }, { value: "Work", Icon: FiBriefcase }, { value: "Other", Icon: FiMapPin }].map(({ value, Icon }) => (
                        <label key={value} className={`account-address-type-option${formValues.addressType === value ? " is-selected" : ""}`}>
                          <input type="radio" name="addressType" value={value} checked={formValues.addressType === value} required onChange={updateFormField} />
                          <Icon aria-hidden="true" /><span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="account-address-form-grid">
                    <label className="account-address-form-field"><span>Recipient Name <b>*</b></span><input name="fullName" autoComplete="name" required value={formValues.fullName} onChange={updateFormField} aria-invalid={Boolean(formErrors.fullName)} aria-describedby={formErrors.fullName ? "address-full-name-error" : undefined} />{formErrors.fullName && <small id="address-full-name-error" role="alert">{formErrors.fullName}</small>}</label>
                    <label className="account-address-form-field"><span>Mobile Number <b>*</b></span><input name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={16} required value={formValues.mobile} onChange={updateFormField} aria-invalid={Boolean(formErrors.mobile)} aria-describedby={formErrors.mobile ? "address-mobile-error" : undefined} />{formErrors.mobile && <small id="address-mobile-error" role="alert">{formErrors.mobile}</small>}</label>
                    <label className="account-address-form-field account-address-form-field--wide"><span>Address Line 1 <b>*</b></span><input name="line1" autoComplete="address-line1" required value={formValues.line1} onChange={updateFormField} aria-invalid={Boolean(formErrors.line1)} aria-describedby={formErrors.line1 ? "address-line1-error" : undefined} />{formErrors.line1 && <small id="address-line1-error" role="alert">{formErrors.line1}</small>}</label>
                    <label className="account-address-form-field account-address-form-field--wide"><span>Address Line 2 (Optional)</span><input name="line2" autoComplete="address-line2" value={formValues.line2} onChange={updateFormField} /></label>
                    <div className="account-address-location-grid">
                      <label className="account-address-form-field"><span>City <b>*</b></span><input name="city" autoComplete="address-level2" required value={formValues.city} onChange={updateFormField} aria-invalid={Boolean(formErrors.city)} aria-describedby={formErrors.city ? "address-city-error" : undefined} />{formErrors.city && <small id="address-city-error" role="alert">{formErrors.city}</small>}</label>
                      <label className="account-address-form-field"><span>State <b>*</b></span><input name="state" autoComplete="address-level1" required value={formValues.state} onChange={updateFormField} aria-invalid={Boolean(formErrors.state)} aria-describedby={formErrors.state ? "address-state-error" : undefined} />{formErrors.state && <small id="address-state-error" role="alert">{formErrors.state}</small>}</label>
                      <label className="account-address-form-field"><span>PIN Code <b>*</b></span><input name="pinCode" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} required value={formValues.pinCode} onChange={updateFormField} aria-invalid={Boolean(formErrors.pinCode)} aria-describedby={formErrors.pinCode ? "address-pin-error" : undefined} />{formErrors.pinCode && <small id="address-pin-error" role="alert">{formErrors.pinCode}</small>}</label>
                    </div>
                  </div>
                  <label className="account-address-default-checkbox"><input type="checkbox" name="isDefault" checked={formValues.isDefault} onChange={updateFormField} /><span>Set as Default Address</span></label>
                  <div className="account-address-form-actions"><button type="button" className="account-address-form-cancel" onClick={returnToAddresses}>Cancel</button><button type="submit" className="account-address-form-save">{formMode === "edit" ? "Save Changes" : "Save Address"}</button></div>
                </form>
              </div>
            )
          ) : pageState === "ready" && isDevelopmentPreview && showPopulatedPreview && previewAddresses.length === 0 ? (
            <div className="account-address-empty-state">
              <AddressEmptyIllustration />
              <p className="account-address-preview-label">Sample Addresses — UI Preview · Fictional local data</p>
              <h2 tabIndex={-1}>No addresses saved yet</h2>
              <p>There are no sample addresses left in this preview.</p>
              <div className="account-address-empty-actions">
                <button ref={addAddressButtonRef} type="button" onClick={(event) => showActionPreview(event, "Add New Address")} className="account-address-add-button"><FiPlus aria-hidden="true" /><span>Add New Address</span></button>
                <button type="button" className="account-address-open-preview" onClick={exitPopulatedPreview}>Return to My Addresses</button>
              </div>
              {previewNotice && <p className="account-address-preview-notice" role="status" aria-live="polite">{previewNotice}</p>}
            </div>
          ) : pageState === "ready" && isDevelopmentPreview && showPopulatedPreview ? (
            <div className="account-address-list-view">
              <div className="account-address-list-toolbar">
                <div>
                  <p className="account-address-preview-label">Sample Addresses — UI Preview · Fictional local data</p>
                  <h2 tabIndex={-1}>Saved Addresses</h2>
                </div>
                <button ref={addAddressButtonRef} type="button" onClick={(event) => showActionPreview(event, "Add New Address")} className="account-address-add-button"><FiPlus aria-hidden="true" /><span>Add New Address</span></button>
              </div>
              {previewNotice && <p className="account-address-preview-notice" role="status" aria-live="polite">{previewNotice}</p>}
              <div className="account-address-cards">
                {previewAddresses.map((address) => {
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
                        <button type="button" onClick={(event) => openEditAddress(event, address.id)}><FiEdit2 aria-hidden="true" /> Edit</button>
                        <button type="button" className="account-address-card__delete" onClick={(event) => showActionPreview(event, "Delete", address)}><FiTrash2 aria-hidden="true" /> Delete</button>
                        {address.isDefault ? (
                          <span className="account-address-card__current-default"><FiCheck aria-hidden="true" /> Default</span>
                        ) : (
                          <button type="button" className="account-address-card__set-default" onClick={(event) => showActionPreview(event, "Set as Default", address)}><FiStar aria-hidden="true" /> Set as Default</button>
                        )}
                        <button type="button" className="account-address-card__more" aria-label={`More actions for ${address.type} address`} onClick={(event) => openEditAddress(event, address.id)}><FiMoreVertical aria-hidden="true" /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <button type="button" className="account-address-preview-exit" onClick={exitPopulatedPreview}>Return to My Addresses empty state</button>
            </div>
          ) : pageState === "ready" ? (
            <div className="account-address-empty-state">
              <AddressEmptyIllustration />
              {isDevelopmentPreview && <p className="account-address-preview-label">Sample Addresses — UI Preview · No saved-address data is connected</p>}
              <h2>{isDevelopmentPreview ? "No addresses saved yet" : "Address management is not available yet."}</h2>
              <p>{isDevelopmentPreview ? "Add a delivery address to make your rentals and purchases faster and easier." : "Your saved delivery and pickup addresses will appear here once address management is connected."}</p>
              <div className="account-address-empty-actions">
                <button ref={addAddressButtonRef} type="button" onClick={(event) => showActionPreview(event, "Add New Address")} className="account-address-add-button"><FiPlus aria-hidden="true" /><span>Add New Address</span></button>
                {isDevelopmentPreview && <button type="button" className="account-address-open-preview" onClick={enterPopulatedPreview}>Open populated sample preview</button>}
              </div>
            </div>
          ) : null}
        </AccountPageContainer>
      </main>
      {showInfo && infoContent && <AddAddressInfoDialog title={infoContent.title} description={infoContent.description} onClose={closeInfo} triggerRef={addAddressButtonRef} />}
      {deleteTarget && <AddAddressInfoDialog title="Delete Address?" description={`Remove the ${deleteTarget.type} sample address from the current preview? ${deleteTarget.isDefault ? "This is the current default; after confirmation, the first remaining sample address will become the preview default. " : ""}No real customer address will be deleted.`} onClose={() => setDeleteTarget(null)} onConfirm={confirmDeleteAddress} confirmLabel="Delete Address" destructive triggerRef={addAddressButtonRef} />}
    </>
  );
}
