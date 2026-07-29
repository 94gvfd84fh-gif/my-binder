import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import PageHeader from "../ui/PageHeader";

const authFeatures = [
  "Track collections, binders, wishlists, and values",
  "Create a collector or store profile",
  "Save events, shops, and community activity",
];

function Auth() {
  const { user, authLoading } = useContext(AuthContext);

  const [authMode, setAuthMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [confirmAccountPassword, setConfirmAccountPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const isSignup = authMode === "signup";

  function getCleanEmail() {
    return email.trim().toLowerCase();
  }

  function validateEmailAndPassword() {
    if (!getCleanEmail()) {
      setMessage("Enter your email first.");
      return false;
    }

    if (!password) {
      setMessage("Enter your password.");
      return false;
    }

    if (password.length < 8) {
      setMessage("Your password needs to be at least 8 characters.");
      return false;
    }

    if (isSignup && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  }

  async function handlePasswordAuth(event) {
    event.preventDefault();

    if (!validateEmailAndPassword()) {
      return;
    }

    setIsSending(true);
    setMessage("");

    const authRequest = isSignup
      ? supabase.auth.signUp({
          email: getCleanEmail(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        })
      : supabase.auth.signInWithPassword({
          email: getCleanEmail(),
          password,
        });

    const { error } = await authRequest;

    setIsSending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (isSignup) {
      setMessage(
        "Account created. Check your email if Beacon asks you to confirm your address."
      );
      return;
    }

    setMessage("Signed in successfully.");
  }

  async function handleMagicLink() {
    if (!getCleanEmail()) {
      setMessage("Enter your email first, then request a login link.");
      return;
    }

    setIsSending(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: getCleanEmail(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });

    setIsSending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for a Beacon Collect login link.");
  }

  async function handlePasswordReset() {
    if (!getCleanEmail()) {
      setMessage("Enter your email first, then request a password setup link.");
      return;
    }

    setIsSending(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(getCleanEmail(), {
      redirectTo: `${window.location.origin}/auth`,
    });

    setIsSending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for a password setup link.");
  }

  async function handleUpdatePassword(event) {
    event.preventDefault();

    if (accountPassword.length < 8) {
      setMessage("Your new password needs to be at least 8 characters.");
      return;
    }

    if (accountPassword !== confirmAccountPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: accountPassword,
    });

    setIsUpdatingPassword(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setAccountPassword("");
    setConfirmAccountPassword("");
    setMessage("Password updated. You can now sign in with email and password.");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMessage("Signed out.");
  }

  if (authLoading) {
    return (
      <div>
        <PageHeader
          label="BEACON COLLECT ACCOUNT"
          title="Checking account"
          description="Loading your Beacon Collect account status."
        />
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <PageHeader
          label="BEACON COLLECT ACCOUNT"
          title="Your account is ready"
          description="You can now save your collection, profile, binders, and community activity."
        />

        <div className="auth-card signed-in-card">
          <p className="page-label">SIGNED IN</p>
          <h2>{user.email}</h2>
          <p>
            Your Beacon account is active. Manage your profile, collection,
            binders, wishlist items, and community activity from one place.
          </p>

          <div className="auth-action-row">
            <Link className="primary-button" to="/profile">
              Open Profile
            </Link>

            <Link className="secondary-button" to="/">
              Go to Dashboard
            </Link>

            <button
              className="secondary-button"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <form className="account-password-panel" onSubmit={handleUpdatePassword}>
            <div>
              <p className="page-label">PASSWORD</p>
              <h3>Set or change your password</h3>
              <p>
                If you signed in with an email link, create a password here so
                you can sign in normally next time.
              </p>
            </div>

            <label className="auth-field">
              <span>New password</span>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={accountPassword}
                onChange={(event) => setAccountPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <label className="auth-field">
              <span>Confirm new password</span>
              <input
                type="password"
                placeholder="Re-enter your new password"
                value={confirmAccountPassword}
                onChange={(event) => setConfirmAccountPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          {message && <p className="auth-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        label="BEACON COLLECT"
        title="Create your account"
        description="Sign up to track your collection, build your profile, and connect with the collector community."
      />

      <section className="auth-launch-layout">
        <div className="auth-brand-panel">
          <p className="page-label">A HOME FOR COLLECTORS</p>
          <h2>Everything your hobby needs, under one roof.</h2>
          <p>
            Beacon Collect helps collectors and stores organize collections,
            share profiles, discover events, and build community around the
            cards they love.
          </p>

          <div className="auth-feature-list">
            {authFeatures.map((feature) => (
              <div key={feature}>
                <span aria-hidden="true">✓</span>
                <strong>{feature}</strong>
              </div>
            ))}
          </div>
        </div>

        <form className="auth-card" onSubmit={handlePasswordAuth}>
          <div className="auth-tabs" aria-label="Account action">
            <button
              className={isSignup ? "active-auth-tab" : ""}
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setMessage("");
              }}
            >
              Create Account
            </button>

            <button
              className={!isSignup ? "active-auth-tab" : ""}
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setMessage("");
              }}
            >
              Sign In
            </button>
          </div>

          <p className="page-label">
            {isSignup ? "NEW ACCOUNT" : "WELCOME BACK"}
          </p>

          <h2>{isSignup ? "Join Beacon Collect" : "Sign in to Beacon"}</h2>

          <p>
            {isSignup
              ? "Create an account with your email and password. Then you will set your username and account type."
              : "Use the email and password connected to your Beacon account."}
          </p>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </label>

          {isSignup && (
            <label className="auth-field">
              <span>Confirm password</span>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>
          )}

          <button className="primary-button" type="submit" disabled={isSending}>
            {isSending
              ? "Working..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>

          {!isSignup && (
            <button
              className="auth-link-button"
              type="button"
              onClick={handlePasswordReset}
              disabled={isSending}
            >
              Forgot or need to create your password?
            </button>
          )}

          <button
            className="auth-link-button"
            type="button"
            onClick={handleMagicLink}
            disabled={isSending}
          >
            Email me a login link instead
          </button>

          {message && <p className="auth-message">{message}</p>}
        </form>
      </section>
    </div>
  );
}

export default Auth;