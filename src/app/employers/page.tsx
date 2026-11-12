import Link from "next/link";
import { HiringRequestForm } from "@/components/hiring-request-form";
import { SiteShell } from "@/components/site-shell";

const services = [
  {
    title: "Permanent hiring",
    description: "Long-term hires who fit your team and culture.",
  },
  {
    title: "Contract and temp",
    description: "Flexible cover when you need skilled people fast.",
  },
  {
    title: "Executive search",
    description: "Discreet search for senior and leadership roles.",
  },
];

const steps = [
  { title: "Brief", description: "We learn what you need." },
  { title: "Search", description: "We find and screen candidates." },
  { title: "Interview", description: "You meet the best matches." },
  { title: "Onboard", description: "We support the start and follow up." },
];

export default function EmployersPage() {
  return (
    <SiteShell>
      <section className="gradient-panel">
        <div className="site-container py-16 sm:py-20 lg:py-24">
          <p className="eyebrow">For employers</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-6xl">
            Hiring that fits your team, not just the job spec.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
            We take the hassle out of hiring so you can focus on running your
            business.
          </p>
          <Link className="button-primary mt-8 inline-flex" href="#request">
            Request talent
          </Link>
        </div>
      </section>
      <section className="site-container py-16 sm:py-24">
        <h2 className="section-title">What we offer</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article className="surface-card p-6" key={service.title}>
              <h3 className="text-xl font-bold text-ink">{service.title}</h3>
              <p className="mt-3 leading-7 text-ink-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="site-container pb-16 sm:pb-24">
        <h2 className="section-title">Our process</h2>
        <ol className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="text-4xl font-bold text-brand">
                {index + 1}
              </span>
              <h3 className="mt-2 text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-1 leading-7 text-ink-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <section className="bg-ink text-white" id="request">
        <div className="site-container py-14 sm:py-20">
          <h2 className="section-title text-white">Tell us who you need</h2>
          <div className="mt-8">
            <HiringRequestForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
