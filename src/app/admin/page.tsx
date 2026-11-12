import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { AdminShell } from "@/components/admin-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminPage() {
  if (await isAdminAuthenticated()) redirect("/admin/jobs");
  return (
    <AdminShell>
      <AdminLogin />
    </AdminShell>
  );
}
