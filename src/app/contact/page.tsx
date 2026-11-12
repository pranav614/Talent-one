import { ContactForm } from "@/components/contact-form";
import { SiteShell } from "@/components/site-shell";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string | string[] }>;
}) {
  const params = await searchParams;
  const jobParam = Array.isArray(params.job) ? params.job[0] : params.job;
  const jobTitle = jobParam?.slice(0, 160);
  return (
    <SiteShell>
      <section className="site-container py-12 sm:py-16 lg:py-20">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title mt-5">Let’s talk</h1>
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          <ContactForm jobTitle={jobTitle} />
          <aside className="surface-card space-y-7 p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-ink">Office</h2>
              <p className="mt-2 text-lg text-ink-muted">Sydney, Australia</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Phone</h2>
              <a className="mt-2 inline-block text-lg text-ink-muted hover:text-brand" href="tel:+61255550100">
                +61 2 5555 0100
              </a>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Email</h2>
              <a className="mt-2 inline-block text-lg text-ink-muted hover:text-brand" href="mailto:hello@talentone.example">
                hello@talentone.example
              </a>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Hours</h2>
              <p className="mt-2 text-lg text-ink-muted">
                Monday–Friday, 9am–5pm
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
