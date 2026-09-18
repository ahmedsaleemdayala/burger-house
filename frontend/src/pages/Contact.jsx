import { useState } from "react";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Instagram, Facebook, Send } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import api from "../lib/api.js";
import { RESTAURANT } from "../lib/config.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim() || !form.message.trim()) return toast.error("Name and message are required");
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!/^(\+?92|0)?3\d{9}$/.test(phone)) return toast.error("Please enter a valid phone number (e.g. 03XX-XXXXXXX)");
    setSending(true);
    try {
      await api.post("/contact", { ...form, phone });
      toast.success("Message sent! We'll reply on WhatsApp within a few hours.");
      setForm({ name: "", phone: "", message: "" });
    } catch {
      toast.error("Could not send right now — please message us on WhatsApp instead.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm placeholder:text-smoke/60 focus:border-ember focus:outline-none";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal><SectionHeading eyebrow="Say hello" title="Contact us" /></Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Form */}
        <Reveal>
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
            <h2 className="text-xl font-bold">Send us a message</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-smoke">Name</label>
                <input id="c-name" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1.5 block text-sm font-medium text-smoke">Phone number</label>
                <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="03XX-XXXXXXX" className={inputCls} />
              </div>
              <div>
                <label htmlFor="c-msg" className="mb-1.5 block text-sm font-medium text-smoke">Message</label>
                <textarea id="c-msg" rows={5} value={form.message} onChange={set("message")} placeholder="How can we help?" className={inputCls} />
              </div>
              <button
                onClick={submit}
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame to-ember py-3.5 font-bold shadow-glow transition hover:brightness-110 disabled:opacity-50"
              >
                <Send size={16} aria-hidden="true" /> {sending ? "Sending…" : "Send message"}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Info + map */}
        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`} className="rounded-3xl border border-line bg-card p-5 transition hover:border-ember/60">
                <Phone size={20} className="text-ember" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold">Phone</p>
                <p className="text-sm text-smoke">{RESTAURANT.phone}</p>
              </a>
              <a href={`mailto:${RESTAURANT.email}`} className="rounded-3xl border border-line bg-card p-5 transition hover:border-ember/60">
                <Mail size={20} className="text-ember" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold">Email</p>
                <p className="text-sm text-smoke">{RESTAURANT.email}</p>
              </a>
              <div className="rounded-3xl border border-line bg-card p-5 sm:col-span-2">
                <MapPin size={20} className="text-ember" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold">Address</p>
                <p className="text-sm text-smoke">{RESTAURANT.address}</p>
                <div className="mt-3 flex gap-3">
                  <a href={RESTAURANT.socials.instagram} aria-label="Instagram" className="rounded-lg border border-line p-2 text-smoke hover:border-ember hover:text-ember"><Instagram size={16} /></a>
                  <a href={RESTAURANT.socials.facebook} aria-label="Facebook" className="rounded-lg border border-line p-2 text-smoke hover:border-ember hover:text-ember"><Facebook size={16} /></a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="overflow-hidden rounded-3xl border border-line">
              <iframe
                title="BurgerHouse location on Google Maps"
                src={RESTAURANT.mapEmbed}
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[40%] contrast-125"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
