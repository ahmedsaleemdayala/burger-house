import crypto from "crypto";
import "dotenv/config";

const SECRET = process.env.AUTH_SECRET || "burgerhouse-dev-secret";

/** Create a signed token: base64(username).timestamp.signature */
export function createToken(username) {
  const payload = `${Buffer.from(username).toString("base64")}.${Date.now()}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

/** Verify token signature + 24h expiry */
export function verifyToken(token) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [user, ts, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(`${user}.${ts}`).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  const age = Date.now() - Number(ts);
  return age >= 0 && age < 24 * 60 * 60 * 1000; // 24 hours
}

/** Express middleware — protects admin routes */
export function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!verifyToken(token)) return res.status(401).json({ error: "Unauthorized — please log in" });
  next();
}
