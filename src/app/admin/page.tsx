import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";

export default function AdminPreviewPage() {
  return (
    <AdminShell>
      <div className="mx-auto max-w-2xl py-8">
        <section className="surface-card p-7 sm:p-10">
          <p className="eyebrow">Talent One · Demo</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Admin access
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            This preview uses sample data. Authentication is not configured, so
            this admin area is not protected and should not be used with real
            or private information.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="button-primary" href="/admin/messages">
              Preview messages
            </Link>
            <Link className="button-secondary" href="/admin/jobs">
              Preview jobs
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
