import { Router } from "express";
import { supabase } from "../supabase.js";
import { requireAdmin } from "../auth.js";

const router = Router();

/** Map DB row (snake_case) → API shape the frontend expects (camelCase) */
const toApi = (b) => ({ ...b, oldPrice: b.old_price ?? undefined });

/** GET /api/burgers — public menu (best rated first) */
router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("burgers")
    .select("*")
    .order("rating", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(toApi));
});

/** POST /api/burgers — add burger (admin) */
router.post("/", requireAdmin, async (req, res) => {
  const { name, description, ingredients, category, price, rating, image, availability, badges, oldPrice } = req.body;
  if (!name || !price) return res.status(400).json({ error: "name and price are required" });

  const { data, error } = await supabase
    .from("burgers")
    .insert({
      name, description,
      ingredients: ingredients || [],
      category: category || "Beef",
      price: Number(price),
      rating: Number(rating) || 4.5,
      image,
      availability: availability !== false,
      badges: badges || [],
      old_price: oldPrice ? Number(oldPrice) : null,
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(toApi(data));
});

/** PATCH /api/burgers/:id — update burger (admin) */
router.patch("/:id", requireAdmin, async (req, res) => {
  const { oldPrice, ...rest } = req.body;
  const patch = { ...rest };
  if (oldPrice !== undefined) patch.old_price = oldPrice ? Number(oldPrice) : null;
  delete patch.id;
  delete patch.created_at;

  const { data, error } = await supabase
    .from("burgers")
    .update(patch)
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toApi(data));
});

/** DELETE /api/burgers/:id (admin) */
router.delete("/:id", requireAdmin, async (req, res) => {
  const { error } = await supabase.from("burgers").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

export default router;
