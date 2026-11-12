import { AdminJobs } from "@/components/admin-jobs";
import { AdminShell } from "@/components/admin-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminJobsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return (
    <AdminShell active="jobs">
      <AdminJobs />
    </AdminShell>
  );
}
