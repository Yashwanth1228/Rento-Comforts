"use client";
import { createClient } from "@/lib/supabase/client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser, FiX } from "react-icons/fi";

function maskRecoveryIdentifier(value) {
  if (value.includes("@")) {
    const [localPart, domain = ""] = value.split("@");
    const dotIndex = domain.lastIndexOf(".");
    const domainName = dotIndex > -1 ? domain.slice(0, dotIndex) : domain;
    const suffix = dotIndex > -1 ? domain.slice(dotIndex) : "";
    return localPart.slice(0, 1) + "***@" + domainName.slice(0, 1) + "***" + suffix;
  }

  const digits = value.replace(/\D/g, "");
  const nationalNumber = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.slice(-10);
  return "+91 ****** " + nationalNumber.slice(-4);
}

function OtpInputGroup({ otp, refs, onChange, onPaste, onKeyDown, labelPrefix = "Digit", groupLabel = "Six-digit verification code" }) {
  return (
    <div className="auth-otp-inputs" role="group" aria-label={groupLabel}>
      {otp.map((digit, index) => (
        <input
          key={`${labelPrefix}-${index}`}
          ref={(element) => { refs.current[index] = element; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          aria-label={`${labelPrefix} ${index + 1} of 6`}
          onChange={(event) => onChange(index, event.target.value)}
          onPaste={(event) => onPaste(event, index)}
          onKeyDown={(event) => onKeyDown(event, index)}
        />
      ))}
    </div>
  );
}

export function AuthModal({
  open,
  initialScreen = "login",
  onClose,
  onAuthenticated,
  returnFocusRef,
}) {
  const dialogRef = useRef(null);
  const identityRef = useRef(null);
  const recoveryIdentityRef = useRef(null);
  const phoneRef = useRef(null);
  const otpRefs = useRef([]);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [recoveryIdentity, setRecoveryIdentity] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const [recoveryStage, setRecoveryStage] = useState("identifier");
  const [recoveryOtpNotice, setRecoveryOtpNotice] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState("");
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
  const [showRecoveryConfirmPassword, setShowRecoveryConfirmPassword] = useState(false);
  const [recoveryPasswordErrors, setRecoveryPasswordErrors] = useState({});
  const [recoveryPasswordNotice, setRecoveryPasswordNotice] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [signupStage, setSignupStage] = useState("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpNotice, setOtpNotice] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [accountErrors, setAccountErrors] = useState({});
  const [accountNotice, setAccountNotice] = useState("");
  const [screen, setScreen] = useState(initialScreen === "signup" ? "signup" : "login");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (open && !dialog.open) {
      const previousBodyOverflow = document.body.style.overflow;
      const previousRootOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      dialog.scrollTop = 0;
      requestAnimationFrame(() => identityRef.current?.focus({ preventScroll: true }));
      return () => {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousRootOverflow;
      };
    }

    if (!open && dialog.open) dialog.close();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      dialog.scrollTop = 0;
      if (screen === "signup" && signupStage === "otp") otpRefs.current[0]?.focus({ preventScroll: true });
      else if (screen === "signup" && signupStage === "phone") phoneRef.current?.focus({ preventScroll: true });
      else if (screen === "signup" && signupStage === "details") document.getElementById("signup-full-name")?.focus({ preventScroll: true });
      else if (screen === "recovery" && recoveryStage === "otp") otpRefs.current[0]?.focus({ preventScroll: true });
      else if (screen === "recovery" && recoveryStage === "password") document.getElementById("recovery-new-password")?.focus({ preventScroll: true });
      else if (screen === "recovery") recoveryIdentityRef.current?.focus({ preventScroll: true });
      else identityRef.current?.focus({ preventScroll: true });
    });
  }, [screen, signupStage, recoveryStage, open]);

  function handleClose() {
    setMessage("");
    setRecoveryIdentity("");
    setRecoveryError("");
    setRecoveryNotice("");
    setRecoveryStage("identifier");
    setRecoveryOtpNotice("");
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
    setShowRecoveryPassword(false);
    setShowRecoveryConfirmPassword(false);
    setScreen("login");
    setPhone("");
    setPhoneError("");
    setOtp(["", "", "", "", "", ""]);
    setOtpNotice("");
    setSignupStage("phone");
    setPassword("");
    setShowPassword(false);
    setFullName("");
    setEmail("");
    setAccountPassword("");
    setConfirmPassword("");
    setShowAccountPassword(false);
    setShowConfirmPassword(false);
    setTermsAccepted(false);
    setAccountErrors({});
    setAccountNotice("");
    onClose();
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  async function handleGoogleSignIn() {
  if (isSubmitting || isGoogleSubmitting) return;

  setMessage("");
  setIsGoogleSubmitting(true);

  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error || !data?.url) {
      setMessage("Google sign-in could not be started. Please try again.");
      setIsGoogleSubmitting(false);
    }
  } catch {
    setMessage("Could not reach Google sign-in. Check your connection and try again.");
    setIsGoogleSubmitting(false);
  }
}

  async function handleSubmit(event) {
  event.preventDefault();

  // A disabled button prevents most repeat clicks; this also guards the handler.
if (isSubmitting || isGoogleSubmitting) return;
  const enteredIdentity = identity.trim();

  if (!enteredIdentity) {
    setMessage("Enter your email address.");
    return;
  }

  // This first implementation supports email only.
  if (!enteredIdentity.includes("@")) {
    setMessage("Mobile-number login is not connected yet. Enter your email address.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailPattern.test(enteredIdentity)) {
    setMessage("Enter a valid email address.");
    return;
  }

  if (!password) {
    setMessage("Enter your password.");
    return;
  }

  setMessage("");
  setIsSubmitting(true);

  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: enteredIdentity.toLowerCase(),
      password,
    });

    if (error) {
      if (error.status === 429) {
        setMessage("Too many sign-in attempts. Wait a moment and try again.");
      } else if (error.status === 0 || error.status >= 500) {
        setMessage("The sign-in service is temporarily unavailable. Try again shortly.");
      } else {
        setMessage("Unable to sign in with those details. Check your email and password.");
      }
      return;
    }

    onAuthenticated?.();
