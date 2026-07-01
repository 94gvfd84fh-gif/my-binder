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
        label="BEACON COLLECT ACCOUNT"
        title="Sign in"
        description="Use your email to start saving Beacon Collect data to your account."
      />

      <form className="auth-card" onSubmit={handleMagicLink}>
        <p className="page-label">MAGIC LINK</p>
        <h2>Sign in with email</h2>
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