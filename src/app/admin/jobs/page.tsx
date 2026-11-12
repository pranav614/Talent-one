import { AdminJobs } from "@/components/admin-jobs";
import { AdminShell } from "@/components/admin-shell";

export default function AdminJobsPage() {
  return (
    <AdminShell active="jobs">
      <AdminJobs />
    </AdminShell>
  );
}
