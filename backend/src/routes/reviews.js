import { Router } from "express";
import { supabase } from "../supabase.js";

const router = Router();

/** GET /api/reviews — latest customer reviews */
router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, rating, text, created_at")
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/** POST /api/reviews — customer submits a review */
router.post("/", async (req, res) => {
  const { name, rating, text } = req.body;

  if (!name?.trim() || name.trim().length < 2)
    return res.status(400).json({ error: "Please enter your name" });
  const stars = Number(rating);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5)
    return res.status(400).json({ error: "Rating must be between 1 and 5 stars" });
  if (!text?.trim() || text.trim().length < 10)
    return res.status(400).json({ error: "Review must be at least 10 characters" });

  const { data, error } = await supabase
    .from("reviews")
    .insert({ name: name.trim().slice(0, 60), rating: stars, text: text.trim().slice(0, 500) })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

export default router;
