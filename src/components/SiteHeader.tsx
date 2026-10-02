"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { signOut, useSession } from "@/lib/session";

const LINKS = [
  ["/what-is-a-quant", "What is a quant?"],
  ["/pipeline", "Pipeline"],
  ["/learn", "Lessons"],
  ["/kits", "Quant kits"],
  ["/events", "Events"],
  ["/sponsors", "Sponsors"],
  ["/mentors", "Mentors"],
] as const;

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const session = useSession();
  const inside = session.status === "in";
  const close = () => setOpen(false);
  return (
    <header className="site-header">
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
