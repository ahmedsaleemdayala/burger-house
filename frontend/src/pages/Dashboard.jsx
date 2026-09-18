import { useState } from "react";
import { BarChart3, UtensilsCrossed, ClipboardList, MailOpen, LogOut } from "lucide-react";
import AdminLogin from "../components/admin/AdminLogin.jsx";
import AnalyticsPanel from "../components/admin/AnalyticsPanel.jsx";
import BurgersAdmin from "../components/admin/BurgersAdmin.jsx";
import OrdersAdmin from "../components/admin/OrdersAdmin.jsx";
import MessagesAdmin from "../components/admin/MessagesAdmin.jsx";

const TABS = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "burgers", label: "Burgers", icon: UtensilsCrossed },
  { id: "messages", label: "Messages", icon: MailOpen },
];

/**
 * Admin dashboard — protected by username/password login.
 * Tabs: Analytics · Orders (status pipeline + customer WhatsApp updates)
 *       · Burgers (add/edit/delete + image upload) · Messages (contact form)
 */
export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(sessionStorage.getItem("bh_admin_token")));
  const [tab, setTab] = useState("analytics");

  const logout = () => {
    sessionStorage.removeItem("bh_admin_token");
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">Admin</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">Dashboard</h1>
        </div>
        <button onClick={logout} className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-smoke transition hover:border-flame hover:text-flame">
          <LogOut size={15} aria-hidden="true" /> Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-7 flex gap-2 overflow-x-auto rounded-2xl border border-line bg-card p-1.5" role="tablist" aria-label="Dashboard sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              tab === id
                ? "bg-gradient-to-r from-flame to-ember text-cream shadow-glow"
                : "text-smoke hover:text-cream"
            }`}
          >
            <Icon size={16} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === "analytics" && <AnalyticsPanel />}
        {tab === "orders" && <OrdersAdmin />}
        {tab === "burgers" && <BurgersAdmin />}
        {tab === "messages" && <MessagesAdmin />}
      </div>
    </section>
  );
}
