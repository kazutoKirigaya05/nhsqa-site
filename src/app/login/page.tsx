import Link from "next/link";
import { LoginForm } from "@/components/account/AuthForms";

export const metadata = { title: "Log in" };

export default function Page() {
  return (
    <section className="page-head">
      <div className="wrap split">
        <div className="stack">
          <h1 className="long">Log in</h1>
          <p className="lede">Log in with the email and password you joined with.</p>
          <p className="muted">New here? <Link href="/join">Join free</Link>.</p>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
