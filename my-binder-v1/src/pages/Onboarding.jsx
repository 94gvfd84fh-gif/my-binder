import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { getProfileByUsername, saveProfile } from "../services/profileService";
import PageHeader from "../ui/PageHeader";

const collectingOptions = [
  "Pokémon",
  "Sports Cards",
  "One Piece",
  "Yu-Gi-Oh!",
  "Magic: The Gathering",
  "Lorcana",
  "Union Arena",
  "Other",
];

function Onboarding({ onComplete }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("Collector");
  const [favoriteTcg, setFavoriteTcg] = useState("Pokémon");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setMessage("Sign in before setting up your profile.");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      setMessage("Choose a username first.");
      return;
    }

    if (!/^[a-z0-9._-]{3,24}$/.test(cleanUsername)) {
      setMessage(
        "Usernames must be 3-24 characters and can use letters, numbers, dots, underscores, or hyphens."
      );
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const existingUsername = await getProfileByUsername(cleanUsername);

      if (existingUsername && existingUsername.id !== user.id) {
        setMessage("That username is already taken. Try another one.");
        setIsSaving(false);
        return;
      }

      await saveProfile({
        id: user.id,
        username: cleanUsername,
        account_type: accountType,
        favorite_tcg: favoriteTcg,
        favorite_set: "",
        location: location.trim(),
        collector_since: new Date().getFullYear().toString(),
        bio: bio.trim(),
        avatar: "",
        featured_card_id: "",
        updated_at: new Date().toISOString(),
      });

      if (onComplete) {
        onComplete();
      }

      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }

    setIsSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div>
      <PageHeader
        label="WELCOME TO BEACON COLLECT"
        title="Set up your profile"
        description="Choose how collectors and shops will find you in Beacon."
      />

      <section className="onboarding-profile-card">
        <div className="onboarding-profile-intro">
          <p className="page-label">FIRST STEP</p>
          <h2>Make Beacon yours</h2>
          <p>
            Your username and account type help power community search, public
            profiles, store events, and collector discovery. Usernames are unique
            and become part of how people recognize you.
          </p>
        </div>

        <form className="onboarding-profile-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              placeholder="Example: vintageadam"
              value={username}
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
            />
          </label>

          <div className="onboarding-choice-grid" aria-label="Account type">
            <button
              className={accountType === "Collector" ? "active-choice" : ""}
              type="button"
              onClick={() => setAccountType("Collector")}
            >
              <span>Collector</span>
              <small>Track cards, binders, trades, and wishlists.</small>
            </button>

            <button
              className={accountType === "Store" ? "active-choice" : ""}
              type="button"
              onClick={() => setAccountType("Store")}
            >
              <span>Store</span>
              <small>Post events, trade nights, and shop activity.</small>
            </button>
          </div>

          <label>
            <span>What do you collect?</span>
            <select
              value={favoriteTcg}
              onChange={(event) => setFavoriteTcg(event.target.value)}
            >
              {collectingOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label>
            <span>City or area</span>
            <input
              type="text"
              placeholder="Example: Sacramento, CA"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </label>

          <label>
            <span>Short bio</span>
            <textarea
              placeholder={
                accountType === "Store"
                  ? "Tell collectors what your shop is known for."
                  : "Tell collectors what you collect or trade."
              }
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            ></textarea>
          </label>

          <div className="onboarding-profile-actions">
            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Start Using Beacon"}
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          {message && <p className="auth-message">{message}</p>}
        </form>
      </section>
    </div>
  );
}

export default Onboarding;
