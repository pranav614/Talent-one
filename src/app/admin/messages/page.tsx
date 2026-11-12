import { AdminMessages } from "@/components/admin-messages";
import { AdminShell } from "@/components/admin-shell";

export default function AdminMessagesPage() {
  return (
    <AdminShell active="messages">
      <AdminMessages />
    </AdminShell>
  );
}
