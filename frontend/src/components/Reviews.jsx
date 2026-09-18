import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, PenLine, X, Send } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api.js";
import StarRating from "./StarRating.jsx";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";

/** Clickable 1–5 star selector for the review form */
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-125"
        >
          <Star
            size={26}
            className={i <= (hover || value) ? "fill-mustard text-mustard" : "text-line"}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Customer reviews — loaded from the database.
 * "Write a review" opens a popup; the review is saved to Supabase
 * and appears instantly (and stays after refresh).
 */
export default function Reviews() {
  const [reviews, setReviews] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 0, text: "" });
  const [sending, setSending] = useState(false);

  const load = () => {
    api.get("/reviews")
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  };
  useEffect(load, []);

  const submit = async () => {
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    if (!form.rating) return toast.error("Please select a star rating");
    if (form.text.trim().length < 10) return toast.error("Review must be at least 10 characters");

    setSending(true);
    try {
      await api.post("/reviews", form);
      toast.success("Thank you for your review! ⭐");
      setForm({ name: "", rating: 0, text: "" });
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Could not submit review — please try again");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-coal px-4 py-2.5 text-sm placeholder:text-smoke/50 focus:border-ember focus:outline-none";

  return (
    <section className="bg-charcoal py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><SectionHeading eyebrow="Word on the street" title="Customer reviews" /></Reveal>

        <div className="mt-8 text-center">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-ember/60 px-6 py-3 text-sm font-bold text-ember transition hover:bg-ember hover:text-coal"
          >
            <PenLine size={16} aria-hidden="true" /> Write a review
          </button>
        </div>

        {/* Reviews grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews === null &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 rounded-3xl border border-line bg-card" aria-hidden="true">
                <div className="skeleton m-5 h-4 w-24 rounded-full" />
                <div className="skeleton mx-5 h-3 w-full rounded-full" />
                <div className="skeleton m-5 h-3 w-2/3 rounded-full" />
              </div>
            ))}

          {reviews?.length === 0 && (
            <p className="col-span-full rounded-3xl border border-line bg-card p-8 text-center text-sm text-smoke">
              No reviews yet — be the first to share your experience! 🍔
            </p>
          )}

          {reviews?.map((r, i) => (
            <Reveal key={r.id} delay={Math.min(i * 0.06, 0.3)} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-card p-6">
                <StarRating rating={r.rating} showValue={false} />
                <blockquote className="mt-4 flex-1 text-sm text-smoke">"{r.text}"</blockquote>
                <figcaption className="mt-4 text-sm font-bold text-mustard">— {r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ============ WRITE A REVIEW POPUP ============ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-coal/80 p-4 backdrop-blur-sm"
            onClick={() => !sending && setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-line bg-charcoal p-6 shadow-soft sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="display text-2xl">
                  Share your <span className="text-flame-gradient">experience</span>
                </h3>
                <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 text-smoke transition hover:bg-card hover:text-cream">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-smoke">Your rating *</label>
                  <StarInput value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
                </div>
                <div>
                  <label htmlFor="r-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Your name *</label>
                  <input id="r-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Hassan R." className={inputCls} maxLength={60} />
                </div>
                <div>
                  <label htmlFor="r-text" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Your review *</label>
                  <textarea id="r-text" rows={4} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="Tell everyone what you loved…" className={`${inputCls} resize-none`} maxLength={500} />
                  <p className="mt-1 text-right text-[11px] text-smoke">{form.text.length}/500</p>
                </div>
                <button
                  onClick={submit}
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame to-ember py-3 font-bold shadow-glow transition hover:brightness-110 disabled:opacity-50"
                >
                  <Send size={16} aria-hidden="true" /> {sending ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
