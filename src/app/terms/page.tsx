export const metadata = { title: "Terms" };

export default function Page() {
  return (
    <section className="page-head">
      <div className="wrap stack">
        <h1 className="long">Terms</h1>
        <p className="draft">Draft. To be reviewed by NHSQA before launch.</p>
        <div className="prose stack">
          <div><h2>Using the site</h2><p>NHSQA is free for students. Use your real name and your own email, and keep your account to yourself.</p></div>
          <div><h2>Be decent</h2><p>Treat other students, mentors and speakers with respect. We can remove accounts that are used to harass people or to cheat on quizzes.</p></div>
          <div><h2>This is education</h2><p>Our lessons teach how quantitative finance works. Nothing on this site is financial advice, and nothing here involves real money.</p></div>
          <div><h2>Mentorship</h2><p>Mentors volunteer their time. A match is not a job offer or a promise of one.</p></div>
        </div>
      </div>
    </section>
  );
}
