import PageHeader from "../ui/PageHeader";

const policySections = [
  {
    title: "What Beacon Collect Is",
    body:
      "Beacon Collect helps collectors track cards, organize binders, create wishlists, discover community activity, and connect with other collectors and stores.",
  },
  {
    title: "Account Information",
    body:
      "When you sign in, Beacon Collect uses Supabase authentication to manage your account. This may include your email address and account identifier so your data can be connected to you.",
  },
  {
    title: "Collection Data",
    body:
      "You may add card names, sets, images, values, conditions, grading details, notes, wishlist items, trade status, sale prices, and binder organization. This information is used to power your collection, analytics, trade list, and profile experience.",
  },
  {
    title: "Profile and Community Data",
    body:
      "If you create a collector or store profile, information like your username, account type, favorite TCG, location, bio, avatar, public binders, and posted store events may be shown in community discovery or public profile views.",
  },
  {
    title: "Feedback and Beta Testing",
    body:
      "If you submit feedback, Beacon Collect stores your message, feedback type, and account email so we can understand what to improve during beta testing.",
  },
  {
    title: "Local Device Storage",
    body:
      "Beacon Collect may use local storage in your browser to remember app preferences, mission progress, saved events, followed collectors, saved shops, and temporary collection data when you are not signed in.",
  },
  {
    title: "How We Use Data",
    body:
      "We use data to run the app, save your collection, show your public profile choices, improve beta features, troubleshoot issues, and develop future collector tools.",
  },
  {
    title: "Data Deletion",
    body:
      "You can request deletion of your Beacon Collect account data by contacting support. We will use your account email to verify and process the request.",
  },
  {
    title: "Contact",
    body:
      "For privacy questions, account help, or deletion requests, contact Beacon Collect support at beaconcollectapp@gmail.com.",
  },
];

function Privacy() {
  return (
    <div>
      <PageHeader
        label="BEACON COLLECT"
        title="Privacy Policy"
        description="How Beacon Collect handles account, collection, profile, and community data during beta."
      />

      <section className="legal-page-card">
        <div className="legal-page-intro">
          <p className="page-label">LAST UPDATED</p>
          <h2>July 16, 2026</h2>
          <p>
            This privacy policy is written for the Beacon Collect beta. It is a
            plain-language overview of what the app collects and why.
          </p>
        </div>

        <div className="legal-section-list">
          {policySections.map((section) => (
            <article className="legal-section" key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <div className="legal-note">
          <p className="page-label">BETA NOTE</p>
          <p>
            Beacon Collect is still in beta. Features, data fields, and public
            profile controls may change as the product improves.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Privacy;
