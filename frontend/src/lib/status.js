/**
 * Simple order status pipeline (no customer messaging):
 * Received → Preparing → Out for delivery → Delivered
 */
export const STATUS_FLOW = ["received", "preparing", "out_for_delivery", "delivered"];

export const STATUS_META = {
  received:         { label: "Received",         color: "text-mustard bg-mustard/15",     emoji: "📥" },
  preparing:        { label: "Preparing",        color: "text-ember bg-ember/15",         emoji: "👨‍🍳" },
  out_for_delivery: { label: "Out for delivery", color: "text-[#60a5fa] bg-[#60a5fa]/15", emoji: "🛵" },
  delivered:        { label: "Delivered",        color: "text-[#25D366] bg-[#25D366]/15", emoji: "✅" },
  // Legacy statuses from older orders (still display correctly)
  ready:            { label: "Ready",            color: "text-[#4ade80] bg-[#4ade80]/15", emoji: "🍔" },
  picked_up:        { label: "Picked up",        color: "text-[#60a5fa] bg-[#60a5fa]/15", emoji: "🛵" },
};

/** Next step in the pipeline (null when delivered) */
export function nextStatus(current) {
  const i = STATUS_FLOW.indexOf(current || "received");
  if (i === -1) return "preparing"; // legacy status → continue from preparing
  return i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

/** Convert local phone (03XX…) to international WhatsApp format (923XX…) */
export function toWhatsAppNumber(phone) {
  if (!phone) return null;
  let p = String(phone).replace(/[^\d]/g, "");
  if (p.startsWith("0")) p = "92" + p.slice(1);
  if (!p.startsWith("92")) p = "92" + p;
  return p;
}
