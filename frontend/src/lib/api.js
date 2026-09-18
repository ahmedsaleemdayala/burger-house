import axios from "axios";
import toast from "react-hot-toast";

// In dev, Vite proxies /api -> http://localhost:5000
// In production set VITE_API_URL in .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

// Attach admin token (if logged in) to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("bh_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is expired/invalid (401), log out automatically
// and show the login screen again — no more silent "Save failed".
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const hadToken = sessionStorage.getItem("bh_admin_token");
    if (status === 401 && hadToken) {
      sessionStorage.removeItem("bh_admin_token");
      toast.error("Session expired — please log in again", { id: "session-expired" });
      if (window.location.pathname.startsWith("/admin")) {
        setTimeout(() => window.location.reload(), 900);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
