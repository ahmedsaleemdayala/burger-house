import { useState } from "react";
import { Lock, User, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.js";

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.username || !form.password) return toast.error("Please enter both username and password");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      sessionStorage.setItem("bh_admin_token", data.token);
      toast.success(`Welcome back, ${data.username}! 👋`);
      onLogin();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed — is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-coal px-4 py-3 pl-11 text-sm placeholder:text-smoke/50 focus:border-ember focus:outline-none";

  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-line bg-card p-8 shadow-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-flame to-ember shadow-glow">
          <Lock size={24} aria-hidden="true" />
        </div>
        <h1 className="display mt-5 text-center text-3xl">Admin login</h1>
        <p className="mt-2 text-center text-sm text-smoke">BurgerHouse dashboard access</p>

        <div className="mt-7 space-y-4">
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-smoke" aria-hidden="true" />
            <label htmlFor="a-user" className="sr-only">Username</label>
            <input id="a-user" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="Username" className={inputCls} autoComplete="username" />
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-smoke" aria-hidden="true" />
            <label htmlFor="a-pass" className="sr-only">Password</label>
            <input id="a-pass" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Password" className={inputCls} autoComplete="current-password" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-flame to-ember py-3 font-bold shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            <LogIn size={17} aria-hidden="true" /> {loading ? "Logging in…" : "Log in"}
          </button>
        </div>
        <p className="mt-5 text-center text-[11px] text-smoke">
          Credentials are set in backend/.env (ADMIN_USERNAME / ADMIN_PASSWORD)
        </p>
      </form>
    </div>
  );
}
