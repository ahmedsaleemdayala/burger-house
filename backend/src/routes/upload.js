import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { supabase } from "../supabase.js";
import { requireAdmin } from "../auth.js";

const router = Router();

// Keep the file in memory, max 5 MB, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
  },
});

/**
 * POST /api/upload  (admin only, multipart/form-data, field name: "image")
 * Uploads to Supabase Storage bucket "burger-images" and returns the public URL.
 */
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file received" });

  const ext = req.file.mimetype.split("/")[1].replace("jpeg", "jpg");
  const fileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  const { error } = await supabase.storage
    .from("burger-images")
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

  if (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  const { data } = supabase.storage.from("burger-images").getPublicUrl(fileName);
  res.status(201).json({ url: data.publicUrl });
});

// Multer error handler (file too big, wrong type)
router.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message });
});

export default router;
