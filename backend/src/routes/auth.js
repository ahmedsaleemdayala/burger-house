import { Router } from "express";
import { createToken } from "../auth.js";
import "dotenv/config";

const router = Router();

/** POST /api/auth/login — { username, password } → { token } */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "burger123";

  if (username === validUser && password === validPass) {
    return res.json({ token: createToken(username), username });
  }
  res.status(401).json({ error: "Invalid username or password" });
});

export default router;
