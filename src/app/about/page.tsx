import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const values = [
  {
    title: "Honesty",
    description: "We tell it straight, to clients and candidates.",
  },
  {
    title: "Speed",
    description: "We respect your time and move quickly.",
  },
  {
    title: "Care",
    description: "Every placement is a real person and a real team.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="site-container py-16 sm:py-20 lg:py-24">
        <p className="eyebrow">About us</p>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-6xl">
          We are a recruitment team that puts people first.
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-ink-muted">
          Talent One was created to make hiring and job searching simpler and
          more human. We work with employers and candidates to build good
          matches that last.
        </p>
      </section>
      <section className="gradient-panel">
        <div className="site-container py-14 sm:py-20">
          <h2 className="section-title">What we stand for</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article className="surface-card p-6" key={value.title}>
                <h3 className="text-xl font-bold text-ink">{value.title}</h3>
                <p className="mt-3 leading-7 text-ink-muted">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="site-container py-16 sm:py-24">
        <h2 className="section-title">Meet the team</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Alex Morgan", "Managing Director"],
            ["Jordan Lee", "Senior Recruiter"],
            ["Taylor James", "Talent Partner"],
            ["Casey Nguyen", "Client Partner"],
          ].map(([name, title]) => (
            <article className="surface-card p-6" key={name}>
              <h3 className="text-xl font-bold text-ink">{name}</h3>
              <p className="mt-2 text-ink-muted">{title}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-ink text-white">
        <div className="site-container py-12 sm:py-16">
          <h2 className="text-3xl font-bold">Want to work with us?</h2>
          <Link className="button-primary mt-6 inline-flex" href="/contact">
            Get in touch
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
