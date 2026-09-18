import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../lib/cart.jsx";

/** Floating bar that appears when the cart has items */
export default function CartBar() {
  const { count, total, setCheckoutOpen, checkoutOpen } = useCart();

  return (
    <AnimatePresence>
      {count > 0 && !checkoutOpen && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          onClick={() => setCheckoutOpen(true)}
          className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-gradient-to-r from-flame to-ember px-6 py-3.5 font-bold shadow-glow transition hover:scale-105"
          aria-label={`View order — ${count} items, PKR ${total}`}
        >
          <span className="relative">
            <ShoppingBag size={20} aria-hidden="true" />
            <span className="absolute -right-2.5 -top-2.5 grid h-5 w-5 place-items-center rounded-full bg-mustard text-[11px] font-extrabold text-coal">
              {count}
            </span>
          </span>
          <span className="text-sm">View order · PKR {total}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
