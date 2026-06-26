import cards from "./data/cards";
import "./App.css";
import AddCardForm from "./components/AddCardForm";
function App() {
  const recentCards = cards.slice(0, 5);

  const totalCards = cards.length;

  const collectionValue = cards.reduce((total, card) => {
    return total + card.value;
  }, 0);

  const favoriteCards = cards.filter((card) => card.favorite).length;

  const tradeCards = cards.filter((card) => card.status === "For Trade").length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-cards">
            <div></div>
            <div></div>
            <div>M</div>
          </div>

          <div>
            <h1>
              MY <span>BINDER</span>
            </h1>
            <p>COLLECT. SHOWCASE. TRADE.</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className="active">⌂ Dashboard</a>
          <a>▣ Binder</a>
          <a>▤ Collection</a>
          <a>🛒 Marketplace</a>
          <a>○ Profile</a>
        </nav>

        <div className="premium-card">
          <div className="premium-icon">☆</div>
          <h3>Go Premium</h3>
          <p>Unlock advanced features and grow your collection.</p>
          <button>UPGRADE NOW</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <input placeholder="🔍  Search cards, sets, or users..." />

          <div className="profile">
            <span>🔔</span>
            <div className="avatar"></div>
            <p>Adam⌄</p>
          </div>
        </div>

        <section className="hero">
          <div>
            <p className="eyebrow">
              WELCOME <span>BACK, ADAM!</span> 👋
            </p>
            <h2>Build your legacy.</h2>
            <p>
              Organize your cards. Complete your sets.
              <br />
              Connect with collectors.
            </p>
          </div>

          <div className="hero-art">
            <div className="back-card left"></div>
            <div className="main-card">M</div>
            <div className="back-card right"></div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card blue">
            <div className="icon">▰</div>
            <div>
              <p>TOTAL CARDS</p>
              <h3>{totalCards}</h3>
              <small>From your collection</small>
            </div>
          </div>

          <div className="stat-card green">
            <div className="icon">$</div>
            <div>
              <p>COLLECTION VALUE</p>
              <h3>${collectionValue}</h3>
              <small>Total estimated value</small>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="icon">♥</div>
            <div>
              <p>FAVORITES</p>
              <h3>{favoriteCards}</h3>
              <small>View favorites →</small>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="icon">↔</div>
            <div>
              <p>FOR TRADE</p>
              <h3>{tradeCards}</h3>
              <small>Manage trades →</small>
            </div>
          </div>
        </section>

        <section className="panel">
          <h3>QUICK ACTIONS</h3>

          <div className="quick-actions">
            <button>
              <span>▣</span>
              <div>
                Add Card
                <small>Add to collection</small>
              </div>
            </button>

            <button>
              <span>▦</span>
              <div>
                View Binder
                <small>Open your binder</small>
              </div>
            </button>

            <button>
              <span>🔍</span>
              <div>
                Search Cards
                <small>Find cards</small>
              </div>
            </button>

            <button>
              <span>↔</span>
              <div>
                Browse Marketplace
                <small>Buy & trade</small>
              </div>
            </button>
          </div>
        </section>

        <section className="panel recent-panel">
          <div className="panel-title">
            <h3>RECENT ADDITIONS</h3>
            <a>View all</a>
          </div>

          <div className="recent-grid">
            {recentCards.map((card) => (
              <div className="recent-card" key={card.id}>
                <img src={card.image} alt={card.name} className="card-image" />
                <h4>{card.name}</h4>
                <p>{card.set}</p>
                <span>{card.favorite ? "★" : "☆"}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;