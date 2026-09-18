import { Router } from "express";
import { supabase } from "../supabase.js";
import { requireAdmin } from "../auth.js";

const router = Router();

/**
 * POST /api/orders
 * Called when the customer submits the order popup form.
 * Body: { customerName, phone, address, instructions,
 *         items: [{name, qty, price, amount}], total,
 *         device, browser, pageURL }
 */
router.post("/", async (req, res) => {
  const {
    customerName, phone, address, instructions,
    items, total,
    // backwards-compat single-burger fields:
    burgerName, quantity = 1, customerMessage,
    device, browser, pageURL,
  } = req.body;

  const orderItems = Array.isArray(items) && items.length
    ? items
    : burgerName
      ? [{ name: burgerName, qty: quantity, price: 0, amount: 0 }]
      : null;

  if (!orderItems) return res.status(400).json({ error: "items are required" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      burger_name: orderItems[0].name,          // primary burger (for quick reference)
      quantity: orderItems.reduce((s, i) => s + (i.qty || 1), 0),
      items: orderItems,
      total: total ?? null,
      customer_name: customerName || null,
      phone: phone || null,
      address: address || null,
      instructions: instructions || null,
      customer_message: customerMessage || null,
      whatsapp_clicked: true,
      device, browser,
      page_url: pageURL,
      ip,
    })
    .select()
    .single();

  if (error) {
    // Clear logging so save-failures are visible in the backend terminal
    console.error("❌ Order save failed:", error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log(`✅ Order saved: #${data.id} — ${orderItems.map(i => `${i.name} x${i.qty}`).join(", ")}`);
  res.status(201).json(data);
});

/** GET /api/orders — latest orders (admin only) */
router.get("/", requireAdmin, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("order_date", { ascending: false })
    .limit(limit);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/** Allowed order statuses (pipeline order matters) */
const STATUSES = ["received", "preparing", "out_for_delivery", "delivered"];

/** PATCH /api/orders/:id/status — update order status (admin only) */
router.patch("/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Allowed: ${STATUSES.join(", ")}` });
  }
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  console.log(`📦 Order #${data.id} status → ${status}`);
  res.json(data);
});

export default router;
