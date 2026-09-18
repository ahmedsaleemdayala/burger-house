import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "../lib/config.js";
import api from "../lib/api.js";
import { getDevice, getBrowser } from "../lib/track.js";

/** Floating WhatsApp button — visible on every page */
export default function WhatsAppFloat() {
  const open = () => {
    api.post("/analytics/whatsapp-click", { device: getDevice(), browser: getBrowser(), pageURL: window.location.href }).catch(() => {});
    const msg = encodeURIComponent("Hello! I have a question about BurgerHouse 🍔");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={open}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-coal shadow-soft transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle size={26} aria-hidden="true" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" aria-hidden="true" />
    </button>
  );
}
