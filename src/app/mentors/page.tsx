import { SimpleForm } from "@/components/SimpleForm";

export const metadata = { title: "Mentors" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">Mentor a student who has already done the work.</h1>
          <p className="lede">Students can only request a mentor after finishing skill tracks and attending a seminar. By the time they reach you, they know the basics and have real questions.</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>How mentoring works</h2>
            <ol className="steps">
              <li><p>You apply below. Our officers review every application.</p></li>
              <li><p>Once approved, you get a mentor account with your profile and areas of interest.</p></li>
              <li><p>Officers match you with a student whose goals fit your background.</p></li>
              <li><p>We introduce you by email, with an officer and the student&apos;s parent or guardian included.</p></li>
              <li><p>You log each session in your mentor area so we know the match is working.</p></li>
            </ol>
          </div>
          <div className="stack">
            <h2>Who can mentor</h2>
            <div className="prose">
              <p>People who work, or have worked, in a quantitative role: research, trading, development, risk or data science.</p>
              <p>Students are minors, so we keep officers and guardians in the loop. Students cannot browse mentors or contact them directly, and mentors see only the students they are matched with.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="apply">
        <div className="wrap split">
          <div className="stack">
            <h2>Apply to mentor</h2>
            <p className="muted">It takes a few minutes. We reply to every application.</p>
          </div>
          <SimpleForm id="mentor" kind="mentor" submit="Send application" done="Thanks for applying. Our officers review every application and will reply by email."
            map={{ name: "name", email: "email", employer: "organization", role: "job_role", linkedin: "link", why: "message" }}
            fields={[
              { name: "name", label: "Your name", required: true, half: true, autoComplete: "name" },
              { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
              { name: "employer", label: "Current or most recent employer", required: true, half: true, autoComplete: "organization" },
              { name: "role", label: "Role", required: true, half: true, autoComplete: "organization-title" },
              { name: "linkedin", label: "LinkedIn or other profile link", hint: "So our officers can confirm your background." },
              { name: "why", label: "What would you like to help students with?", type: "textarea", required: true },
            ]} />
        </div>
      </section>
    </>
  );
}
