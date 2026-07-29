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

const collectorNextSteps = [
  {
    title: "Add your first card",
    description: "Start with one card you own so Beacon can build your dashboard.",
  },
  {
    title: "Create a wishlist item",
    description: "Track cards you are chasing without mixing them into your owned collection.",
  },
  {
    title: "Build a binder",
    description: "Use binders for master sets, favorite players, trades, or personal goals.",
  },
];

const storeNextSteps = [
  {
    title: "Complete your store profile",
    description: "Add your shop location, specialty, and what collectors can expect.",
  },
  {
    title: "Post your first event",
    description: "Add a trade night, card show, release event, or shop meetup.",
  },
  {
    title: "Share your profile",
    description: "Let collectors save your shop and follow what is happening locally.",
  },
];

function Onboarding({ onComplete }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("Collector");
  const [favoriteTcg, setFavoriteTcg] = useState("Pokémon");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isStore = accountType === "Store";
  const nextSteps = isStore ? storeNextSteps : collectorNextSteps;

  function getCleanUsername() {
    return username.trim().toLowerCase();
  }

  function validateUsername() {
    const cleanUsername = getCleanUsername();

    if (!cleanUsername) {
      setMessage("Choose a username first.");
      return false;
    }

    if (!/^[a-z0-9._-]{3,24}$/.test(cleanUsername)) {
      setMessage(
        "Usernames must be 3-24 characters and can use letters, numbers, dots, underscores, or hyphens."
      );
      return false;
    }

    setMessage("");
    return true;
  }

  function goToNextStep() {
    if (step === 2 && !validateUsername()) {
      return;
    }

    setMessage("");
    setStep((currentStep) => Math.min(currentStep + 1, 3));
  }

  function goToPreviousStep() {
    setMessage("");
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setMessage("Sign in before setting up your profile.");
      return;
    }

    if (!validateUsername()) {
      return;
    }

    const cleanUsername = getCleanUsername();

    setIsSaving(true);
    setMessage("");

    try {
      const existingUsername = await getProfileByUsername(cleanUsername);

      if (existingUsername && existingUsername.id !== user.id) {
        setMessage("That username is already taken. Try another one.");
        setStep(2);
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
        title="Set up your account"
        description="Create the profile collectors and shops will see across Beacon."
      />

      <section className="onboarding-launch-card">
        <aside className="onboarding-progress-panel">
          <p className="page-label">SETUP</p>
          <h2>Make Beacon yours.</h2>
          <p>
            This setup decides how your account appears in community search,
            public profiles, saved shops, events, binders, and collector discovery.
          </p>

          <div className="onboarding-progress-list">
            <div className={step >= 1 ? "active-step" : ""}>
              <span>01</span>
              <strong>Choose account type</strong>
            </div>

            <div className={step >= 2 ? "active-step" : ""}>
              <span>02</span>
              <strong>Create your profile</strong>
            </div>

            <div className={step >= 3 ? "active-step" : ""}>
              <span>03</span>
              <strong>Review next steps</strong>
            </div>
          </div>
        </aside>

        <form className="onboarding-profile-form onboarding-wizard" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="onboarding-step-panel">
              <p className="page-label">STEP 1</p>
              <h2>What kind of account are you creating?</h2>
              <p>
                Collectors and stores use Beacon differently. Pick the account
                type that best fits how you want to use the platform.
              </p>

              <div className="onboarding-choice-grid" aria-label="Account type">
                <button
                  className={accountType === "Collector" ? "active-choice" : ""}
                  type="button"
                  onClick={() => setAccountType("Collector")}
                >
                  <span>Collector</span>
                  <small>Track cards, binders, trades, values, wishlists, and your public profile.</small>
                </button>

                <button
                  className={accountType === "Store" ? "active-choice" : ""}
                  type="button"
                  onClick={() => setAccountType("Store")}
                >
                  <span>Store</span>
                  <small>Post events, trade nights, card shows, and shop activity for collectors.</small>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step-panel">
              <p className="page-label">STEP 2</p>
              <h2>{isStore ? "Set up your store profile" : "Set up your collector profile"}</h2>
              <p>
                Keep this simple for now. You can update your profile, avatar,
                featured card, and public binder settings later.
              </p>

              <label>
                <span>Username</span>
                <input
                  type="text"
                  placeholder={isStore ? "Example: beacon-cards" : "Example: vintageadam"}
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toLowerCase())}
                />
              </label>

              <label>
                <span>{isStore ? "Store category" : "What do you collect?"}</span>
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
                <span>{isStore ? "Store city or area" : "City or area"}</span>
                <input
                  type="text"
                  placeholder="Example: Sacramento, CA"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </label>

              <label>
                <span>{isStore ? "Store bio" : "Short bio"}</span>
                <textarea
                  placeholder={
                    isStore
                      ? "Tell collectors what your shop is known for."
                      : "Tell collectors what you collect, trade, or chase."
                  }
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                ></textarea>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step-panel">
              <p className="page-label">STEP 3</p>
              <h2>{isStore ? "Your store is ready to set up." : "Your collection hub is ready."}</h2>
              <p>
                Beacon will create your {isStore ? "store" : "collector"} profile
                now. Once you enter the app, these are the first actions worth taking.
              </p>

              <div className="onboarding-next-grid">
                {nextSteps.map((item, index) => (
                  <div key={item.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="onboarding-profile-actions">
            {step > 1 && (
              <button
                className="secondary-button"
                type="button"
                onClick={goToPreviousStep}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button className="primary-button" type="button" onClick={goToNextStep}>
                Continue
              </button>
            ) : (
              <button className="primary-button" type="submit" disabled={isSaving}>
                {isSaving ? "Creating Profile..." : "Enter Beacon"}
              </button>
            )}

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
