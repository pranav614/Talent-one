import { isSameOrigin } from "@/lib/admin-auth";
import { createAdminSupabase } from "@/lib/supabase/server";

const categories = ["contact", "hiring", "jobs"] as const;
type Category = (typeof categories)[number];

function text(value: unknown, maxLength: number) {
  const result = typeof value === "string" ? value.trim() : "";
  return result.length <= maxLength ? result : "";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter valid message details." }, { status: 400 });
  }

  const record = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const category = record.category;
  const audience = record.audience;
  const name = text(record.name, 160);
  const email = text(record.email, 320).toLowerCase();
  const company = text(record.company, 160) || null;
  const role = text(record.role, 160) || null;
  const message = text(record.message, 10000);

  if (
    typeof category !== "string" || !categories.includes(category as Category) ||
    (audience !== "Candidate" && audience !== "Employer") ||
    !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 320 || !message
  ) {
    return Response.json({ error: "Check the required fields and try again." }, { status: 400 });
  }

  try {
    const { error } = await createAdminSupabase().from("messages").insert({
      category,
      audience,
      name,
      email,
      company,
      role,
      message,
    });
    if (error) {
      console.error("Unable to save message:", error.message);
      return Response.json({ error: "Your message could not be sent. Please try again." }, { status: 503 });
    }
    return Response.json({ sent: true }, { status: 201 });
  } catch (error) {
    console.error("Message delivery is not configured.", error);
    return Response.json({ error: "Message delivery is not configured." }, { status: 503 });
  }
}
