import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BinderContext, BINDER_VISIBILITY } from "../context/BinderContext";
import { CardContext } from "../context/CardContext";
import { STORAGE_KEYS } from "../constants/storageKeys";
import demoCards from "../data/cards";
import PageHeader from "../ui/PageHeader";

const demoBinders = [
  "Main Collection",
  "Showcase Binder",
  "Trade Binder",
  "Graded Collection",
  "Wishlist",
  "Vintage Fire",
  "Sports Showcase",
  "Chase List",
  "Anime TCG",
];

const demoGoals = {
  "Vintage Fire": 12,
  "Sports Showcase": 25,
  "Chase List": 10,
  "Anime TCG": 18,
};

const demoVisibility = {
  "Main Collection": BINDER_VISIBILITY.PUBLIC,
  "Showcase Binder": BINDER_VISIBILITY.PUBLIC,
  "Trade Binder": BINDER_VISIBILITY.TRADE_VISIBLE,
  "Graded Collection": BINDER_VISIBILITY.PRIVATE,
  Wishlist: BINDER_VISIBILITY.PRIVATE,
  "Vintage Fire": BINDER_VISIBILITY.PUBLIC,
  "Sports Showcase": BINDER_VISIBILITY.PUBLIC,
  "Chase List": BINDER_VISIBILITY.PRIVATE,
  "Anime TCG": BINDER_VISIBILITY.PUBLIC,
};

function DemoSetup() {
  const { loadDemoCards } = useContext(CardContext);
  const {
    replaceBinders,
    replaceBinderGoals,
    replaceBinderVisibility,
  } = useContext(BinderContext);
  const [message, setMessage] = useState("");

  function loadDemoSetup() {
    loadDemoCards();
    replaceBinders(demoBinders);
    replaceBinderGoals(demoGoals);
    replaceBinderVisibility(demoVisibility);

    localStorage.setItem(
      STORAGE_KEYS.savedEvents,
      JSON.stringify(["sacramento-card-show", "friday-trade-night"])
    );
    localStorage.setItem(
      STORAGE_KEYS.savedShops,
      JSON.stringify(["golden-empire-card-shop", "hobby-vault"])
    );
    localStorage.setItem(
      STORAGE_KEYS.followedCollectors,
      JSON.stringify(["vintage-adam", "slabqueen", "onepiecehunter"])
    );

    setMessage("Demo setup loaded. Your dashboard is ready to record.");
  }

  return (
    <div>
      <PageHeader
        label="BEACON COLLECT DEMO"
        title="Reel Demo Setup"
        description="Load a polished sample collection, binders, wishlist, events, and community activity for screen recording."
      />

      <section className="demo-setup-card">
        <p className="page-label">15–30 SECOND REEL</p>
        <h2>Make Beacon look active instantly</h2>
        <p>
          This fills the app with realistic demo cards, custom binders, trade
          cards, sale cards, wishlist items, saved events, local shops, and
          followed collectors. It only affects this browser session unless you
          choose to sync data later.
        </p>

        <div className="demo-setup-actions">
          <button className="primary-button" type="button" onClick={loadDemoSetup}>
            Load Demo Setup
          </button>

          <Link className="secondary-button" to="/">
            Open Dashboard
          </Link>
        </div>

        {message && <p className="auth-message">{message}</p>}
      </section>
    </div>
  );
}

export default DemoSetup;