handleClose();
  } catch {
    // Do not display raw errors or credentials in the UI.
    setMessage("Could not reach the sign-in service. Check your connection and try again.");
  } finally {
    setIsSubmitting(false);
  }
}

  function showRecovery() {
    setMessage("");
    setRecoveryIdentity("");
    setRecoveryError("");
    setRecoveryNotice("");
    setRecoveryStage("identifier");
    setOtp(["", "", "", "", "", ""]);
    setRecoveryOtpNotice("");
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
    setShowRecoveryPassword(false);
    setShowRecoveryConfirmPassword(false);
    setScreen("recovery");
  }

  function backToSignin() {
    leaveRecoveryFlow();
    setScreen("login");
  }

  function handleRecoverySubmit(event) {
    event.preventDefault();
    const value = recoveryIdentity.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    const phoneValid = /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(value);

    if (!emailValid && !phoneValid) {
      setRecoveryError("Enter a valid email address or 10-digit Indian mobile number.");
      setRecoveryNotice("");
      return;
    }

    setRecoveryIdentity(value);
    setRecoveryError("");
    setRecoveryNotice("");
    setOtp(["", "", "", "", "", ""]);
    setRecoveryOtpNotice("UI Preview only. No verification code has been sent.");
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
    setShowRecoveryPassword(false);
    setShowRecoveryConfirmPassword(false);
    setRecoveryStage("otp");
  }

  function updateRecoveryIdentity(value) {
    setRecoveryIdentity(value);
    setRecoveryError("");
    setRecoveryNotice("");
  }

  function backToRecoveryIdentifier() {
    setRecoveryStage("identifier");
    setOtp(["", "", "", "", "", ""]);
    setRecoveryOtpNotice("");
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
  }

  function continueRecoveryPreview() {
    if (otp.some((digit) => !digit)) {
      setRecoveryOtpNotice("Enter all six digits to continue. No code has been verified.");
      return;
    }
    setRecoveryOtpNotice("UI Preview only. Verification is not connected; no password can be reset.");
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
    setRecoveryStage("password");
  }

  function backToRecoveryOtp() {
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
    setRecoveryStage("otp");
  }

  function handleRecoveryPasswordSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!recoveryPassword) errors.recoveryPassword = "Enter a new password.";
    else if (recoveryPassword.length < 8) errors.recoveryPassword = "Use at least 8 characters.";
    if (!recoveryConfirmPassword) errors.recoveryConfirmPassword = "Confirm your new password.";
    else if (recoveryPassword !== recoveryConfirmPassword) errors.recoveryConfirmPassword = "Passwords do not match.";
    setRecoveryPasswordErrors(errors);
    if (Object.keys(errors).length) {
      setRecoveryPasswordNotice("");
      return;
    }
    setRecoveryPasswordNotice("Password reset is not connected yet. Backend verification is required.");
  }

  function updateRecoveryPassword(field, value) {
    if (field === "recoveryPassword") setRecoveryPassword(value);
    else setRecoveryConfirmPassword(value);
    setRecoveryPasswordErrors((current) => {
      const next = { ...current };
      delete next[field];
      const nextPassword = field === "recoveryPassword" ? value : recoveryPassword;
      const nextConfirm = field === "recoveryConfirmPassword" ? value : recoveryConfirmPassword;
      if (nextConfirm && nextPassword !== nextConfirm) next.recoveryConfirmPassword = "Passwords do not match.";
      else if (field === "recoveryPassword" || field === "recoveryConfirmPassword") delete next.recoveryConfirmPassword;
      if (field === "recoveryPassword" && value.length > 0 && value.length < 8) next.recoveryPassword = "Use at least 8 characters.";
      return next;
    });
    setRecoveryPasswordNotice("");
  }

  function leaveRecoveryFlow() {
    setRecoveryIdentity("");
    setRecoveryError("");
    setRecoveryNotice("");
    setRecoveryStage("identifier");
    setOtp(["", "", "", "", "", ""]);
    setRecoveryOtpNotice("");
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setShowRecoveryPassword(false);
    setShowRecoveryConfirmPassword(false);
    setRecoveryPasswordErrors({});
    setRecoveryPasswordNotice("");
  }

  function handleSignupSubmit(event) {
    event.preventDefault();
    if (signupStage !== "phone") return;
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneError("");
    setOtp(["", "", "", "", "", ""]);
    setOtpNotice("");
    setSignupStage("otp");
  }

  function handlePhoneChange(event) {
    const digits = event.target.value.replace(/\D/g, "");
    const nationalNumber = digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.slice(0, 10);
    setPhone(nationalNumber);
    setPhoneError("");
  }

  function handleOtpChange(index, value) {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setOtp((current) => current.map((digit, digitIndex) => digitIndex === index ? "" : digit));
      setOtpNotice("");
      return;
    }

    const nextOtp = [...otp];
    digits.slice(0, 6 - index).split("").forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    setOtp(nextOtp);
    setOtpNotice("");
    otpRefs.current[Math.min(index + digits.length, 5)]?.focus();
  }

  function handleOtpPaste(event, index) {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    event.preventDefault();
    const nextOtp = [...otp];
    digits.slice(0, 6 - index).split("").forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    setOtp(nextOtp);
    setOtpNotice("");
    otpRefs.current[Math.min(index + digits.length, 5)]?.focus();
  }

  function handleOtpKeyDown(event, index) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleVerifyPreview() {
    if (otp.some((digit) => !digit)) {
      setOtpNotice("Enter all six digits to continue.");
      return;
    }
    setOtpNotice("UI Preview only. This step does not verify your mobile number.");
    setAccountErrors({});
    setAccountNotice("");
    setSignupStage("details");
  }

  function handleAccountSubmit(event) {
    event.preventDefault();
    const cleanName = fullName.trim();
    setFullName(cleanName);
    const errors = {};
    if (!cleanName) errors.fullName = "Enter your full name.";
    else if (!/^(?=.*\p{L})[\p{L}\p{M} .'-]{2,80}$/u.test(cleanName)) errors.fullName = "Enter a name using letters, spaces, periods, apostrophes, or hyphens.";

    const cleanEmail = email.trim();
    if (!cleanEmail) errors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) errors.email = "Enter a valid email address.";

    if (!accountPassword) errors.accountPassword = "Create a password.";
    else if (accountPassword.length < 8) errors.accountPassword = "Use at least 8 characters.";
    if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
    else if (confirmPassword !== accountPassword) errors.confirmPassword = "Passwords do not match.";
    if (!termsAccepted) errors.termsAccepted = "Please agree to the Terms & Conditions and Privacy Policy.";

    setAccountErrors(errors);
    if (Object.keys(errors).length) {
      setAccountNotice("");
      return;
    }
    setEmail(cleanEmail);
    setAccountNotice("Account creation is not connected yet. This form is currently a UI preview.");
  }

  function updateAccountField(field, value, setter) {
    setter(value);
    setAccountErrors((current) => {
      const next = { ...current };
      delete next[field];
      if (field === "accountPassword" && confirmPassword && value !== confirmPassword) next.confirmPassword = "Passwords do not match.";
      else if (field === "accountPassword") delete next.confirmPassword;
      if (field === "confirmPassword" && value && value !== accountPassword) next.confirmPassword = "Passwords do not match.";
      return next;
    });
    setAccountNotice("");
  }

  function backToOtp() {
    setAccountNotice("");
    setAccountErrors({});
    setAccountPassword("");
    setConfirmPassword("");
    setShowAccountPassword(false);
    setShowConfirmPassword(false);
    setSignupStage("otp");
  }

  function changeMobileNumber() {
    setOtp(["", "", "", "", "", ""]);
    setOtpNotice("");
    setPhoneError("");
    setFullName("");
    setEmail("");
    setAccountPassword("");
    setConfirmPassword("");
    setShowAccountPassword(false);
    setShowConfirmPassword(false);
    setTermsAccepted(false);
    setAccountErrors({});
    setAccountNotice("");
    setSignupStage("phone");
  }

  function showSignup() {
    setMessage("");
    setPhone("");
    setPhoneError("");
    setOtp(["", "", "", "", "", ""]);
    setOtpNotice("");
    setSignupStage("phone");
    setFullName("");
    setEmail("");
    setAccountPassword("");
    setConfirmPassword("");
    setTermsAccepted(false);
    setAccountErrors({});
    setAccountNotice("");
    setShowAccountPassword(false);
    setShowConfirmPassword(false);
    leaveRecoveryFlow();
    setScreen("signup");
  }

  function showLogin() {
    setPhoneError("");
    setMessage("");
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
    setOtpNotice("");
    setSignupStage("phone");
    setFullName("");
    setEmail("");
    setAccountPassword("");
    setConfirmPassword("");
    setTermsAccepted(false);
    setAccountErrors({});
    setAccountNotice("");
    setShowPassword(false);
    setShowAccountPassword(false);
    setShowConfirmPassword(false);
    leaveRecoveryFlow();
    setScreen("login");
  }

  return (
    <dialog
      ref={dialogRef}
      className={`auth-dialog${screen === "signup" && signupStage === "otp" ? " auth-dialog--otp" : screen === "signup" && signupStage === "details" ? " auth-dialog--details" : ""}`}
      aria-labelledby="auth-modal-title"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="auth-modal-shell">
        <div className="auth-background-layer" aria-hidden="true">
          <Image
            src="/images/auth-modal-backdrop-v6.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 720px) 100vw, 900px"
            className="auth-background-image"
          />
        </div>
        <section className="auth-brand-panel" aria-label="Rento Comforts">
          <div className="auth-brand-content">
            <Link href="/" className="auth-brand-lockup" aria-label="Rento Comforts home">
              <Image src="/brand/rento-symbol-green.png" alt="" width={54} height={54} priority />
              <span><strong>RENTO</strong><small>COMFORTS</small></span>
            </Link>
            <div className="auth-brand-copy">
              {screen === "recovery" ? (
                <>
                  <h2>Reset Your Password</h2>
                  <p>No worries! We&apos;ll help you get back to your account.</p>
                </>
              ) : (
                <>
                  <h2>Rent. Set Up.<br />Live Comfortably.</h2>
                  <p>Furniture, home appliances and more on flexible rental plans in Bengaluru.</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <button type="button" className="auth-close" aria-label="Close login popup" onClick={() => dialogRef.current?.close()}>
            <FiX aria-hidden="true" />
          </button>

          {screen === "login" ? (
            <div className="auth-form-card">
              <div className="auth-form-content">
                <h1 id="auth-modal-title">Welcome Back</h1>
                <p id="auth-description" className="auth-subtitle">Sign in to your Rento Comforts account</p>

                <form className="auth-login-form" onSubmit={handleSubmit}>
                  <label className="auth-input-field">
                    <FiUser aria-hidden="true" className="auth-input-icon" />
                    <span className="sr-only">Email or Mobile Number</span>
                    <input
                      ref={identityRef}
                      name="identity"
                      type="text"
                      autoComplete="username"
                      value={identity}
                      onChange={(event) => { setIdentity(event.target.value); setMessage(""); }}
                      placeholder="Email or Mobile Number"
                    />
                  </label>

                  <div className="auth-input-field">
                    <FiLock aria-hidden="true" className="auth-input-icon" />
                    <label className="sr-only" htmlFor="auth-password">Password</label>
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); setMessage(""); }}
                      placeholder="Password"
                    />
                    <button
                      className="auth-password-toggle"
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}
                    </button>
                  </div>

                  <div className="auth-options-row">
                    <label className="auth-remember-option">
                      <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                      <span>Remember me</span>
                    </label>
                    <button className="auth-text-link" type="button" onClick={showRecovery}>Forgot password?</button>
                  </div>

                  {message && <p className="auth-form-message" role="status">{message}</p>}
                  <button
                    type="submit"
                    className="auth-continue-button"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? "Signing in…" : "Sign In"}
                  
                  </button>
                </form>

                <div className="auth-social-divider" aria-label="or continue with"><span>or continue with</span></div>
                <div className="auth-social-options">
  <button
    type="button"
    className="auth-social-button"
    onClick={handleGoogleSignIn}
    disabled={isGoogleSubmitting || isSubmitting}
    aria-busy={isGoogleSubmitting}
  >
    <FcGoogle aria-hidden="true" />
    <span>
      {isGoogleSubmitting ? "Connecting to Google..." : "Continue with Google"}
    </span>
  </button>
</div>
<p className="auth-preview-note">
  You’ll return to Rento Comforts after Google sign-in.
</p>
                <p className="auth-signup-prompt">Don&apos;t have an account? <button type="button" onClick={showSignup}>Sign Up</button></p>
              </div>
            </div>
          ) : screen === "recovery" ? (
            <div className="auth-form-card">
              <div className="auth-form-content auth-recovery-screen">
                {recoveryStage === "identifier" ? (
                  <>
                    <button type="button" className="auth-back-link" onClick={backToSignin}><FiArrowLeft aria-hidden="true" /> Back to Sign In</button>
                    <h1 id="auth-modal-title">Forgot Password?</h1>
                    <p id="recovery-description" className="auth-subtitle">Enter your registered email or mobile number and we&apos;ll send you a verification code.</p>

                    <form className="auth-login-form" onSubmit={handleRecoverySubmit} noValidate>
                      <label className="auth-input-field">
                        <FiUser aria-hidden="true" className="auth-input-icon" />
                        <span className="sr-only">Email or Mobile Number</span>
                        <input
                          ref={recoveryIdentityRef}
                          name="recovery-identity"
                          type="text"
                          inputMode="text"
                          autoComplete="username"
                          value={recoveryIdentity}
                          onChange={(event) => updateRecoveryIdentity(event.target.value)}
                          aria-invalid={Boolean(recoveryError)}
                          aria-describedby={recoveryError ? "recovery-error" : "recovery-description"}
                          placeholder="Email or Mobile Number"
                        />
                      </label>
                      {recoveryError && <p id="recovery-error" className="auth-form-message auth-form-error" role="alert">{recoveryError}</p>}
                      <button type="submit" className="auth-continue-button">Send Verification Code</button>
                    </form>
                  </>
                ) : recoveryStage === "otp" ? (
                  <>
                    <button type="button" className="auth-back-link" onClick={backToRecoveryIdentifier}><FiArrowLeft aria-hidden="true" /> Back</button>
                    <h1 id="auth-modal-title">Verify Your Account</h1>
                    <p className="auth-subtitle">Enter the 6-digit verification code to continue.</p>
                    <div className="auth-mobile-summary" aria-label={`Recovery account ${maskRecoveryIdentifier(recoveryIdentity)}`}>
                      <FiUser aria-hidden="true" />
                      <span className="auth-mobile-summary__label">Recovery account</span>
                      <strong>{maskRecoveryIdentifier(recoveryIdentity)}</strong>
                    </div>

                    <section className="auth-otp-section auth-recovery-otp" aria-label="Recovery verification code">
                      <OtpInputGroup otp={otp} refs={otpRefs} onChange={handleOtpChange} onPaste={handleOtpPaste} onKeyDown={handleOtpKeyDown} labelPrefix="Recovery code digit" groupLabel="Six-digit recovery verification code" />
                      <div className="auth-otp-resend-row">
                        <span>Resend code</span>
                        <button type="button" disabled title="Code delivery is unavailable in UI Preview">Unavailable in UI Preview</button>
                      </div>
                      <p className="auth-otp-preview-note">UI Preview only. No verification code has been sent.</p>
                      {recoveryOtpNotice && <p className="auth-form-message auth-recovery-notice" role="status">{recoveryOtpNotice}</p>}
                      <button type="button" className="auth-continue-button" disabled={otp.some((digit) => !digit)} onClick={continueRecoveryPreview}>Verify &amp; Continue</button>
                    </section>
                  </>
                ) : (
                  <>
                    <button type="button" className="auth-back-link" onClick={backToRecoveryOtp}><FiArrowLeft aria-hidden="true" /> Back to Verification</button>
                    <h1 id="auth-modal-title">Set New Password</h1>
                    <p className="auth-subtitle">Create a new password for your Rento Comforts account.</p>
                    <p className="auth-account-disclaimer" role="status">UI Preview only. Recovery verification has not been performed.</p>

                    <form className="auth-account-form auth-recovery-password-form" onSubmit={handleRecoveryPasswordSubmit} noValidate>
                      <div className="auth-details-field">
                        <label className="auth-details-label" htmlFor="recovery-new-password">New Password</label>
                        <div className="auth-input-field">
                          <FiLock aria-hidden="true" className="auth-input-icon" />
                          <input id="recovery-new-password" name="new-password" type={showRecoveryPassword ? "text" : "password"} autoComplete="new-password" value={recoveryPassword} onChange={(event) => updateRecoveryPassword("recoveryPassword", event.target.value)} aria-invalid={Boolean(recoveryPasswordErrors.recoveryPassword)} aria-describedby={recoveryPasswordErrors.recoveryPassword ? "recovery-password-error" : "recovery-password-help"} placeholder="Enter new password" />
                          <button className="auth-password-toggle" type="button" aria-label={showRecoveryPassword ? "Hide new password" : "Show new password"} aria-pressed={showRecoveryPassword} onClick={() => setShowRecoveryPassword((visible) => !visible)}>{showRecoveryPassword ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}</button>
                        </div>
                        {recoveryPasswordErrors.recoveryPassword ? <p id="recovery-password-error" className="auth-form-message auth-form-error" role="alert">{recoveryPasswordErrors.recoveryPassword}</p> : <p id="recovery-password-help" className="auth-field-hint">Use at least 8 characters.</p>}
                      </div>

                      <div className="auth-details-field">
                        <label className="auth-details-label" htmlFor="recovery-confirm-password">Confirm New Password</label>
                        <div className="auth-input-field">
                          <FiLock aria-hidden="true" className="auth-input-icon" />
                          <input id="recovery-confirm-password" name="confirm-new-password" type={showRecoveryConfirmPassword ? "text" : "password"} autoComplete="new-password" value={recoveryConfirmPassword} onChange={(event) => updateRecoveryPassword("recoveryConfirmPassword", event.target.value)} aria-invalid={Boolean(recoveryPasswordErrors.recoveryConfirmPassword)} aria-describedby={recoveryPasswordErrors.recoveryConfirmPassword ? "recovery-confirm-password-error" : undefined} placeholder="Confirm new password" />
                          <button className="auth-password-toggle" type="button" aria-label={showRecoveryConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showRecoveryConfirmPassword} onClick={() => setShowRecoveryConfirmPassword((visible) => !visible)}>{showRecoveryConfirmPassword ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}</button>
                        </div>
                        {recoveryPasswordErrors.recoveryConfirmPassword && <p id="recovery-confirm-password-error" className="auth-form-message auth-form-error" role="alert">{recoveryPasswordErrors.recoveryConfirmPassword}</p>}
                      </div>

                      {recoveryPasswordNotice && <p className="auth-form-message auth-recovery-notice" role="status">{recoveryPasswordNotice}</p>}
                      <button type="submit" className="auth-continue-button">Reset Password</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-form-card">
              <div className="auth-form-content auth-signup-screen">
                {signupStage === "details" ? (
                  <>
                    <button type="button" className="auth-back-link" onClick={backToOtp}><FiArrowLeft aria-hidden="true" /> Back to verification</button>
                    <h1 id="auth-modal-title">Create Your Account</h1>
                    <p id="account-details-description" className="auth-subtitle">Just a few details to get started.</p>

                    <div className="auth-mobile-summary" aria-label={`Mobile number +91 ${phone}; not verified in preview`}>
                      <FiPhone aria-hidden="true" />
                      <span className="auth-mobile-summary__label">Mobile number</span>
                      <strong>+91 {phone.slice(0, 5)} {phone.slice(5)}</strong>
                      <span className="auth-preview-badge">UI Preview · Not verified</span>
                    </div>
                    <p className="auth-account-disclaimer" role="status">{otpNotice || "Preview navigation only. Your mobile number has not been verified."}</p>

                    <form className="auth-account-form" onSubmit={handleAccountSubmit} noValidate>
                      <div className="auth-account-fields">
                        <div className="auth-details-field">
                        <label className="auth-details-label" htmlFor="signup-full-name">Full Name</label>
                        <div className="auth-input-field">
                          <FiUser aria-hidden="true" className="auth-input-icon" />
                          <input id="signup-full-name" name="full-name" type="text" autoComplete="name" required value={fullName} onChange={(event) => updateAccountField("fullName", event.target.value, setFullName)} aria-invalid={Boolean(accountErrors.fullName)} aria-describedby={accountErrors.fullName ? "signup-full-name-error" : undefined} placeholder="Enter your full name" />
                        </div>
                        {accountErrors.fullName && <p id="signup-full-name-error" className="auth-form-message auth-form-error" role="alert">{accountErrors.fullName}</p>}
                        </div>

                        <div className="auth-details-field">
                        <label className="auth-details-label" htmlFor="signup-email">Email Address</label>
                        <div className="auth-input-field">
                          <FiMail aria-hidden="true" className="auth-input-icon" />
                          <input id="signup-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => updateAccountField("email", event.target.value, setEmail)} aria-invalid={Boolean(accountErrors.email)} aria-describedby={accountErrors.email ? "signup-email-error" : undefined} placeholder="Enter your email address" />
                        </div>
                        {accountErrors.email && <p id="signup-email-error" className="auth-form-message auth-form-error" role="alert">{accountErrors.email}</p>}
                        </div>

                        <div className="auth-details-field">
                        <label className="auth-details-label" htmlFor="signup-password">Password</label>
                        <div className="auth-input-field">
                          <FiLock aria-hidden="true" className="auth-input-icon" />
                          <input id="signup-password" name="new-password" type={showAccountPassword ? "text" : "password"} autoComplete="new-password" required value={accountPassword} onChange={(event) => updateAccountField("accountPassword", event.target.value, setAccountPassword)} aria-invalid={Boolean(accountErrors.accountPassword)} aria-describedby={accountErrors.accountPassword ? "signup-password-error" : "signup-password-help"} placeholder="Create password" />
                          <button className="auth-password-toggle" type="button" aria-label={showAccountPassword ? "Hide password" : "Show password"} aria-pressed={showAccountPassword} onClick={() => setShowAccountPassword((visible) => !visible)}>{showAccountPassword ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}</button>
                        </div>
                        {accountErrors.accountPassword ? <p id="signup-password-error" className="auth-form-message auth-form-error" role="alert">{accountErrors.accountPassword}</p> : <p id="signup-password-help" className="auth-field-hint">Use at least 8 characters.</p>}
                        </div>

                        <div className="auth-details-field">
                        <label className="auth-details-label" htmlFor="signup-confirm-password">Confirm Password</label>
                        <div className="auth-input-field">
                          <FiLock aria-hidden="true" className="auth-input-icon" />
                          <input id="signup-confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={(event) => updateAccountField("confirmPassword", event.target.value, setConfirmPassword)} aria-invalid={Boolean(accountErrors.confirmPassword)} aria-describedby={accountErrors.confirmPassword ? "signup-confirm-password-error" : undefined} placeholder="Confirm your password" />
                          <button className="auth-password-toggle" type="button" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword((visible) => !visible)}>{showConfirmPassword ? <FiEye aria-hidden="true" /> : <FiEyeOff aria-hidden="true" />}</button>
                        </div>
                        {accountErrors.confirmPassword && <p id="signup-confirm-password-error" className="auth-form-message auth-form-error" role="alert">{accountErrors.confirmPassword}</p>}
                        </div>
                      </div>

                      <div className="auth-terms-block">
                        <label className="auth-terms-option">
                          <input type="checkbox" required checked={termsAccepted} onChange={(event) => { setTermsAccepted(event.target.checked); setAccountErrors((current) => { const next = { ...current }; delete next.termsAccepted; return next; }); setAccountNotice(""); }} aria-invalid={Boolean(accountErrors.termsAccepted)} aria-describedby={accountErrors.termsAccepted ? "signup-terms-error" : "signup-policy-pending"} />
                          <span>I agree to the <span className="auth-policy-name">Terms &amp; Conditions</span> and <span className="auth-policy-name">Privacy Policy</span></span>
                        </label>
                        {accountErrors.termsAccepted && <p id="signup-terms-error" className="auth-form-message auth-form-error" role="alert">{accountErrors.termsAccepted}</p>}
                        <p id="signup-policy-pending" className="auth-field-hint">Policy pages are not available yet.</p>
                      </div>

                      {accountNotice && <p className="auth-form-message auth-account-notice" role="status">{accountNotice}</p>}
                      <button type="submit" className="auth-continue-button">Create Account</button>
                    </form>

                    <p className="auth-signup-prompt">Already have an account? <button type="button" onClick={showLogin}>Sign In</button></p>
                  </>
                ) : (
                  <>
                    <h1 id="auth-modal-title">Create Your Account</h1>
                    <p id="signup-description" className="auth-subtitle">Start by verifying your mobile number.</p>

                    <form className="auth-login-form" onSubmit={handleSignupSubmit} noValidate>
                      <label className="auth-input-field auth-phone-field">
                        <FiPhone aria-hidden="true" className="auth-input-icon" />
                        <span className="sr-only">Mobile number with India country code +91</span>
                        <span className="auth-country-prefix" aria-hidden="true">+91</span>
                        <input ref={phoneRef} name="mobile-number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} readOnly={signupStage === "otp"} value={phone} onChange={handlePhoneChange} placeholder="Enter 10-digit mobile number" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? "signup-phone-error" : "signup-description"} />
                      </label>

                      {signupStage === "phone" ? (
                        <>
                          {phoneError && <p id="signup-phone-error" className="auth-form-message auth-form-error" role="alert">{phoneError}</p>}
                          <button type="submit" className="auth-continue-button">Send OTP</button>
                        </>
                      ) : (
                        <section className="auth-otp-section" aria-labelledby="auth-otp-heading">
                          <div className="auth-otp-heading-row">
                            <h2 id="auth-otp-heading">Enter Verification Code</h2>
                            <span className="auth-preview-badge">UI Preview</span>
                          </div>
                          <p className="auth-otp-description">Enter the 6-digit code for +91 XXXXX {phone.slice(-5)}</p>

                          <OtpInputGroup otp={otp} refs={otpRefs} onChange={handleOtpChange} onPaste={handleOtpPaste} onKeyDown={handleOtpKeyDown} />
                          <p className="auth-otp-hint" aria-live="polite">{otp.every(Boolean) ? "All six digits entered." : "Enter all six digits to enable verification."}</p>

                          <div className="auth-otp-resend-row">
                            <span>Resend OTP</span>
                            <button type="button" disabled title="Resend is unavailable in UI Preview mode">Unavailable in UI Preview</button>
                          </div>
                          <p className="auth-otp-preview-note">UI Preview only. No SMS was sent.</p>
                          {otpNotice && <p className="auth-form-message auth-otp-status" role="status">{otpNotice}</p>}
                          <button type="button" className="auth-continue-button" disabled={otp.some((digit) => !digit)} onClick={handleVerifyPreview}>Verify &amp; Continue</button>
                          <button type="button" className="auth-change-number" onClick={changeMobileNumber}>Change Mobile Number</button>
                        </section>
                      )}
                    </form>

                    <p className="auth-signup-prompt">Already have an account? <button type="button" onClick={showLogin}>Sign In</button></p>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </dialog>
  );
}
