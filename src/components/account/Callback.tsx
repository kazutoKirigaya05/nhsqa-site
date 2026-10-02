"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session";

/** Lands here from the emailed link. The Supabase client reads the code in the address and signs the member in. */
export function Callback() {
  const session = useSession();
  const router = useRouter();
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    if (session.status === "in") { router.replace("/dashboard"); return; }
    const q = new URLSearchParams(window.location.search + "&" + window.location.hash.slice(1));
    const err = q.get("error_description");
    const wait = setTimeout(() => setProblem(err ?? "This sign-in link did not work. It may have expired, or been opened in a different browser from the one you asked for it in."), err ? 0 : 6000);
    return () => clearTimeout(wait);
  }, [session.status, router]);

  if (problem && session.status !== "in") {
    return (
      <div className="stack">
        <h1 className="long">That link did not work</h1>
        <p className="lede">{problem}</p>
        <div className="btns"><Link className="btn" href="/login">Send me a new link</Link></div>
      </div>
    );
  }
  return <div className="stack"><h1 className="long">Signing you in</h1><p className="lede">One moment.</p></div>;
}
