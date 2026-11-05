"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiUser, FiX } from "react-icons/fi";

export function AuthModal({ open, onClose, returnFocusRef }) {
  const dialogRef = useRef(null);
  const identityRef = useRef(null);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (open && !dialog.open) {
      const previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => identityRef.current?.focus());
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    if (!open && dialog.open) dialog.close();
    return undefined;
  }, [open]);

  function handleClose() {
    setMessage("");
    setScreen("login");
    onClose();
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Sign-in is a visual preview. No account details are sent and no session is created.");
  }

  return (
    <dialog
      ref={dialogRef}
      className="auth-dialog"
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
              <h2>Rent. Set Up.<br />Live Comfortably.</h2>
              <p>Furniture, home appliances and more on flexible rental plans in Bengaluru.</p>
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
                    <button className="auth-text-link" type="button" onClick={() => setMessage("Password recovery is not available in this preview.")}>Forgot password?</button>
                  </div>

                  {message && <p className="auth-form-message" role="status">{message}</p>}
                  <button type="submit" className="auth-continue-button">Sign In</button>
                </form>

                <div className="auth-social-divider" aria-label="or continue with"><span>or continue with</span></div>
                <div className="auth-social-options">
                  <button type="button" className="auth-social-button" disabled title="Google sign-in is not configured">
                    <FcGoogle aria-hidden="true" /> <span>Continue with Google</span>
                  </button>
                </div>
                <p className="auth-preview-note">Google sign-in is a visual preview only. Authentication is not connected.</p>
                <p className="auth-signup-prompt">Don&apos;t have an account? <button type="button" onClick={() => { setMessage(""); setScreen("signup-preview"); }}>Sign Up</button></p>
              </div>
            </div>
          ) : (
            <div className="auth-form-card">
              <div className="auth-form-content auth-next-screen" aria-live="polite">
                <h1 id="auth-modal-title">Sign Up</h1>
                <p className="auth-subtitle">This screen is planned for the next authentication design step.</p>
                <button type="button" className="auth-continue-button" onClick={() => setScreen("login")}>Back to Welcome Back</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </dialog>
  );
}
