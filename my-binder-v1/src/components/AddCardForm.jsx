function AddCardForm() {
  return (
    <section className="panel">
      <h3>ADD CARD</h3>

      <form className="add-card-form">
        <input placeholder="Card name" />
        <input placeholder="Set name" />
        <input placeholder="Estimated value" type="number" />

        <select>
          <option>Keep</option>
          <option>For Trade</option>
          <option>For Sale</option>
        </select>

        <input type="file" accept="image/*" />

        <button type="button">Save Card</button>
      </form>
    </section>
  );
}

export default AddCardForm;