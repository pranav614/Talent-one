import { AdminMessages } from "@/components/admin-messages";
import { AdminShell } from "@/components/admin-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminMessagesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return (
    <AdminShell active="messages">
      <AdminMessages />
    </AdminShell>
  );
}
