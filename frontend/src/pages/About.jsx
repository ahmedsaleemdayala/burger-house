import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { Flame, Leaf, ShieldCheck, Target } from "lucide-react";

const STORY_IMG = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&q=80";

export default function About() {
  return (
    <>
      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">Our story</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">
            Born on a <span className="text-flame-gradient">street grill</span>
          </h1>
          <p className="mt-6 text-smoke">
            BurgerHouse started in 2019 as a single charcoal grill outside a Karachi college gate.
            One smash patty, one secret sauce, and a line that wrapped around the block.
          </p>
          <p className="mt-4 text-smoke">
            Today we run a full kitchen — but the rules haven't changed: fresh beef ground every
            morning, buns baked in-house, and every single burger made only after you order it.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <img
            src={STORY_IMG}
            alt="BurgerHouse chef preparing a flame-grilled burger"
            loading="lazy"
            width="900"
            height="600"
            className="rounded-[2.5rem] border border-line shadow-soft"
          />
        </Reveal>
      </section>

      {/* Mission / values */}
      <section className="bg-charcoal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal><SectionHeading eyebrow="What drives us" title="Mission & promise" /></Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, t: "Our mission", d: "Make world-class burgers as easy to order as sending a text — literally." },
              { icon: Leaf, t: "Fresh ingredients", d: "Local beef, same-day produce, buns from our own oven. Nothing frozen, ever." },
              { icon: Flame, t: "Real fire", d: "Charcoal and flame. Smoke is our most important ingredient." },
              { icon: ShieldCheck, t: "Quality promise", d: "If your burger isn't perfect, we remake and redeliver it free." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-flame/20 to-ember/20 text-ember">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold">{t}</h2>
                  <p className="mt-2 text-sm text-smoke">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
