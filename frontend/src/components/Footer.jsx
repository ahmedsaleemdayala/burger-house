import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { Flame, Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { RESTAURANT } from "../lib/config.js";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast.error("Please enter a valid email");
    toast.success("Subscribed! Fresh deals coming your way 🍔");
    setEmail("");
  };

  return (
    <footer className="border-t border-line bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-flame to-ember">
              <Flame size={18} aria-hidden="true" />
            </span>
            <span className="display text-xl">BurgerHouse</span>
          </div>
          <p className="mt-4 text-sm text-smoke">
            Flame-grilled premium burgers, delivered fast. Order in one tap on WhatsApp.
          </p>
          <div className="mt-4 flex gap-3">
            <a href={RESTAURANT.socials.instagram} aria-label="Instagram" className="rounded-lg border border-line p-2 text-smoke transition hover:border-ember hover:text-ember"><Instagram size={18} /></a>
            <a href={RESTAURANT.socials.facebook} aria-label="Facebook" className="rounded-lg border border-line p-2 text-smoke transition hover:border-ember hover:text-ember"><Facebook size={18} /></a>
          </div>
        </div>

        <nav aria-label="Footer">
          <h3 className="font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-smoke">
            <li><Link className="hover:text-ember" to="/">Home</Link></li>
            <li><Link className="hover:text-ember" to="/menu">Menu</Link></li>
            <li><Link className="hover:text-ember" to="/about">About us</Link></li>
            <li><Link className="hover:text-ember" to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <address className="not-italic">
          <h3 className="font-semibold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-smoke">
            <li className="flex items-center gap-2"><Phone size={15} /> {RESTAURANT.phone}</li>
            <li className="flex items-center gap-2"><Mail size={15} /> {RESTAURANT.email}</li>
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> {RESTAURANT.address}</li>
          </ul>
        </address>

        <div>
          <h3 className="font-semibold">Hungry newsletter</h3>
          <p className="mt-4 text-sm text-smoke">New drops & secret deals. No spam, only sauce.</p>
          <div className="mt-4 flex gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-line bg-coal px-4 py-2.5 text-sm placeholder:text-smoke/60 focus:border-ember focus:outline-none"
            />
            <button onClick={subscribe} className="rounded-xl bg-gradient-to-r from-flame to-ember px-4 py-2.5 text-sm font-semibold transition hover:scale-105">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-smoke">
        © {new Date().getFullYear()} BurgerHouse. All rights reserved. Made with 🔥 in Karachi.
      </div>
    </footer>
  );
}
