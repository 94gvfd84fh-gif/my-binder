import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { getProfile, saveProfile } from "../services/profileService";
import PageHeader from "../ui/PageHeader";

function Auth() {
  const { user, authLoading } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  async function handleMagicLink(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Enter your email first.");
      return;
    }

    setIsSending(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
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

  async function handleCreateProfile() {
    if (!user) {
      setMessage("You need to sign in first.");
      return;
    }

    setIsSavingProfile(true);
    setMessage("");

    try {
      const existingProfile = await getProfile(user.id);

      if (existingProfile) {
        setMessage("Your Supabase profile already exists.");
        setIsSavingProfile(false);
        return;
      }

      await saveProfile({
        id: user.id,
        username: "Beacon Collector",
        favorite_tcg: "Pokémon",
        favorite_set: "",
        location: "",
        collector_since: "",
        bio: "",
        avatar: "",
        featured_card_id: "",
        updated_at: new Date().toISOString(),
      });

      setMessage("Your Supabase profile was created.");
    } catch (error) {
      setMessage(error.message);
    }

    setIsSavingProfile(false);
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
          title="You are signed in"
          description="Your Beacon Collect account connection is working."
        />

        <div className="auth-card">
          <p className="page-label">SIGNED IN</p>
          <h2>{user.email}</h2>
          <p>
            Supabase authentication is connected. Your collection, profile, and
            binders can now save to your Beacon Collect account.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={handleCreateProfile}
            disabled={isSavingProfile}
          >
            {isSavingProfile ? "Saving Profile..." : "Create Supabase Profile"}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={handleSignOut}
          >
            Sign Out
          </button>

          {message && <p className="auth-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        label="BEACON COLLECT BETA"
        title="Help test Beacon Collect"
        description="Try the beta in 3 minutes and tell us what feels useful, confusing, or missing."
      />

      <section className="beta-welcome-card">
        <div className="beta-welcome-copy">
          <p className="page-label">HOW TO TEST</p>
          <h2>A quick mission for collectors</h2>
          <p>
            Beacon is easiest to improve when testers follow the same simple
            path. Add a few cards, try the community tools, then leave one note
            about what should be better.
          </p>
        </div>

        <div className="beta-welcome-steps">
          <div>
            <span>01</span>
            <strong>Add a card you own</strong>
          </div>

          <div>
            <span>02</span>
            <strong>Add a wishlist card</strong>
          </div>

          <div>
            <span>03</span>
            <strong>Mark one card for trade</strong>
          </div>

          <div>
            <span>04</span>
            <strong>Leave feedback</strong>
          </div>
        </div>
      </section>

      <form className="auth-card" onSubmit={handleMagicLink}>
        <p className="page-label">SIGN IN TO START TESTING</p>
        <h2>Enter your email</h2>
        <p>We will send you a secure login link. No password needed.</p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button className="primary-button" type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send Login Link"}
        </button>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}

export default Auth;