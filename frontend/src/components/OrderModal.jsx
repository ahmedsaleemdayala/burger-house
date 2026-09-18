import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, MessageCircle, User, Phone, MapPin, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../lib/cart.jsx";
import { submitOrder } from "../lib/whatsapp.js";

/**
 * Checkout popup — opens when the customer taps "Order on WhatsApp".
 * Collects name / phone / address / special instructions,
 * shows every burger with qty × rate = amount and the grand total,
 * then saves the order and opens WhatsApp with the full message.
 */
export default function OrderModal() {
  const { items, setQty, removeItem, clearCart, total, checkoutOpen, setCheckoutOpen } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", instructions: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const close = () => !sending && setCheckoutOpen(false);

  const placeOrder = async () => {
    if (!items.length) return toast.error("Your cart is empty — please add a burger first");
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!/^(\+?92|0)?3\d{9}$/.test(phone)) return toast.error("Please enter a valid phone number (e.g. 03XX-XXXXXXX)");
    if (form.address.trim().length < 8) return toast.error("Please enter your complete delivery address");

    setSending(true);
    const { saved, error } = await submitOrder({
      customer: { ...form, phone },
      items,
      total,
    });
    setSending(false);

    if (saved) {
      toast.success("Order placed! Please send the message on WhatsApp ✅", { duration: 5000 });
    } else {
      toast.error(`Order could not be saved (${error}) — but WhatsApp is opening`, { duration: 6000 });
    }

    clearCart();
    setForm({ name: "", phone: "", address: "", instructions: "" });
    setCheckoutOpen(false);
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-coal px-4 py-2.5 pl-10 text-sm placeholder:text-smoke/50 focus:border-ember focus:outline-none";

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-coal/80 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Complete your order"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-lg rounded-3xl border border-line bg-charcoal shadow-soft"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="display text-2xl">
                Complete <span className="text-flame-gradient">your order</span>
              </h2>
              <button onClick={close} aria-label="Close" className="rounded-full p-2 text-smoke transition hover:bg-card hover:text-cream">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {/* Cart items */}
              {items.length === 0 ? (
                <p className="rounded-2xl border border-line bg-card p-5 text-center text-sm text-smoke">
                  Your cart is empty — add a burger from the menu 🍔
                </p>
              ) : (
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
                      <img src={it.image} alt={it.name} className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{it.name}</p>
                        <p className="text-xs text-smoke">
                          {it.qty} × PKR {it.price} = <span className="font-bold text-mustard">PKR {it.qty * it.price}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-line px-1.5 py-1">
                        <button onClick={() => setQty(it.id, it.qty - 1)} aria-label={`Decrease ${it.name} quantity`} className="p-0.5 text-smoke hover:text-cream"><Minus size={13} /></button>
                        <span className="w-5 text-center text-sm font-semibold">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} aria-label={`Increase ${it.name} quantity`} className="p-0.5 text-smoke hover:text-cream"><Plus size={13} /></button>
                      </div>
                      <button onClick={() => removeItem(it.id)} aria-label={`Remove ${it.name}`} className="p-1.5 text-smoke transition hover:text-flame">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Grand total */}
              {items.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-flame/15 to-ember/15 px-5 py-3.5">
                  <span className="text-sm font-semibold text-smoke">Grand Total</span>
                  <span className="display text-2xl text-mustard">PKR {total}</span>
                </div>
              )}

              {/* Customer form */}
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <label htmlFor="o-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Name *</label>
                  <User size={15} className="pointer-events-none absolute bottom-3 left-3.5 text-smoke" aria-hidden="true" />
                  <input id="o-name" value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls} />
                </div>
                <div className="relative">
                  <label htmlFor="o-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Phone number *</label>
                  <Phone size={15} className="pointer-events-none absolute bottom-3 left-3.5 text-smoke" aria-hidden="true" />
                  <input id="o-phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="03XX-XXXXXXX" className={inputCls} />
                </div>
                <div className="relative">
                  <label htmlFor="o-address" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Delivery address *</label>
                  <MapPin size={15} className="pointer-events-none absolute left-3.5 top-[38px] text-smoke" aria-hidden="true" />
                  <textarea id="o-address" rows={2} value={form.address} onChange={set("address")} placeholder="House #, street, area, city" className={`${inputCls} resize-none`} />
                </div>
                <div className="relative">
                  <label htmlFor="o-notes" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke">Special instructions (optional)</label>
                  <StickyNote size={15} className="pointer-events-none absolute left-3.5 top-[38px] text-smoke" aria-hidden="true" />
                  <textarea id="o-notes" rows={2} value={form.instructions} onChange={set("instructions")} placeholder="e.g. Extra spicy, no onions, ring the bell…" className={`${inputCls} resize-none`} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-line px-6 py-4">
              <button
                onClick={placeOrder}
                disabled={sending || items.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame to-ember py-3.5 font-bold shadow-glow transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {sending ? "Processing…" : `Send order on WhatsApp — PKR ${total}`}
              </button>
              <p className="mt-2.5 text-center text-[11px] text-smoke">
                After submitting, WhatsApp will open — send the message and we will confirm your order right away. 💬
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
