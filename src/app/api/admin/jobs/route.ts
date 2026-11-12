import { isAdminAuthenticated, isSameOrigin } from "@/lib/admin-auth";
import { jobTypes, sectors, type JobStatus } from "@/lib/jobs";
import { createAdminSupabase } from "@/lib/supabase/server";

const jobColumns =
  "id, title, company, location, type, sector, description, status";

type JobFields = {
  title: string;
  company: string;
  location: string;
  type: string;
  sector: string;
  description: string;
  status: JobStatus;
};

function parseJobFields(value: unknown): JobFields | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const company = typeof record.company === "string" ? record.company.trim() : "";
  const location = typeof record.location === "string" ? record.location.trim() : "";
  const type = typeof record.type === "string" ? record.type : "";
  const sector = typeof record.sector === "string" ? record.sector : "";
  const description =
    typeof record.description === "string" ? record.description.trim() : "";
  const status = record.status;

  if (
    !title ||
    title.length > 160 ||
    !company ||
    company.length > 160 ||
    !location ||
    location.length > 160 ||
    !jobTypes.includes(type) ||
    !sectors.includes(sector) ||
    !description ||
    description.length > 10000 ||
    (status !== "Live" && status !== "Draft")
  ) {
    return null;
  }

  return { title, company, location, type, sector, description, status };
}

function validId(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Sign in to manage jobs." }, { status: 401 });
  }

  try {
    const { data, error } = await createAdminSupabase()
      .from("jobs")
      .select(jobColumns)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load admin jobs:", error.message);
      return Response.json({ error: "Jobs are temporarily unavailable." }, { status: 503 });
    }
    return Response.json(data ?? [], { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin jobs are not configured.", error);
    return Response.json({ error: "Check the server Supabase configuration." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Sign in to manage jobs." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter valid job details." }, { status: 400 });
  }
  const fields = parseJobFields(body);
  if (!fields) {
    return Response.json({ error: "Check the job details and try again." }, { status: 400 });
  }

  try {
    const { data, error } = await createAdminSupabase()
      .from("jobs")
      .insert(fields)
      .select(jobColumns)
      .single();
    if (error) {
      console.error("Unable to create job:", error.message);
      return Response.json({ error: "The job could not be saved." }, { status: 503 });
    }
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Admin jobs are not configured.", error);
    return Response.json({ error: "Check the server Supabase configuration." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Sign in to manage jobs." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter valid job details." }, { status: 400 });
  }
  const record = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const fields = parseJobFields(record);
  if (!validId(record.id) || !fields) {
    return Response.json({ error: "Check the job details and try again." }, { status: 400 });
  }

  try {
    const { data, error } = await createAdminSupabase()
      .from("jobs")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", record.id)
      .select(jobColumns)
      .maybeSingle();
    if (error) {
      console.error("Unable to update job:", error.message);
      return Response.json({ error: "The job could not be updated." }, { status: 503 });
    }
    if (!data) return Response.json({ error: "Job not found." }, { status: 404 });
    return Response.json(data);
  } catch (error) {
    console.error("Admin jobs are not configured.", error);
    return Response.json({ error: "Check the server Supabase configuration." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Sign in to manage jobs." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Choose a job to remove." }, { status: 400 });
  }
  const id = body && typeof body === "object" && "id" in body ? body.id : null;
  if (!validId(id)) {
    return Response.json({ error: "Choose a valid job to remove." }, { status: 400 });
  }

  try {
    const { data, error } = await createAdminSupabase()
      .from("jobs")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("Unable to remove job:", error.message);
      return Response.json({ error: "The job could not be removed." }, { status: 503 });
    }
    if (!data) return Response.json({ error: "Job not found." }, { status: 404 });
    return Response.json({ removed: true });
  } catch (error) {
    console.error("Admin jobs are not configured.", error);
    return Response.json({ error: "Check the server Supabase configuration." }, { status: 503 });
  }
}
