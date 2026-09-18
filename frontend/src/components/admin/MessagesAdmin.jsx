import { useEffect, useState } from "react";
import { RefreshCw, Phone, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.js";
import { toWhatsAppNumber } from "../../lib/status.js";
import { RESTAURANT } from "../../lib/config.js";

/**
 * Contact form messages — straight from the database.
 * "Reply on WhatsApp" opens WhatsApp to the sender's number.
 */
export default function MessagesAdmin() {
  const [messages, setMessages] = useState(null);

  const load = () => {
    api.get("/contact")
      .then((res) => setMessages(res.data))
      .catch((err) => {
        setMessages([]);
        toast.error(err?.response?.data?.error || "Could not load messages — please check the backend server");
      });
  };
  useEffect(load, []);

  const replyOnWhatsApp = (m) => {
    const num = toWhatsAppNumber(m.phone);
    if (!num) return toast.error("This message has no phone number saved");
    const text = encodeURIComponent(
      `Hi ${m.name}! This is ${RESTAURANT.name} 🍔\nThank you for contacting us. `
    );
    window.open(`https://wa.me/${num}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  if (!messages) {
    return <div className="grid h-60 place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-ember" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Contact messages <span className="text-sm font-normal text-smoke">({messages.length})</span>
        </h2>
        <button onClick={load} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-smoke transition hover:border-ember hover:text-cream">
          <RefreshCw size={13} aria-hidden="true" /> Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-card p-8 text-center text-sm text-smoke">
          No messages yet. When someone submits the contact form, it will appear here.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="rounded-2xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{m.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-smoke">
                    <Phone size={11} aria-hidden="true" /> {m.phone || m.email || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-smoke">
                    {new Date(m.created_at).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  {m.phone && (
                    <button
                      onClick={() => replyOnWhatsApp(m)}
                      className="flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-smoke transition hover:border-[#25D366] hover:text-[#25D366]"
                    >
                      <MessageCircle size={12} aria-hidden="true" /> Reply on WhatsApp
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-coal px-4 py-3 text-sm text-smoke">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
