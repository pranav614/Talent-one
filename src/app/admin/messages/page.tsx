import { Suspense } from "react";
import { AdminMessages } from "@/components/admin-messages";
import { AdminShell } from "@/components/admin-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default function AdminMessagesPage() {
  return <Suspense fallback={<AdminShell active="messages"><p className="text-ink-muted">Checking admin access…</p></AdminShell>}><AuthorizedAdminMessagesPage /></Suspense>;
}

async function AuthorizedAdminMessagesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return (
    <AdminShell active="messages">
      <AdminMessages />
    </AdminShell>
  );
}
