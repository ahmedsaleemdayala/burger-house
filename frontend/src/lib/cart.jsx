import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{id, name, price, image, qty}]
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const addItem = (burger, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === burger.id);
      if (found) return prev.map((i) => (i.id === burger.id ? { ...i, qty: Math.min(20, i.qty + qty) } : i));
      return [...prev, { id: burger.id, name: burger.name, price: burger.price, image: burger.image, qty }];
    });
  };

  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i)));

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value = { items, addItem, setQty, removeItem, clearCart, total, count, checkoutOpen, setCheckoutOpen };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
