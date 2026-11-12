import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { AdminShell } from "@/components/admin-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default function AdminPage() {
  return <Suspense fallback={<AdminShell><p className="text-ink-muted">Checking admin access…</p></AdminShell>}><AdminAccessPage /></Suspense>;
}

async function AdminAccessPage() {
  if (await isAdminAuthenticated()) redirect("/admin/jobs");
  return (
    <AdminShell>
      <AdminLogin />
    </AdminShell>
  );
}
