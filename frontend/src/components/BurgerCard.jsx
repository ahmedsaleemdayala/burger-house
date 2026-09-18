import { motion } from "framer-motion";
import { MessageCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "./StarRating.jsx";
import Badge from "./Badge.jsx";
import { useCart } from "../lib/cart.jsx";

/**
 * Burger card — image, name, description, ingredients, price, rating.
 * "Order on WhatsApp" adds the burger to the cart and opens the checkout popup.
 * "+" adds it silently so the customer can order multiple burgers together.
 */
export default function BurgerCard({ burger }) {
  const { addItem, setCheckoutOpen } = useCart();

  const orderNow = () => {
    addItem(burger, 1);
    setCheckoutOpen(true);
  };

  const addToOrder = () => {
    addItem(burger, 1);
    toast.success(`${burger.name} added to order`, { icon: "🍔", duration: 1800 });
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-soft"
    >
      {/* Image */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        <img
          src={burger.image}
          alt={`${burger.name} burger`}
          loading="lazy"
          width="800"
          height="500"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute left-3 top-3 flex gap-2">
          {burger.badges?.map((b) => <Badge key={b} type={b} />)}
        </div>
        {!burger.availability && (
          <div className="absolute inset-0 grid place-items-center bg-coal/70 text-sm font-bold uppercase tracking-widest">
            Sold out
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight">{burger.name}</h3>
          <StarRating rating={Number(burger.rating)} />
        </div>

        <p className="line-clamp-2 text-sm text-smoke">{burger.description}</p>

        {/* Ingredients */}
        <ul className="flex flex-wrap gap-1.5" aria-label="Ingredients">
          {burger.ingredients?.slice(0, 5).map((ing) => (
            <li key={ing} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-smoke">
              {ing}
            </li>
          ))}
        </ul>

        {/* Price + actions pinned to the bottom => equal card heights */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-xl font-extrabold text-mustard">
            PKR {burger.price}
            {burger.oldPrice && (
              <span className="ml-2 text-sm font-medium text-smoke line-through">PKR {burger.oldPrice}</span>
            )}
          </p>
          <button
            onClick={addToOrder}
            disabled={!burger.availability}
            aria-label={`Add ${burger.name} to order`}
            title="Add to order"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-smoke transition hover:border-ember hover:text-ember disabled:opacity-40"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>

        <button
          onClick={orderNow}
          disabled={!burger.availability}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-flame to-ember py-3 text-sm font-bold text-cream shadow-glow transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MessageCircle size={17} aria-hidden="true" />
          Order on WhatsApp
        </button>
      </div>
    </motion.article>
  );
}
