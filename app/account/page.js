"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiEdit2,
  FiLoader,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatusRow({ label, verified }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9ebe5] py-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full ${
            verified
              ? "bg-[#e9f1e9] text-[#124734]"
              : "bg-[#f5f1e9] text-[#665b43]"
          }`}
        >
          {verified ? (
            <FiCheckCircle aria-hidden="true" className="size-[18px]" />
          ) : (
            <FiAlertCircle aria-hidden="true" className="size-[18px]" />
          )}
        </span>
        <span className="text-sm font-semibold text-[#303731]">{label}</span>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          verified
            ? "bg-[#e9f1e9] text-[#124734]"
            : "bg-[#f5f1e9] text-[#665b43]"
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
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#017f36] px-5 font-bold text-white transition-colors hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
      >
        Retry
      </button>
    </section>
  );
}

export default function AccountPage() {
  const [retryKey, setRetryKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [account, setAccount] = useState(null);
  const [pageError, setPageError] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
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
          setSignInRequired(true);
          setAccount(null);
          return;
        }

        if (
          profileResponse.status === 404 ||
          statusData?.profileFound === false
        ) {
          setProfileMissing(true);
          setAccount(null);
          return;
        }

        if (!profileResponse.ok || !statusResponse.ok) {
          setPageError(
            "We could not load your account right now. Please try again."
          );
          return;
        }

        const profile = profileData?.profile;

        if (
          profileData?.ok !== true ||
          !profile ||
          statusData?.authenticated !== true ||
          statusData?.profileFound !== true
        ) {
          setPageError(
            "We could not read your account information. Please try again."
          );
          return;
        }

        const fullName =
          typeof profile.full_name === "string" ? profile.full_name : "";
        const onboardingCompleted =
          statusData.onboardingCompleted === true &&
          profile.onboardingCompleted === true;

        setAccount({
          fullName,
          hasFullName: statusData.hasFullName === true,
          emailVerified: statusData.emailVerified === true,
          phoneVerified: statusData.phoneVerified === true,
          onboardingCompleted,
        });
        setNameInput(fullName);
      } catch {
        if (isCurrentRequest) {
          setPageError(
            "We could not connect to your account. Check your connection and retry."
          );
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      isCurrentRequest = false;
    };
  }, [retryKey]);

  function retryLoading() {
    setLoading(true);
    setPageError("");
    setSignInRequired(false);
    setProfileMissing(false);
    setRetryKey((key) => key + 1);
  }

  function startEditingName() {
    setNameInput(account?.fullName ?? "");
    setNameError("");
    setSaveMessage("");
    setIsEditingName(true);
  }

  function cancelEditingName() {
    setNameInput(account?.fullName ?? "");
    setNameError("");
    setSaveMessage("");
    setIsEditingName(false);
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
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: fullName }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        setSignInRequired(true);
        setAccount(null);
        setIsEditingName(false);
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
        typeof data.profile.full_name === "string"
          ? data.profile.full_name
          : fullName;

      setAccount((current) =>
        current
          ? { ...current, fullName: savedName, hasFullName: true }
          : current
      );
      setNameInput(savedName);
      setIsEditingName(false);
      setSaveMessage("Your name was updated.");
    } catch {
      setNameError(
        "We could not connect to save your name. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const initials = getInitials(account?.fullName ?? "");

  return (
    <>
      <SiteHeader />

      <main className="min-h-[65vh] bg-[#f8f7f2] px-4 py-8 sm:px-7 sm:py-11 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-7 overflow-hidden rounded-3xl border border-[#e4e8df] bg-white shadow-[0_8px_30px_rgba(37,41,37,0.05)]">
            <div className="h-1.5 bg-gradient-to-r from-[#017f36] via-[#124734] to-[#b9d2bb]" />
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#017f36]">
                  Customer account
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#124734] sm:text-4xl">
                  My Account
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#59635c] sm:text-base">
                  {account?.fullName
                    ? `Welcome back, ${account.fullName}.`
                    : "Welcome to your Rento Comforts account."}
                </p>
              </div>

              {account && (
                <div className="flex items-center gap-3 self-start rounded-2xl bg-[#f7faf5] px-4 py-3 sm:self-auto">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#124734] text-sm font-bold text-white">
                    {initials || <FiUser aria-hidden="true" className="size-5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-[#687169]">
                      Signed-in profile
                    </span>
                    <span className="block max-w-56 truncate text-sm font-bold text-[#252925]">
                      {account.fullName || "Name not added yet"}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </header>

          {loading ? (
            <section
              className="flex min-h-52 items-center justify-center gap-3 rounded-2xl border border-[#e5e7e1] bg-white p-6 text-[#124734] shadow-[0_5px_22px_rgba(37,41,37,0.05)]"
              role="status"
              aria-live="polite"
            >
              <FiLoader aria-hidden="true" className="size-5 animate-spin" />
              <span>Loading your account…</span>
            </section>
          ) : signInRequired ? (
            <section className="rounded-2xl border border-[#e5e7e1] bg-white p-6 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-8">
              <h2 className="text-xl font-bold text-[#124734]">
                Sign in to view your account
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#59635c]">
                Your session may have expired. Use the Account control in the
                site header to sign in, then return to this page.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#017f36] px-5 font-bold text-white hover:bg-[#124734] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
              >
                Go to the home page
              </Link>
            </section>
          ) : profileMissing ? (
            <RetryPanel
              title="Profile not available"
              message="We could not find a customer profile for this account. Your account information has not been changed."
              onRetry={retryLoading}
            />
          ) : pageError ? (
            <RetryPanel
              title="Account information unavailable"
              message={pageError}
              onRetry={retryLoading}
              alert
            />
          ) : account ? (
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-6">
              <section
                aria-labelledby="personal-information-heading"
                className="rounded-2xl border border-[#e3e7df] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-7 lg:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f1e9] text-[#124734]">
                      <FiUser aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <h2
                        id="personal-information-heading"
                        className="text-lg font-bold text-[#124734]"
                      >
                        Personal information
                      </h2>
                      <p className="mt-1 text-sm text-[#687169]">
                        Manage your customer profile name.
                      </p>
                    </div>
                  </div>

                  {!account.onboardingCompleted && !isEditingName && (
                    <button
                      type="button"
                      onClick={startEditingName}
                      className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#017f36] transition-colors hover:bg-[#e9f1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
                    >
                      <FiEdit2 aria-hidden="true" className="size-4" />
                      Edit
                    </button>
                  )}
                </div>

                <div className="mt-7 rounded-xl border border-[#e9ebe5] bg-[#fdfdfb] p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#687169]">
                    Full name
                  </p>

                  {isEditingName && !account.onboardingCompleted ? (
                    <form className="mt-3 grid gap-3" onSubmit={saveName}>
                      <label className="sr-only" htmlFor="account-full-name">
                        Full name
                      </label>
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
                        aria-describedby={
                          nameError ? "account-name-error" : undefined
                        }
                        className="min-h-12 w-full rounded-xl border border-[#c7cbd1] bg-white px-4 text-base text-[#252925] outline-none transition focus:border-[#789889] focus:ring-2 focus:ring-[#124734]/10"
                      />

                      {nameError && (
                        <p
                          id="account-name-error"
                          className="text-sm text-[#a23d32]"
                          role="alert"
                        >
                          {nameError}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#017f36] px-5 font-bold text-white transition-colors hover:bg-[#124734] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
                        >
                          {saving && (
                            <FiLoader
                              aria-hidden="true"
                              className="size-4 animate-spin"
                            />
                          )}
                          {saving ? "Saving…" : "Save changes"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingName}
                          disabled={saving}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#c7cbd1] px-5 font-semibold text-[#303731] transition-colors hover:bg-[#f7f8f5] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#017f36]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="mt-2 break-words text-lg font-bold text-[#252925] sm:text-xl">
                        {account.hasFullName
                          ? account.fullName
                          : "Name not added yet"}
                      </p>
                      {account.onboardingCompleted && (
                        <p className="mt-2 text-xs leading-5 text-[#687169]">
                          Name editing is unavailable for completed accounts
                          under the current profile permissions.
                        </p>
                      )}
                    </>
                  )}

                  {saveMessage && (
                    <p
                      className="mt-3 text-sm font-semibold text-[#124734]"
                      role="status"
                      aria-live="polite"
                    >
                      {saveMessage}
                    </p>
                  )}
                </div>

                {!account.onboardingCompleted && (
                  <p className="mt-4 text-xs leading-5 text-[#687169]">
                    Name changes are saved to your profile. Account setup
                    status is managed separately.
                  </p>
                )}
              </section>

              <section
                aria-labelledby="account-verification-heading"
                className="rounded-2xl border border-[#e3e7df] bg-white p-5 shadow-[0_5px_22px_rgba(37,41,37,0.05)] sm:p-7 lg:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f1e9] text-[#124734]">
                    <FiShield aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h2
                      id="account-verification-heading"
                      className="text-lg font-bold text-[#124734]"
                    >
                      Account verification
                    </h2>
                    <p className="mt-1 text-sm text-[#687169]">
                      Status from your authenticated account records.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <StatusRow label="Email" verified={account.emailVerified} />
                  <StatusRow label="Mobile number" verified={account.phoneVerified} />
                </div>

                <div className="mt-6 rounded-xl border border-[#e2e9df] bg-[#f7faf5] p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#687169]">
                    Account setup
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {account.onboardingCompleted ? (
                      <FiCheckCircle
                        aria-hidden="true"
                        className="size-5 text-[#017f36]"
                      />
                    ) : (
                      <FiAlertCircle
                        aria-hidden="true"
                        className="size-5 text-[#806b3e]"
                      />
                    )}
                    <p className="font-bold text-[#124734]">
                      {account.onboardingCompleted
                        ? "Setup complete"
                        : "Setup pending"}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-[#59635c]">
                    {account.onboardingCompleted
                      ? "Your account setup is complete."
                      : "Some account setup steps are still pending."}
                  </p>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#687169]">
                  This page displays verification status but does not verify
                  contact details or change onboarding status.
                </p>
              </section>
            </div>
          ) : (
            <RetryPanel
              title="Account information unavailable"
              message="Account information is not available right now. Please retry."
              onRetry={retryLoading}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}