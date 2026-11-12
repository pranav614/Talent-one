"use client";

import { useRouter } from "next/navigation";

export function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin");
  }
  return <button className="button-secondary" onClick={logout} type="button">Lock</button>;
}
