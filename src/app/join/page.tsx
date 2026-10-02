import Link from "next/link";
import { SimpleForm } from "@/components/SimpleForm";
import { STATES } from "@/content/site";

export const metadata = { title: "Join" };

const year = new Date().getFullYear();
const YEARS = [0, 1, 2, 3, 4].map((n) => String(year + n));

export default function Page() {
  return (
    <section className="page-head">
      <div className="wrap split">
        <div className="stack">
          <h1 className="long">Join NHSQA</h1>
          <p className="lede">Free for high school students. You get your own pipeline map, every lesson, and a seat at the monthly seminars.</p>
          <p className="muted">Already a member? <Link href="/login">Log in</Link>.</p>
        </div>
        <SimpleForm id="join" submit="Create my account" notReady="Sign-ups are not open yet."
          fields={[
            { name: "first", label: "First name", required: true, half: true, autoComplete: "given-name" },
            { name: "last", label: "Last name", required: true, half: true, autoComplete: "family-name" },
            { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", hint: "We send a sign-in link here. No password to remember." },
            { name: "school", label: "School", required: true },
            { name: "state", label: "State", type: "select", options: STATES, required: true, half: true },
            { name: "grad", label: "Graduation year", type: "select", options: YEARS, required: true, half: true },
            { name: "age", label: "I am 13 or older.", type: "checkbox", required: true },
            { name: "privacy", label: "I have read the privacy page and agree to the terms.", type: "checkbox", required: true },
          ]} />
      </div>
    </section>
  );
}
