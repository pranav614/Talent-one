import { Suspense } from "react";
import { AdminJobs } from "@/components/admin-jobs";
import { AdminShell } from "@/components/admin-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default function AdminJobsPage() {
  return <Suspense fallback={<AdminShell active="jobs"><p className="text-ink-muted">Checking admin access…</p></AdminShell>}><AuthorizedAdminJobsPage /></Suspense>;
}

async function AuthorizedAdminJobsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return (
    <AdminShell active="jobs">
      <AdminJobs />
    </AdminShell>
  );
}
