"use client";

import { useEffect, useState } from "react";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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

  return (
    <>
      <SiteHeader />
      <AccountDashboard
        loading={loading}
        account={account}
        signInRequired={signInRequired}
        profileMissing={profileMissing}
        pageError={pageError}
        retryLoading={retryLoading}
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
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
