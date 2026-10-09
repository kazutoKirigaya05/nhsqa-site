"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { friendly, refreshProfile, signOut, useSession } from "@/lib/session";
import { trackStatus, useProgress } from "@/lib/progress";
import { TRACKS, STATES } from "@/content/site";
import { LESSONS } from "@/content/lessons";
import { LivePipelineMap, TrackGrid } from "@/components/learn/TrackViews";

function Gate({ children }: { children: React.ReactNode }) {
  const s = useSession();
  if (s.status === "loading") return <div className="wrap section"><p className="muted">Loading</p></div>;
  if (s.status === "out") {
    return (
      <section className="page-head"><div className="wrap stack">
        <h1 className="long">Log in to see this page</h1>
        <div className="btns"><Link className="btn" href="/login">Log in</Link><Link className="btn alt" href="/join">Join free</Link></div>
      </div></section>
    );
  }
  return <>{children}</>;
}

export function Dashboard() { return <Gate><DashboardInner /></Gate>; }
export function Account() { return <Gate><AccountInner /></Gate>; }

function DashboardInner() {
  const { profile } = useSession();
  const p = useProgress();
  const stats = TRACKS.map((t) => ({ t, s: trackStatus(p, t.slug) }));
  const finished = stats.filter((x) => x.s.state === "done").length;
  const lessonsDone = stats.reduce((n, x) => n + x.s.done, 0);
  const lessonsTotal = Object.values(LESSONS).reduce((n, l) => n + l.length, 0);
  const next = stats.find((x) => x.s.state === "now") ?? stats.find((x) => x.s.state === "new");
  return (
    <>
      <section className="page-head">
        <div className="wrap stack-lg">
          <div className="stack">
            <h1 className="long">{profile?.first_name ? `Welcome, ${profile.first_name}.` : "Welcome."}</h1>
            <p className="lede">
              You have finished <span className="num">{lessonsDone}</span> of <span className="num">{lessonsTotal}</span> lessons and <span className="num">{finished}</span> of <span className="num">{TRACKS.length}</span> tracks.
            </p>
            <div className="btns">
              {next ? <Link className="btn" href={`/learn/${next.t.slug}`}>{next.s.state === "now" ? `Continue ${next.t.title}` : `Start ${next.t.title}`}</Link> : <Link className="btn" href="/pipeline">See your pipeline</Link>}
              <Link className="btn alt" href="/account">My account</Link>
            </div>
          </div>
          <LivePipelineMap />
        </div>
      </section>
      <section className="section sheet"><div className="wrap stack"><h2>Your tracks</h2><TrackGrid /></div></section>
    </>
  );
}

function AccountInner() {
  const { profile, email } = useSession();
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "saved" | "error"; msg?: string }>({ kind: "idle" });
  const year = new Date().getFullYear();
  const years = Array.from(new Set([...(profile?.grad_year ? [profile.grad_year] : []), ...[0, 1, 2, 3, 4].map((n) => year + n)])).sort();

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    const f = new FormData(e.currentTarget);
    setStatus({ kind: "busy" });
    const { error } = await supabase().from("profiles").update({
      first_name: String(f.get("first")).trim(), last_name: String(f.get("last")).trim(), school: String(f.get("school")).trim(),
      state: String(f.get("state")), grad_year: Number(f.get("grad")) || null,
    }).eq("id", profile.id);
    if (error) setStatus({ kind: "error", msg: friendly(error) });
    else { await refreshProfile(); setStatus({ kind: "saved" }); }
  }

  return (
    <section className="page-head">
      <div className="wrap split">
        <div className="stack">
          <h1 className="long">My account</h1>
          <p className="lede">Signed in as {email}.</p>
          <div className="btns"><button type="button" className="btn alt" onClick={() => { void signOut(); }}>Log out</button></div>
          <PasswordForm />
          <p className="muted">To delete your account and everything saved with it, send us a message from the <Link href="/contact">contact page</Link>.</p>
        </div>
        {profile ? (
          <form className="form" onSubmit={save} key={profile.id}>
            <div className="field"><label htmlFor="acc-first">First name</label><input id="acc-first" name="first" required maxLength={80} defaultValue={profile.first_name} /></div>
            <div className="field"><label htmlFor="acc-last">Last name</label><input id="acc-last" name="last" required maxLength={80} defaultValue={profile.last_name} /></div>
            <div className="field full"><label htmlFor="acc-school">School</label><input id="acc-school" name="school" required maxLength={160} defaultValue={profile.school} /></div>
            <div className="field"><label htmlFor="acc-state">State</label>
              <select id="acc-state" name="state" required defaultValue={profile.state}><option value="" disabled>Choose one</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="field"><label htmlFor="acc-grad">Graduation year</label>
              <select id="acc-grad" name="grad" required defaultValue={profile.grad_year ?? ""}><option value="" disabled>Choose one</option>{years.map((y) => <option key={y}>{y}</option>)}</select></div>
            <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
              <button type="submit" className="btn" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Saving" : "Save changes"}</button>
              <div role="status">
                {status.kind === "saved" && <p className="verdict ok">Changes saved.</p>}
                {status.kind === "error" && <p className="verdict bad">{status.msg}</p>}
              </div>
            </div>
          </form>
        ) : <p className="notice">Your profile could not be loaded. Refresh the page to try again.</p>}
      </div>
    </section>
  );
}

function PasswordForm() {
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "saved" | "error"; msg?: string }>({ kind: "idle" });
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const password = String(f.get("pw1"));
    if (password !== String(f.get("pw2"))) { setStatus({ kind: "error", msg: "The two passwords do not match." }); return; }
    setStatus({ kind: "busy" });
    const { error } = await supabase().auth.updateUser({ password });
    if (error) setStatus({ kind: "error", msg: friendly(error) });
    else { form.reset(); setStatus({ kind: "saved" }); }
  }
  return (
    <form className="form" onSubmit={save}>
      <h2 className="h3 full">Set a new password</h2>
      <div className="field full"><label htmlFor="pw1">New password</label><input id="pw1" name="pw1" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /><span className="hint">At least 8 characters.</span></div>
      <div className="field full"><label htmlFor="pw2">Type it again</label><input id="pw2" name="pw2" type="password" required minLength={8} maxLength={72} autoComplete="new-password" /></div>
      <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
        <button type="submit" className="btn alt" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Saving" : "Save password"}</button>
        <div role="status">
          {status.kind === "saved" && <p className="verdict ok">Password saved. Use it next time you log in.</p>}
          {status.kind === "error" && <p className="verdict bad">{status.msg}</p>}
        </div>
      </div>
    </form>
  );
}
