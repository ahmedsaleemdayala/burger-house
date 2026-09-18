import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn("⚠️  SUPABASE_URL / SUPABASE_SERVICE_KEY missing — set them in backend/.env");
}

// Service-role client (server-side only — never expose this key to the frontend)
export const supabase = createClient(
  process.env.SUPABASE_URL || "http://localhost",
  process.env.SUPABASE_SERVICE_KEY || "anon"
);
