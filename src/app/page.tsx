import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <section className="bg-brand-surface">
        <div className="site-container py-20 sm:py-28 lg:py-32">
          <p className="eyebrow">Talent One</p>
          <h1 className="mt-8 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Recruitment that finds the right people for the right roles.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted sm:text-xl">
            We connect skilled people with employers who value them, with honest
            advice at every step.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link className="button-primary" href="/employers">
              I’m hiring
            </Link>
            <Link className="button-secondary" href="/jobs">
              I’m looking for work
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container grid gap-6 py-16 md:grid-cols-2 lg:py-20">
        <article className="surface-card p-7 sm:p-9">
          <h2 className="text-2xl font-bold text-ink">For employers</h2>
          <p className="mt-3 max-w-xl leading-7 text-ink-muted">
            Tell us who you need and we’ll send you a shortlist of people worth
            meeting.
          </p>
          <Link className="button-primary mt-5 inline-flex" href="/employers">
            Request talent
          </Link>
        </article>
        <article className="surface-card p-7 sm:p-9">
          <h2 className="text-2xl font-bold text-ink">For candidates</h2>
          <p className="mt-3 max-w-xl leading-7 text-ink-muted">
            Find roles that fit your skills and goals, with a recruiter who
            actually talks to you.
          </p>
          <Link className="button-primary mt-5 inline-flex" href="/jobs">
            Browse jobs
          </Link>
        </article>
      </section>

      <section className="site-container pb-16 lg:pb-24">
        <h2 className="section-title">How it works</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <article>
            <h3 className="text-xl font-bold text-ink">Tell us what you need</h3>
            <p className="mt-2 leading-7 text-ink-muted">
              We listen to your needs, your team and your goals.
            </p>
          </article>
          <article>
            <h3 className="text-xl font-bold text-ink">We find the match</h3>
            <p className="mt-2 leading-7 text-ink-muted">
              We search, screen and introduce the right people.
            </p>
          </article>
          <article>
            <h3 className="text-xl font-bold text-ink">You move forward</h3>
            <p className="mt-2 leading-7 text-ink-muted">
              You interview, decide and start with confidence.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-ink text-center text-white">
        <div className="site-container py-16 sm:py-20">
          <h2 className="text-3xl font-bold sm:text-4xl">Let’s talk</h2>
          <Link className="button-primary mt-7 inline-flex" href="/contact">
            Get in touch
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
