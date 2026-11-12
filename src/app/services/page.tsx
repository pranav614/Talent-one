import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const services = [
  { title: "Recruitment", description: "Permanent hires matched to your team and culture." },
  { title: "Contract staffing", description: "Skilled people on flexible terms, ready to start." },
  { title: "Payroll and HR support", description: "Admin handled so you can focus on the work." },
  { title: "Training and upskilling", description: "Build the skills your team needs to grow." },
  { title: "Workforce consulting", description: "Practical advice on hiring, planning and retention." },
  { title: "Project teams", description: "Dedicated teams for short or long projects." },
];

const steps = [
  { title: "Understand", description: "We learn your business and goals." },
  { title: "Plan", description: "We agree the right service and scope." },
  { title: "Deliver", description: "We get it done and keep you informed." },
];

export default function ServicesPage() {
  return (
    <SiteShell>
      <section className="bg-brand-surface">
        <div className="site-container py-16 sm:py-20 lg:py-24">
          <p className="eyebrow">Our services</p>
          <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-6xl">
            Recruitment and workforce services under one roof.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-muted">
            We help you find the people and practical support your business needs to move forward.
          </p>
          <Link className="button-primary mt-8 inline-flex" href="/contact">Talk to us</Link>
        </div>
      </section>

      <section className="site-container py-14 sm:py-20">
        <h2 className="section-title">What we offer</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article className="surface-card p-6 sm:p-7" key={service.title}>
              <h3 className="text-xl font-bold text-ink">{service.title}</h3>
              <p className="mt-3 leading-7 text-ink-muted">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-surface">
        <div className="site-container py-14 sm:py-20">
          <h2 className="section-title">How we work with you</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.title}>
                <h3 className="text-2xl font-bold text-ink">{step.title}</h3>
                <p className="mt-2 leading-7 text-ink-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink text-center text-white">
        <div className="site-container py-14 sm:py-20">
          <h2 className="text-3xl font-bold sm:text-4xl">Not sure what you need?</h2>
          <Link className="button-primary mt-7 inline-flex" href="/contact">Get in touch</Link>
        </div>
      </section>
    </SiteShell>
  );
}
