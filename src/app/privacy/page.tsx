export const metadata = { title: "Privacy" };

export default function Page() {
  return (
    <section className="page-head">
      <div className="wrap stack">
        <h1 className="long">Privacy</h1>
        <p className="draft">Draft. To be reviewed by NHSQA before launch.</p>
        <div className="prose stack">
          <div><h2>What we collect</h2><p>When you join we ask for your name, email, school, state and graduation year. As you use the site we save your lesson progress, quiz scores and seminar attendance. If you request a mentor we also ask for your interests, your goals and a parent or guardian email.</p></div>
          <div><h2>What we do not collect</h2><p>We do not ask for your birthday, home address or phone number. We do not show ads and we do not sell data.</p></div>
          <div><h2>Who can see it</h2><p>NHSQA officers can see member records so they can run the program. A mentor can see only the students matched with them. Sponsors see totals, such as how many members we have, and never individual students. There is no public member list.</p></div>
          <div><h2>Age</h2><p>You must be 13 or older to create an account.</p></div>
          <div><h2>Your choices</h2><p>You can edit your profile at any time, and you can ask us to delete your account and everything attached to it through the contact page.</p></div>
        </div>
      </div>
    </section>
  );
}
