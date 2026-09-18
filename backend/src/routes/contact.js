import { Router } from "express";
import { supabase } from "../supabase.js";
import { requireAdmin } from "../auth.js";

const router = Router();

/** POST /api/contact — save a contact form message (name + phone + message) */
router.post("/", async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "name, phone and message are required" });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name: name.trim().slice(0, 60),
      phone: phone.trim().slice(0, 20),
      message: message.trim().slice(0, 1000),
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/** GET /api/contact — list messages (admin) */
router.get("/", requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
