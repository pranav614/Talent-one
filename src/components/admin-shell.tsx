import Link from "next/link";
import type { ReactNode } from "react";

export function AdminShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: "messages" | "jobs";
}) {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-line bg-white">
        <div className="site-container flex min-h-20 items-center justify-between gap-4 py-4">
          <Link className="brand-wordmark" href="/admin">
            TALENT ONE <span className="font-medium text-ink-muted">· Admin</span>
          </Link>
          <Link className="font-medium text-ink-muted hover:text-brand" href="/">
            View site
          </Link>
        </div>
      </header>
      {active ? (
        <nav
          aria-label="Admin navigation"
          className="site-container flex gap-3 pt-7"
        >
          <Link
            aria-current={active === "messages" ? "page" : undefined}
            className={`button-secondary ${active === "messages" ? "button-selected" : ""}`}
            href="/admin/messages"
          >
            Messages
          </Link>
          <Link
            aria-current={active === "jobs" ? "page" : undefined}
            className={`button-secondary ${active === "jobs" ? "button-selected" : ""}`}
            href="/admin/jobs"
          >
            Jobs
          </Link>
        </nav>
      ) : null}
      <main className="site-container py-10 sm:py-14">{children}</main>
    </div>
  );
}
