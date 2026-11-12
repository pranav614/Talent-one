import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/jobs", label: "Find a job" },
  { href: "/employers", label: "For employers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
        <Link className="brand-wordmark" href="/" aria-label="Talent One home">
          TALENT ONE
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 sm:gap-x-7"
        >
          {navigation.map((item) => (
            <Link
              className="text-sm font-medium text-ink-muted transition hover:text-brand sm:text-base"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button-primary px-5 py-3 text-sm sm:text-base" href="/contact">
            Submit your CV
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="site-container flex flex-col gap-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© Talent One · Australia</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-200">
          <Link className="hover:text-white" href="/contact">
            Privacy
          </Link>
          <span aria-hidden="true">·</span>
          <Link className="hover:text-white" href="/contact">
            Terms
          </Link>
          <span aria-hidden="true">·</span>
          <a className="hover:text-white" href="mailto:hello@talentone.example">
            hello@talentone.example
          </a>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
