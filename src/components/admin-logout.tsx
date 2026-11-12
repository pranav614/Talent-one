"use client";

import { useRouter } from "next/navigation";

export function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin");
  }
  return <button className="font-medium text-ink-muted hover:text-brand" onClick={logout} type="button">Sign out</button>;
}
