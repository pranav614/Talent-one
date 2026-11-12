import { createPublicSupabase } from "@/lib/supabase/server";

const publicJobColumns =
  "id, title, company, location, type, sector, description, status";

export async function GET() {
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("jobs")
      .select(publicJobColumns)
      .eq("status", "Live")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load public jobs:", error.message);
      return Response.json(
        { error: "Jobs are temporarily unavailable." },
        { status: 503 },
      );
    }

    return Response.json(data ?? [], {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Supabase is not configured for public jobs.", error);
    return Response.json(
      { error: "Jobs are temporarily unavailable." },
      { status: 503 },
    );
  }
}
