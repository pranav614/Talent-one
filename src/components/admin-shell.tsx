import Link from "next/link";
import type { ReactNode } from "react";
import { AdminLogout } from "@/components/admin-logout";

export function AdminShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: "messages" | "jobs";
}) {
  return (
    <div className={`min-h-full ${active ? "bg-white" : "gradient-panel"}`}>
      <header className="border-b border-line bg-white">
        <div className="site-container flex min-h-20 items-center justify-between gap-4 py-4">
          <Link className="brand-wordmark" href="/admin">
            TALENT ONE <span className="font-medium text-ink-muted">· Admin</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link className="font-medium text-ink-muted hover:text-brand" href="/">View site</Link>
            {active ? <AdminLogout /> : null}
          </div>
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
      <main className={active
        ? "site-container py-10 sm:py-14"
        : "site-container flex min-h-[calc(100vh-5rem)] items-center justify-center py-10"
      }>{children}</main>
    </div>
  );
}
