"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { signOut, useSession } from "@/lib/session";

// Student links sit in the main bar. The two links for professionals live in the strip above it.
const LINKS = [
  ["/what-is-a-quant", "What is a quant?"],
  ["/learn", "Lessons"],
  ["/trade", "Trade"],
  ["/daily", "Puzzle"],
  ["/pipeline", "Pipeline"],
  ["/kits", "Quant kits"],
  ["/events", "Events"],
] as const;
const PRO = [
  ["/sponsors", "Sponsor us"],
  ["/mentors", "Become a mentor"],
] as const;

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const session = useSession();
  const inside = session.status === "in";
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="wrap">
          <span className="topbar-note">Free for every high school student</span>
          <span className="topbar-links">
            {PRO.map(([href, label]) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>)}
          </span>
        </div>
      </div>
      <div className="wrap">
        <Logo />
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-nav" className={open ? "nav open" : "nav"} aria-label="Main">
          <div className="nav-main">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} aria-current={path === href || path.startsWith(href + "/") ? "page" : undefined} onClick={close}>{label}</Link>
            ))}
            {inside
              ? <button type="button" className="navbtn" onClick={() => { close(); void signOut(); }}>Log out</button>
              : <Link href="/login" aria-current={path === "/login" ? "page" : undefined} onClick={close}>Log in</Link>}
          </div>
          {inside
            ? <Link href="/dashboard" className="btn sm" onClick={close}>Dashboard</Link>
            : <Link href="/join" className="btn sm" onClick={close}>Join free</Link>}
        </nav>
      </div>
    </header>
  );
}
