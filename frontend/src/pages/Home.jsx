import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Flame, Timer, Leaf, BadgeCheck, ChevronDown, MessageCircle } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import BurgerCard from "../components/BurgerCard.jsx";
import SkeletonCard from "../components/Skeleton.jsx";
import Reviews from "../components/Reviews.jsx";
import useBurgers from "../lib/useBurgers.js";
import { FAQS } from "../data/burgers.js";

const HERO_IMG = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1100&q=85";

const GALLERY = [
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=75",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=75",
  "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=75",
  "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&q=75",
  "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=75",
  "https://images.unsplash.com/photo-1615297928064-24977384d0da?w=600&q=75",
];

const TICKER = ["Smashed to order", "100% fresh beef", "Ready in 20 min", "Order on WhatsApp", "Flame grilled", "House-baked buns"];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-line bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold"
      >
        {q}
        <ChevronDown size={18} className={`shrink-0 text-ember transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm text-smoke">{a}</p>}
    </div>
  );
}

/** Grid of burger cards with loading skeletons and an error state */
function BurgerGrid({ list, loading, error, count, cols }) {
  if (loading) {
    return (
      <div className={`mt-12 grid gap-6 sm:grid-cols-2 ${cols}`}>
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  if (error || !list.length) {
    return (
      <p className="mt-12 rounded-3xl border border-line bg-card p-8 text-center text-sm text-smoke">
        {error
          ? "Menu could not be loaded — please make sure the backend server is running."
          : "No burgers on the menu yet — add some from the admin dashboard."}
      </p>
    );
  }
  return (
    <div className={`mt-12 grid gap-6 sm:grid-cols-2 ${cols}`}>
      {list.map((b, i) => (
        <Reveal key={b.id} delay={i * 0.08} className="h-full"><BurgerCard burger={b} /></Reveal>
      ))}
    </div>
  );
}

export default function Home() {
  // All burgers come from the database — one source of truth
  const { burgers, loading, error } = useBurgers();

  const available = burgers || [];
  const bestsellers = available.filter((b) => b.badges?.includes("bestseller"));
  const featured = (bestsellers.length ? bestsellers : available).slice(0, 3);
  const popular = [...available].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const hero = featured[0];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-ember/15 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-flame/10 blur-[100px]" aria-hidden="true" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold uppercase tracking-widest text-mustard"
            >
              <Flame size={14} /> Karachi's juiciest smash burgers
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="display mt-6 text-6xl sm:text-7xl lg:text-8xl"
            >
              Flame. Beef.
              <br />
              <span className="text-flame-gradient">Zero regrets.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-md text-lg text-smoke"
            >
              Hand-smashed patties, house-baked brioche and sauces we refuse to explain.
              Pick a burger, tap once, and order straight on WhatsApp.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/menu"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-flame to-ember px-7 py-3.5 font-bold shadow-glow transition hover:scale-105"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </Link>
              <Link
                to="/menu"
                className="rounded-full border border-line px-7 py-3.5 font-semibold text-smoke transition hover:border-ember hover:text-cream"
              >
                Browse menu
              </Link>
            </motion.div>

            <div className="mt-10 flex gap-8">
              {[["25k+", "Orders served"], ["4.8★", "Average rating"], ["20 min", "Avg. delivery"]].map(([n, l]) => (
                <div key={l}>
                  <p className="display text-3xl text-mustard">{n}</p>
                  <p className="text-xs uppercase tracking-widest text-smoke">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero burger image — name & price come from the database */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-flame/40 to-mustard/30 blur-3xl" aria-hidden="true" />
            <motion.img
              src={hero?.image || HERO_IMG}
              alt={hero ? `${hero.name} — our signature burger` : "Signature flame-grilled burger"}
              width="900"
              height="900"
              fetchpriority="high"
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative aspect-square w-full rounded-[2.5rem] border border-line object-cover shadow-soft"
            />
            {hero && (
              <div className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-full glass px-6 py-3 text-sm font-bold">
                🍔 {hero.name} — <span className="text-mustard">PKR {hero.price}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Marquee ticker */}
        <div className="overflow-hidden border-y border-line bg-charcoal py-3" aria-hidden="true">
          <div className="marquee-track flex w-max gap-10">
            {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="display flex items-center gap-10 whitespace-nowrap text-lg text-smoke">
                {t} <Flame size={14} className="text-ember" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED (from database) ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal><SectionHeading eyebrow="Chef's picks" title="Featured burgers" /></Reveal>
        <BurgerGrid list={featured} loading={loading} error={error} count={3} cols="lg:grid-cols-3" />
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="bg-charcoal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal><SectionHeading eyebrow="The BurgerHouse difference" title="Why choose us" /></Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Flame, t: "Flame grilled", d: "Every patty kissed by real fire, never a sad flat-top shortcut." },
              { icon: Leaf, t: "Fresh daily", d: "Buns baked each morning, produce sourced from local markets." },
              { icon: Timer, t: "20-min promise", d: "From WhatsApp ping to your doorstep, faster than your cravings." },
              { icon: BadgeCheck, t: "Quality sworn", d: "Not happy with your burger? We remake it. No questions." },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="group h-full rounded-3xl border border-line bg-card p-6 transition hover:border-ember/50 hover:shadow-glow">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-flame/20 to-ember/20 text-ember transition group-hover:scale-110">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-sm text-smoke">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR (from database) ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal><SectionHeading eyebrow="Crowd favourites" title="Popular right now" /></Reveal>
        <BurgerGrid list={popular} loading={loading} error={error} count={4} cols="lg:grid-cols-4" />
      </section>

      {/* ============ REVIEWS (from database + write your own) ============ */}
      <Reviews />

      {/* ============ GALLERY ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal><SectionHeading eyebrow="Feast your eyes" title="From the grill" /></Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY.map((src, i) => (
            <Reveal key={src} delay={i * 0.05}>
              <div className="group overflow-hidden rounded-3xl border border-line">
                <img
                  src={src}
                  alt={`BurgerHouse gallery photo ${i + 1}`}
                  loading="lazy"
                  width="600"
                  height="400"
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-56"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-charcoal py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal><SectionHeading eyebrow="Questions" title="FAQs" /></Reveal>
          <div className="mt-12 space-y-4">
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-flame/20 via-charcoal to-ember/10 p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ember/20 blur-3xl" aria-hidden="true" />
            <h2 className="display text-5xl sm:text-6xl">
              Hungry? <span className="text-flame-gradient">Tap once.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-smoke">
              No app downloads. No signups. Just pick a burger and it lands in your WhatsApp.
            </p>
            <Link
              to="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-flame to-ember px-8 py-4 font-bold shadow-glow transition hover:scale-105"
            >
              <MessageCircle size={18} /> Order on WhatsApp
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
