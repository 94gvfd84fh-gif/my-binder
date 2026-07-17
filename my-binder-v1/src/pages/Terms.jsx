import PageHeader from "../ui/PageHeader";

const termsSections = [
  {
    title: "Product Changes",
    body:
      "Beacon Collect will continue to evolve. Features may change, improve, or be removed as the product grows.",
  },
  {
    title: "Your Account",
    body:
      "You are responsible for the information you add to your account, including your profile, collection, binders, card images, sale prices, trade status, store events, and feedback.",
  },
  {
    title: "Collection Values",
    body:
      "Any values, estimates, prices, analytics, or portfolio information in Beacon Collect are for organization and reference only. Beacon Collect does not provide financial advice or guarantee market values.",
  },
  {
    title: "Trades and Sales",
    body:
      "Beacon Collect may help collectors prepare trade lists, sale-ready cards, wishlists, and marketplace activity. Beacon Collect does not guarantee any trade, sale, buyer, seller, card condition, payment, shipment, or transaction outcome.",
  },
  {
    title: "Community Content",
    body:
      "Collectors and stores may create profiles, post events, upload images, and share information. Do not post illegal, abusive, misleading, stolen, fake, spammy, or harmful content.",
  },
  {
    title: "Store Events",
    body:
      "Stores are responsible for the accuracy of their posted card shows, trade nights, locations, times, flyers, and event details. Beacon Collect may remove events that appear inaccurate or inappropriate.",
  },
  {
    title: "Acceptable Use",
    body:
      "Do not use Beacon Collect to harass others, impersonate people or businesses, scam users, misrepresent cards, upload harmful content, or interfere with the app's operation.",
  },
  {
    title: "Account Suspension",
    body:
      "Beacon Collect may limit, suspend, or remove accounts or content that violates these terms, harms the community, creates legal risk, or abuses the app.",
  },
  {
    title: "Changes to Terms",
    body:
      "These terms may be updated as Beacon Collect grows. Continued use of the app means you accept the latest version of these terms.",
  },
  {
    title: "Contact",
    body:
      "For questions about these terms, contact Beacon Collect support at beaconcollectapp@gmail.com.",
  },
];

function Terms() {
  return (
    <div>
      <PageHeader
        label="BEACON COLLECT"
        title="Terms of Use"
        description="Simple rules for using Beacon Collect."
      />

      <section className="legal-page-card">
        <div className="legal-page-intro">
          <p className="page-label">LAST UPDATED</p>
          <h2>July 16, 2026</h2>
          <p>
            These terms explain the basic expectations for using Beacon Collect.
            They will evolve with the product.
          </p>
        </div>

        <div className="legal-section-list">
          {termsSections.map((section) => (
            <article className="legal-section" key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <div className="legal-note">
          <p className="page-label">IMPORTANT</p>
          <p>
            Beacon Collect is a collector organization and community tool. Users
            are responsible for their own trades, sales, meetups, and shared content.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Terms;
