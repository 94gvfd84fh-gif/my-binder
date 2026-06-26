import { useContext } from "react";
import { CardContext } from "../context/CardContext";
import PageHeader from "../ui/PageHeader";

function Profile() {
  const { cards, setCards } = useContext(CardContext);

  const totalCards = cards.length;
  const totalValue = cards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const gradedCards = cards.filter((card) => {
    return card.gradingCompany && card.gradingCompany !== "Raw";
  }).length;

  const favoriteCards = cards.filter((card) => card.favorite).length;

  function exportCollection() {
    const data = JSON.stringify(cards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "vaulted-collection-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importCollection(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      try {
        const importedCards = JSON.parse(reader.result);

        if (!Array.isArray(importedCards)) {
          alert("Invalid backup file.");
          return;
        }

        const confirmImport = confirm(
          "This will replace your current collection with the imported backup. Continue?"
        );

        if (!confirmImport) return;

        setCards(importedCards);
        alert("Collection imported successfully.");
      } catch {
        alert("Could not import this file.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div>
      <PageHeader
        label="VAULTED PROFILE"
        title="Profile"
        description="Manage your collector profile, app settings, and collection summary."
      />

      <div className="profile-grid">
        <div className="profile-card">
          <p className="page-label">COLLECTOR</p>
          <h2>Vaulted Collector</h2>
          <p>Your collection. Protected.</p>
        </div>

        <div className="profile-card">
          <p className="page-label">APP VERSION</p>
          <h2>Vaulted v0.4</h2>
          <p>Collector experience and workflow improvements.</p>
        </div>

        <div className="profile-card">
          <p className="page-label">COLLECTION SUMMARY</p>
          <h2>{totalCards} Cards</h2>
          <p>${totalValue.toLocaleString()} estimated value</p>
          <p>{favoriteCards} favorites</p>
          <p>{gradedCards} graded cards</p>
        </div>

        <div className="profile-card">
          <p className="page-label">BACKUP</p>
          <h2>Export Collection</h2>
          <p>Download your Vaulted collection as a backup file.</p>
          <button className="primary-button" onClick={exportCollection}>
            Export Backup
          </button>
        </div>

        <div className="profile-card">
          <p className="page-label">RESTORE</p>
          <h2>Import Collection</h2>
          <p>Restore your collection from a Vaulted backup file.</p>
          <input
            type="file"
            accept="application/json"
            onChange={importCollection}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;