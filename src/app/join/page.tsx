import Link from "next/link";
import { JoinForm } from "@/components/account/AuthForms";

export const metadata = { title: "Join" };

export default function Page() {
  return (
    <section className="page-head">
      <div className="wrap split">
        <div className="stack">
          <h1 className="long">Join NHSQA</h1>
          <p className="lede">Free for high school students. You get your own pipeline map, every lesson, and a seat at the monthly seminars.</p>
          <p className="muted">Already a member? <Link href="/login">Log in</Link>.</p>
        </div>
        <JoinForm />
      </div>
    </section>
  );
}
