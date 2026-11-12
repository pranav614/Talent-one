import { JobBrowser } from "@/components/job-browser";
import { SiteShell } from "@/components/site-shell";

export default function JobsPage() {
  return (
    <SiteShell>
      <section className="site-container py-12 sm:py-16 lg:py-20">
        <p className="eyebrow">Job search</p>
        <h1 className="page-title mt-5">Find your next role</h1>
        <div className="mt-9">
          <JobBrowser />
        </div>
      </section>
    </SiteShell>
  );
}
