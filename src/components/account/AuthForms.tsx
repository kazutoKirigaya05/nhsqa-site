"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { friendly, useSession } from "@/lib/session";
import { STATES } from "@/content/site";

type Status = { kind: "idle" | "busy" | "sent" | "error"; msg?: string };
const redirect = () => `${window.location.origin}/auth/callback`;

function Sent({ email }: { email: string }) {
  return (
    <div className="form">
      <div className="full stack-sm">
        <h2 className="h3">Check your email</h2>
        <p>We sent a sign-in link to <b>{email}</b>. Open it on this device to finish. It can take a minute to arrive, and it may land in spam.</p>
      </div>
    </div>
  );
}

function AlreadyIn() {
  return (
    <div className="form"><div className="full stack-sm">
      <h2 className="h3">You are logged in</h2>
      <div className="btns"><Link className="btn" href="/dashboard">Go to your dashboard</Link></div>
    </div></div>
  );
}

export function JoinForm() {
  const session = useSession();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const address = String(f.get("email")).trim();
    setStatus({ kind: "busy" });
    const { error } = await supabase().auth.signInWithOtp({
      email: address,
      options: {
        shouldCreateUser: true, emailRedirectTo: redirect(),
        data: { first_name: String(f.get("first")).trim(), last_name: String(f.get("last")).trim(), school: String(f.get("school")).trim(), state: String(f.get("state")), grad_year: String(f.get("grad")), age_confirmed: "true" },
      },
    });
    if (error) setStatus({ kind: "error", msg: friendly(error) });
    else { setEmail(address); setStatus({ kind: "sent" }); }
  }

  if (session.status === "in") return <AlreadyIn />;
  if (status.kind === "sent") return <Sent email={email} />;
  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="join-first">First name</label><input id="join-first" name="first" required maxLength={80} autoComplete="given-name" /></div>
      <div className="field"><label htmlFor="join-last">Last name</label><input id="join-last" name="last" required maxLength={80} autoComplete="family-name" /></div>
      <div className="field full"><label htmlFor="join-email">Email</label><input id="join-email" name="email" type="email" required autoComplete="email" /><span className="hint">We send a sign-in link here. No password to remember.</span></div>
      <div className="field full"><label htmlFor="join-school">School</label><input id="join-school" name="school" required maxLength={160} /></div>
      <div className="field"><label htmlFor="join-state">State</label>
        <select id="join-state" name="state" required defaultValue=""><option value="" disabled>Choose one</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="field"><label htmlFor="join-grad">Graduation year</label>
        <select id="join-grad" name="grad" required defaultValue=""><option value="" disabled>Choose one</option>{[0, 1, 2, 3, 4].map((n) => <option key={n}>{year + n}</option>)}</select></div>
      <div className="check full"><input id="join-age" name="age" type="checkbox" required /><label htmlFor="join-age">I am 13 or older.</label></div>
      <div className="check full"><input id="join-privacy" name="privacy" type="checkbox" required /><label htmlFor="join-privacy">I have read the <Link href="/privacy">privacy page</Link> and agree to the <Link href="/terms">terms</Link>.</label></div>
      <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
        <button type="submit" className="btn" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Sending" : "Create my account"}</button>
        <div role="alert">{status.kind === "error" && <p className="verdict bad">{status.msg}</p>}</div>
      </div>
    </form>
  );
}

export function LoginForm() {
  const session = useSession();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const address = String(new FormData(e.currentTarget).get("email")).trim();
    setStatus({ kind: "busy" });
    const { error } = await supabase().auth.signInWithOtp({ email: address, options: { shouldCreateUser: false, emailRedirectTo: redirect() } });
    if (error) setStatus({ kind: "error", msg: friendly(error) });
    else { setEmail(address); setStatus({ kind: "sent" }); }
  }

  if (session.status === "in") return <AlreadyIn />;
  if (status.kind === "sent") return <Sent email={email} />;
  return (
    <form className="form" onSubmit={submit}>
      <div className="field full"><label htmlFor="login-email">Email</label><input id="login-email" name="email" type="email" required autoComplete="email" /></div>
      <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
        <button type="submit" className="btn" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Sending" : "Email me a sign-in link"}</button>
        <div role="alert">{status.kind === "error" && <p className="verdict bad">{status.msg}</p>}</div>
      </div>
    </form>
  );
}
