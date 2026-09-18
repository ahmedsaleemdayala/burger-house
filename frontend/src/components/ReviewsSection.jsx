import { useEffect, useState } from "react";
import { Star, PenLine, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import StarRating from "./StarRating.jsx";
import api from "../lib/api.js";
import { REVIEWS as FALLBACK } from "../data/burgers.js";

/**
 * Customer reviews — loaded from the database.
 * Includes a "Write a review" form that saves straight to the database,
 * so new reviews survive refresh and show for every visitor.
 */
export default function ReviewsSection() {
  const [reviews, setReviews] = useState(null); // null = loading
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [sending, setSending] = useState(false);

  const load = () => {
    api.get("/reviews")
      .then((res) => setReviews(res.data?.length ? res.data : FALLBACK))
      .catch(() => setReviews(FALLBACK));
  };
  useEffect(load, []);

  const submit = async () => {
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    if (form.text.trim().length < 5) return toast.error("Please write a few words about your experience");
    setSending(true);
    try {
      const { data } = await api.post("/reviews", form);
      setReviews((prev) => [data, ...(prev || [])].slice(0, 12));
      setForm({ name: "", rating: 5, text: "" });
      setShowForm(false);
      toast.success("Thank you for your review! ⭐");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Could not submit the review — please try again");
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
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-smoke transition hover:border-ember hover:text-cream"
          >
            {showForm ? <><X size={15} aria-hidden="true" /> Close</> : <><PenLine size={15} aria-hidden="true" /> Write a review</>}
          </button>
        </div>

        {/* ---- Write a review form ---- */}
        {showForm && (
          <Reveal>
            <div className="mx-auto mt-6 max-w-lg rounded-3xl border border-ember/40 bg-card p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="r-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Your name</label>
                  <input id="r-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Ahmed S." className={inputCls} />
                </div>
                <div>
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Your rating</span>
                  <div className="flex gap-1.5" role="radiogroup" aria-label="Rating out of 5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        role="radio"
                        aria-checked={form.rating === i}
                        aria-label={`${i} star${i > 1 ? "s" : ""}`}
                        onClick={() => setForm((f) => ({ ...f, rating: i }))}
                        className="p-0.5 transition hover:scale-110"
                      >
                        <Star size={26} className={i <= form.rating ? "fill-mustard text-mustard" : "text-line"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="r-text" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Your review</label>
                  <textarea id="r-text" rows={3} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="How was your burger?" className={`${inputCls} resize-none`} />
                </div>
                <button
                  onClick={submit}
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-flame to-ember py-3 font-bold shadow-glow transition hover:brightness-110 disabled:opacity-50"
                >
                  <Send size={15} aria-hidden="true" /> {sending ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* ---- Reviews grid ---- */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!reviews
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 rounded-3xl border border-line bg-card" aria-hidden="true">
                  <div className="skeleton m-6 h-4 w-2/3 rounded-full" />
                  <div className="skeleton mx-6 h-3 w-full rounded-full" />
                  <div className="skeleton m-6 h-3 w-1/2 rounded-full" />
                </div>
              ))
            : reviews.slice(0, 8).map((r) => (
                <figure key={r.id || r.name + r.text} className="h-full rounded-3xl border border-line bg-card p-6">
                  <StarRating rating={Number(r.rating)} showValue={false} />
                  <blockquote className="mt-4 text-sm text-smoke">"{r.text}"</blockquote>
                  <figcaption className="mt-4 text-sm font-bold text-mustard">— {r.name}</figcaption>
                </figure>
              ))}
        </div>
      </div>
    </section>
  );
}
