import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import "dotenv/config";

import { supabase } from "./src/supabase.js";
import burgersRouter from "./src/routes/burgers.js";
import ordersRouter from "./src/routes/orders.js";
import analyticsRouter from "./src/routes/analytics.js";
import contactRouter from "./src/routes/contact.js";
import authRouter from "./src/routes/auth.js";
import uploadRouter from "./src/routes/upload.js";
import reviewsRouter from "./src/routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "200kb" }));
app.set("trust proxy", true);

// ---- Routes ----
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/burgers", burgersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reviews", reviewsRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "burgerhouse-api" }));

// ---- Error handler ----
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, async () => {
  console.log(`🍔 BurgerHouse API running on http://localhost:${PORT}`);

  // Startup check: verify Supabase is reachable so config problems are obvious
  const { error } = await supabase.from("burgers").select("id", { head: true, count: "exact" });
  if (error) {
    console.error("❌ Supabase connection FAILED:", error.message);
    console.error("   → Check SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env");
    console.error("   → Make sure the key is the SECRET / service_role key (sb_secret_... or eyJ...), NOT the publishable key");
  } else {
    console.log("✅ Supabase connected — orders will be saved.");
  }
});
