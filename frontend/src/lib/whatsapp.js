import api from "./api.js";
import { WHATSAPP_NUMBER, RESTAURANT } from "./config.js";
import { getDevice, getBrowser } from "./track.js";

/**
 * Build the WhatsApp order message:
 * customer details + every burger (name, qty, rate, amount) + grand total + thank you.
 */
export function buildOrderMessage({ customer, items, total }) {
  const lines = [
    `Assalam-o-Alaikum! 🍔`,
    `*New Order — ${RESTAURANT.name}*`,
    ``,
    `👤 *Name:* ${customer.name}`,
    `📞 *Phone:* ${customer.phone}`,
    `📍 *Address:* ${customer.address}`,
    ``,
    `🛒 *My Order:*`,
  ];

  items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name}`);
    lines.push(`   Qty: ${it.qty} × PKR ${it.price} = *PKR ${it.qty * it.price}*`);
  });

  lines.push(``, `💰 *Grand Total: PKR ${total}*`);

  if (customer.instructions?.trim()) {
    lines.push(``, `📝 *Special Instructions:*`, customer.instructions.trim());
  }

  lines.push(
    ``,
    `Please confirm my order. Thank you! 😊`,
    `_Can't wait to enjoy your delicious burgers!_ 🔥`
  );

  return lines.join("\n");
}

/**
 * Save the order to the backend, then open WhatsApp.
 * Returns { saved: boolean, error?: string } — WhatsApp opens either way,
 * so a backend hiccup never blocks the customer.
 */
export async function submitOrder({ customer, items, total }) {
  const message = buildOrderMessage({ customer, items, total });
  let saved = false;
  let error;

  try {
    await api.post("/orders", {
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      instructions: customer.instructions,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, amount: i.qty * i.price })),
      total,
      customerMessage: message,
      device: getDevice(),
      browser: getBrowser(),
      pageURL: window.location.href,
    });
    saved = true;
  } catch (e) {
    error = e?.response?.data?.error || e.message;
    console.error("Order save failed:", error);
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");

  return { saved, error };
}
