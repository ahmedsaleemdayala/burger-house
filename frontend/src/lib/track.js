import api from "./api.js";

/** Detect device type from viewport / UA */
export function getDevice() {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  if (/mobi|android|iphone/i.test(ua)) return "Mobile";
  return "Desktop";
}

/** Rough browser name detection */
export function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  return "Other";
}

/** Track a page visit (once per page per session). Fails silently if backend is off. */
export function trackVisit(page) {
  try {
    const key = `bh_visit_${page}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    api.post("/analytics/visit", { page, device: getDevice(), browser: getBrowser() }).catch(() => {});
  } catch {
    /* analytics must never break the UI */
  }
}
