import { useEffect, useState } from "react";
import api from "./api.js";

/**
 * Fetch the menu from the database (single source of truth).
 * No hardcoded fallback — the UI shows skeletons while loading
 * and a clear error state if the backend is unreachable.
 */
export default function useBurgers() {
  const [burgers, setBurgers] = useState(null); // null => loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .get("/burgers")
      .then((res) => alive && setBurgers(res.data || []))
      .catch(() => { if (alive) { setBurgers([]); setError(true); } });
    return () => { alive = false; };
  }, []);

  return { burgers, loading: burgers === null, error };
}
