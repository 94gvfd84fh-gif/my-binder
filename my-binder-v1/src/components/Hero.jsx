function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="hero-subtitle">WELCOME BACK 👋</p>

        <h1>Build your collection.</h1>

        <p>
          Organize your cards, complete your sets,
          and share your collection with the world.
        </p>

        <button>View Collection</button>
      </div>

      <div className="hero-card">
        <div className="card-placeholder">
          MY
          <br />
          BINDER
        </div>
      </div>
    </section>
  );
}

export default Hero;