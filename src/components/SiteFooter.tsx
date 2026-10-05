import Link from "next/link";
import { Logo } from "./Logo";
import { ORG } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="stack-sm">
            <Logo />
            <p style={{ maxWidth: "34ch" }}>{ORG}. A starting point for high school students who want to become quants.</p>
          </div>
          <div>
            <h2>Students</h2>
            <ul>
              <li><Link href="/what-is-a-quant">What is a quant?</Link></li>
              <li><Link href="/pipeline">The Quant Pipeline</Link></li>
              <li><Link href="/learn">Lessons</Link></li>
              <li><Link href="/trade">Trading floor</Link></li>
              <li><Link href="/events">Events and news</Link></li>
              <li><Link href="/join">Join free</Link></li>
            </ul>
          </div>
          <div>
            <h2>Get involved</h2>
            <ul>
              <li><Link href="/sponsors">Sponsor us</Link></li>
              <li><Link href="/mentors">Become a mentor</Link></li>
              <li><Link href="/kits">Quant kits</Link></li>
            </ul>
          </div>
          <div>
            <h2>NHSQA</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="foot-note">© {new Date().getFullYear()} {ORG}</p>
      </div>
    </footer>
  );
}
