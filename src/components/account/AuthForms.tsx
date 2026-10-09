"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

function Password({ id, label, hint, auto }: { id: string; label: string; hint?: string; auto: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field full">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input id={id} name={id} type={show ? "text" : "password"} required minLength={8} maxLength={72} autoComplete={auto} />
        <button type="button" className="linkbtn" onClick={() => setShow(!show)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
      </div>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/** The sign-up function answers with JSON { error } on failure; pull that message out. */
async function functionError(error: unknown): Promise<string> {
  const ctx = (error as { context?: Response })?.context;
  if (ctx && typeof ctx.json === "function") {
    try { const j = await ctx.json(); if (j?.error) return String(j.error); } catch { /* fall through */ }
  }
  return friendly(error as { message?: string });
}

export function JoinForm() {
  const session = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const year = new Date().getFullYear();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("join-password"));
    if (password !== String(f.get("join-password2"))) { setStatus({ kind: "error", msg: "The two passwords do not match." }); return; }
    setStatus({ kind: "busy" });
    const db = supabase();
    const { error } = await db.functions.invoke("signup", {
      body: {
        email, password, website: String(f.get("website") ?? ""),
        first_name: String(f.get("first")).trim(), last_name: String(f.get("last")).trim(), school: String(f.get("school")).trim(),
        state: String(f.get("state")), grad_year: Number(f.get("grad")), age_confirmed: f.get("age") === "on",
      },
    });
    if (error) { setStatus({ kind: "error", msg: await functionError(error) }); return; }
    const { error: inError } = await db.auth.signInWithPassword({ email, password });
    if (inError) { setStatus({ kind: "error", msg: friendly(inError) }); return; }
    router.push("/dashboard");
  }

  if (session.status === "in") return <AlreadyIn />;
  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="join-first">First name</label><input id="join-first" name="first" required maxLength={80} autoComplete="given-name" /></div>
      <div className="field"><label htmlFor="join-last">Last name</label><input id="join-last" name="last" required maxLength={80} autoComplete="family-name" /></div>
      <div className="field full"><label htmlFor="join-email">Email</label><input id="join-email" name="email" type="email" required autoComplete="email" /></div>
      <Password id="join-password" label="Password" hint="At least 8 characters." auto="new-password" />
      <Password id="join-password2" label="Type the password again" auto="new-password" />
      <div className="field full"><label htmlFor="join-school">School</label><input id="join-school" name="school" required maxLength={160} /></div>
      <div className="field"><label htmlFor="join-state">State</label>
        <select id="join-state" name="state" required defaultValue=""><option value="" disabled>Choose one</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="field"><label htmlFor="join-grad">Graduation year</label>
        <select id="join-grad" name="grad" required defaultValue=""><option value="" disabled>Choose one</option>{[0, 1, 2, 3, 4].map((n) => <option key={n}>{year + n}</option>)}</select></div>
      <div className="hp" aria-hidden="true"><label htmlFor="join-website">Website</label><input id="join-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="check full"><input id="join-age" name="age" type="checkbox" required /><label htmlFor="join-age">I am 13 or older.</label></div>
      <div className="check full"><input id="join-privacy" name="privacy" type="checkbox" required /><label htmlFor="join-privacy">I have read the <Link href="/privacy">privacy page</Link> and agree to the <Link href="/terms">terms</Link>.</label></div>
      <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
        <button type="submit" className="btn" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Creating your account" : "Create my account"}</button>
        <div role="alert">{status.kind === "error" && <p className="verdict bad">{status.msg}</p>}</div>
      </div>
    </form>
  );
}

export function LoginForm() {
  const session = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [email, setEmail] = useState("");
  const [linkMode, setLinkMode] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const address = String(f.get("email")).trim();
    setStatus({ kind: "busy" });
    if (linkMode) {
      const { error } = await supabase().auth.signInWithOtp({ email: address, options: { shouldCreateUser: false, emailRedirectTo: redirect() } });
      if (error) setStatus({ kind: "error", msg: friendly(error) });
      else { setEmail(address); setStatus({ kind: "sent" }); }
      return;
    }
    const { error } = await supabase().auth.signInWithPassword({ email: address, password: String(f.get("login-password")) });
    if (error) setStatus({ kind: "error", msg: friendly(error) });
    else router.push("/dashboard");
  }

  if (session.status === "in") return <AlreadyIn />;
  if (status.kind === "sent") return <Sent email={email} />;
  return (
    <form className="form" onSubmit={submit}>
      <div className="field full"><label htmlFor="login-email">Email</label><input id="login-email" name="email" type="email" required autoComplete="email" /></div>
      {!linkMode && <Password id="login-password" label="Password" auto="current-password" />}
      <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
        <button type="submit" className="btn" disabled={status.kind === "busy"}>{status.kind === "busy" ? (linkMode ? "Sending" : "Logging in") : (linkMode ? "Email me a sign-in link" : "Log in")}</button>
        <div role="alert">{status.kind === "error" && <p className="verdict bad">{status.msg}</p>}</div>
        <button type="button" className="linkbtn" onClick={() => { setLinkMode(!linkMode); setStatus({ kind: "idle" }); }}>
          {linkMode ? "Log in with a password instead" : "Forgot your password, or joined before you had one? Get a sign-in link"}
        </button>
      </div>
    </form>
  );
}
