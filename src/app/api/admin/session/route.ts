import {
  clearAdminSession,
  hashClientAddress,
  isSameOrigin,
  setAdminSession,
  verifyAdminPin,
} from "@/lib/admin-auth";
import { createAdminSupabase } from "@/lib/supabase/server";

const maxAttempts = 5;
const attemptWindowMs = 15 * 60 * 1000;
const oldAttemptWindowMs = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter your admin PIN." }, { status: 400 });
  }

  const pin =
    body && typeof body === "object" && "pin" in body && typeof body.pin === "string"
      ? body.pin
      : "";
  if (!/^[0-9]{4,16}$/.test(pin)) {
    return Response.json({ error: "PIN must be 4 to 16 digits." }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabase();
    const clientHash = hashClientAddress(request);
    const now = Date.now();
    const cutoff = new Date(now - attemptWindowMs).toISOString();
    const cleanupCutoff = new Date(now - oldAttemptWindowMs).toISOString();

    await supabase
      .from("admin_login_attempts")
      .delete()
      .eq("client_hash", clientHash)
      .lt("attempted_at", cleanupCutoff);

    const { count, error: countError } = await supabase
      .from("admin_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("client_hash", clientHash)
      .gte("attempted_at", cutoff);

    if (countError) {
      console.error("Unable to check admin PIN attempts:", countError.message);
      return Response.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });
    }
    if ((count ?? 0) >= maxAttempts) {
      return Response.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    }

    const { data: credential, error: credentialError } = await supabase
      .from("admin_pincode")
      .select("pin_hash")
      .eq("id", 1)
      .maybeSingle();

    if (credentialError) {
      console.error("Unable to read the admin PIN:", credentialError.message);
      return Response.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });
    }
    if (!credential) {
      return Response.json(
        { error: "Add your PIN hash to the admin_pincode table first." },
        { status: 503 },
      );
    }

    if (!verifyAdminPin(pin, credential.pin_hash)) {
      const { error: attemptError } = await supabase
        .from("admin_login_attempts")
        .insert({ client_hash: clientHash });
      if (attemptError) {
        console.error("Unable to record admin PIN attempt:", attemptError.message);
        return Response.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });
      }
      return Response.json({ error: "That PIN did not match." }, { status: 401 });
    }

    await supabase
      .from("admin_login_attempts")
      .delete()
      .eq("client_hash", clientHash);
    await setAdminSession();
    return Response.json({ authenticated: true });
  } catch (error) {
    console.error("Admin login is not configured.", error);
    return Response.json(
      { error: "Admin login is not configured. Check the server environment." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  await clearAdminSession();
  return Response.json({ authenticated: false });
}
