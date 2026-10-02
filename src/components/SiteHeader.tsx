"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

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
            <Link href="/login" aria-current={path === "/login" ? "page" : undefined} onClick={close}>Log in</Link>
          </div>
          <Link href="/join" className="btn sm" onClick={close}>Join free</Link>
        </nav>
      </div>
    </header>
  );
}
