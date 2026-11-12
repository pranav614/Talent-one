import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import { createAdminSupabase } from "@/lib/supabase/server";

const messageColumns =
  "id, category, audience, name, email, company, role, message, status, created_at";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Sign in to view messages." }, { status: 401 });
  }
  try {
    const { data, error } = await createAdminSupabase()
      .from("messages")
      .select(messageColumns)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Unable to load messages:", error.message);
      return Response.json({ error: "Messages are temporarily unavailable." }, { status: 503 });
    }
    return Response.json(data ?? [], { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin messages are not configured.", error);
    return Response.json({ error: "Check the server Supabase configuration." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Sign in to manage messages." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Choose a message and status." }, { status: 400 });
  }
  const record = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const validId = typeof record.id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(record.id);
  if (!validId || !["New", "Read", "Archived"].includes(String(record.status))) {
    return Response.json({ error: "Choose a valid message status." }, { status: 400 });
  }

  try {
    const { data, error } = await createAdminSupabase()
      .from("messages")
      .update({ status: record.status })
      .eq("id", record.id)
      .select(messageColumns)
      .maybeSingle();
    if (error) {
      console.error("Unable to update message:", error.message);
      return Response.json({ error: "The message could not be updated." }, { status: 503 });
    }
    if (!data) return Response.json({ error: "Message not found." }, { status: 404 });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin messages are not configured.", error);
    return Response.json({ error: "Check the server Supabase configuration." }, { status: 503 });
  }
}
