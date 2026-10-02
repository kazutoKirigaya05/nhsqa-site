import { SimpleForm } from "@/components/SimpleForm";
import { KitCalculator } from "@/components/KitCalculator";
import { KIT_COST } from "@/content/site";

export const metadata = { title: "Sponsors" };

export default function Page() {
  return (
    <>
      <section className="page-head">
        <div className="wrap stack">
          <h1 className="long">Fund the first step into quant for students who would never find it.</h1>
          <p className="lede">Sponsorship pays for two things: the Quant Pipeline, which is free for every student, and quant kits sent to younger students.</p>
        </div>
      </section>
      <section className="section sheet">
        <div className="wrap stack-lg">
          <h2>What sponsors get</h2>
          <div className="cols-3">
            <div className="card"><h3>A sponsor account</h3><p>Log in to see the numbers your funding moved: members, states reached, lessons finished, seminar attendance and kits shipped.</p></div>
            <div className="card"><h3>Your name on the work</h3><p>Your logo on this page and on the materials your sponsorship pays for.</p></div>
            <div className="card"><h3>A line to future talent</h3><p>Your people can speak at seminars and mentor students who have worked through the pipeline.</p></div>
          </div>
          <p className="muted">Sponsor dashboards show totals only. We never share individual student records.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap cols-2">
          <div className="stack">
            <h2>What your money does</h2>
            <p className="prose">If the whole amount went to kits, this is how many students would open one.</p>
            <KitCalculator costPerKit={KIT_COST} />
          </div>
          <div className="stack">
            <h2>Our sponsors</h2>
            <div className="empty">
              <h3>We are looking for our first sponsors</h3>
              <p>Founding sponsors will be listed here.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section sheet" id="apply">
        <div className="wrap split">
          <div className="stack">
            <h2>Talk to us about sponsoring</h2>
            <p className="muted">Tell us who you are and we will reply with details and next steps.</p>
          </div>
          <SimpleForm id="sponsor" kind="sponsor" submit="Send sponsorship enquiry" done="Thanks. We will reply by email with details and next steps."
            map={{ name: "name", email: "email", firm: "organization", role: "job_role", message: "message" }}
            fields={[
              { name: "name", label: "Your name", required: true, half: true, autoComplete: "name" },
              { name: "email", label: "Work email", type: "email", required: true, half: true, autoComplete: "email" },
              { name: "firm", label: "Firm", required: true, half: true, autoComplete: "organization" },
              { name: "role", label: "Your role", half: true, autoComplete: "organization-title" },
              { name: "message", label: "What would you like to know?", type: "textarea" },
            ]} />
        </div>
      </section>
    </>
  );
}
