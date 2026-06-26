function Stats() {
  return (
    <section className="stats">
      <div className="stat-card blue">
        <p>TOTAL CARDS</p>
        <h2>0</h2>
        <span>From your collection</span>
      </div>

      <div className="stat-card green">
        <p>COLLECTION VALUE</p>
        <h2>$0</h2>
        <span>Total estimated value</span>
      </div>

      <div className="stat-card purple">
        <p>FAVORITES</p>
        <h2>0</h2>
        <span>Favorite cards</span>
      </div>

      <div className="stat-card orange">
        <p>FOR TRADE</p>
        <h2>0</h2>
        <span>Trade binder</span>
      </div>
    </section>
  );
}

export default Stats;