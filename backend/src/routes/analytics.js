import { Router } from "express";
import { supabase } from "../supabase.js";

const router = Router();

/** POST /api/analytics/visit — page visit event */
router.post("/visit", async (req, res) => {
  const { page, device, browser } = req.body;
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
  const { error } = await supabase.from("visits").insert({ page: page || "/", device, browser, ip });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
});

/** POST /api/analytics/whatsapp-click — floating button clicks */
router.post("/whatsapp-click", async (req, res) => {
  const { device, browser, pageURL } = req.body;
  const { error } = await supabase.from("whatsapp_clicks").insert({ device, browser, page_url: pageURL });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
});

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** GET /api/analytics/summary — everything the dashboard needs */
router.get("/summary", async (_req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(startOfToday); startOfWeek.setDate(startOfWeek.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [ordersRes, visitsRes, waRes] = await Promise.all([
      supabase.from("orders").select("burger_name, quantity, items, order_date, device").gte("order_date", sixMonthsAgo.toISOString()),
      supabase.from("visits").select("page, device"),
      supabase.from("whatsapp_clicks").select("id", { count: "exact", head: true }),
    ]);
    if (ordersRes.error) throw ordersRes.error;
    if (visitsRes.error) throw visitsRes.error;

    const orders = ordersRes.data || [];
    const visits = visitsRes.data || [];
    const floatClicks = waRes.count || 0;

    const inWindow = (o, start) => new Date(o.order_date) >= start;
    const totalOrders = orders.length;
    const ordersToday = orders.filter((o) => inWindow(o, startOfToday)).length;
    const ordersThisWeek = orders.filter((o) => inWindow(o, startOfWeek)).length;
    const ordersThisMonth = orders.filter((o) => inWindow(o, startOfMonth)).length;

    // ---- Orders per burger (multi-item aware: each item counts its qty) ----
    const perBurger = {};
    for (const o of orders) {
      if (Array.isArray(o.items) && o.items.length) {
        for (const it of o.items) perBurger[it.name] = (perBurger[it.name] || 0) + (Number(it.qty) || 1);
      } else if (o.burger_name) {
        perBurger[o.burger_name] = (perBurger[o.burger_name] || 0) + (Number(o.quantity) || 1);
      }
    }
    const byBurger = Object.entries(perBurger)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const mostOrdered = byBurger[0]?.name || "—";
    const leastOrdered = byBurger.at(-1)?.name || "—";

    // ---- Daily orders, last 7 days ----
    const daily = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek); d.setDate(d.getDate() + i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      return {
        day: DAY_NAMES[d.getDay()],
        orders: orders.filter((o) => new Date(o.order_date) >= d && new Date(o.order_date) < next).length,
      };
    });

    // ---- Monthly trend, last 6 months ----
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      return {
        month: MONTH_NAMES[d.getMonth()],
        orders: orders.filter((o) => new Date(o.order_date) >= d && new Date(o.order_date) < next).length,
      };
    });

    // ---- Devices (% of visits) ----
    const devCount = {};
    for (const v of visits) devCount[v.device || "Other"] = (devCount[v.device || "Other"] || 0) + 1;
    const totalVisits = visits.length || 1;
    const devices = Object.entries(devCount).map(([name, n]) => ({ name, value: Math.round((n / totalVisits) * 100) }));

    // ---- Top landing pages ----
    const pageCount = {};
    for (const v of visits) pageCount[v.page || "/"] = (pageCount[v.page || "/"] || 0) + 1;
    const topPages = Object.entries(pageCount)
      .map(([page, visitsN]) => ({ page, visits: visitsN }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 6);

    const visitors = visits.length;
    const whatsappClicks = totalOrders + floatClicks;
    const conversionRate = visitors ? Number(((totalOrders / visitors) * 100).toFixed(1)) : 0;

    res.json({
      totalOrders, ordersToday, ordersThisWeek, ordersThisMonth,
      whatsappClicks, visitors, conversionRate,
      mostOrdered, leastOrdered,
      byBurger, daily, monthly, devices, topPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to build analytics summary" });
  }
});

export default router;
