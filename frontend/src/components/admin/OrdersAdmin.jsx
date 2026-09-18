import { useEffect, useState } from "react";
import { RefreshCw, Phone, MapPin, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.js";
import { STATUS_FLOW, STATUS_META, nextStatus } from "../../lib/status.js";

/**
 * Orders panel — every order with a simple status pipeline:
 * Received → Preparing → Out for delivery → Delivered
 */
export default function OrdersAdmin() {
  const [orders, setOrders] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    api.get("/orders?limit=100")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        setOrders([]);
        toast.error(err?.response?.data?.error || "Could not load orders — please check the backend server");
      });
  };
  useEffect(load, []);

  const setStatus = async (order, status) => {
    setBusy(order.id);
    try {
      await api.patch(`/orders/${order.id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      toast.success(`Order #${order.id} → ${STATUS_META[status].label}`);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Status update failed");
    } finally {
      setBusy(null);
    }
  };

  if (!orders) {
    return <div className="grid h-60 place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-ember" /></div>;
  }

  const active = orders.filter((o) => (o.status || "received") !== "delivered");
  const done = orders.filter((o) => (o.status || "received") === "delivered");

  const OrderCard = ({ o }) => {
    const status = o.status || "received";
    const next = nextStatus(status);
    const meta = STATUS_META[status] || STATUS_META.received;
    const progressIndex = Math.max(STATUS_FLOW.indexOf(status), 0);

    return (
      <li className="rounded-2xl border border-line bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold">
              #{o.id} — {o.customer_name || "Guest"}
              <span className="ml-3 rounded-full bg-mustard/15 px-2.5 py-0.5 text-xs font-bold text-mustard">
                PKR {o.total ?? "—"}
              </span>
              <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.color}`}>
                {meta.emoji} {meta.label}
              </span>
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-smoke">
              {o.phone && <span className="flex items-center gap-1"><Phone size={11} /> {o.phone}</span>}
              {o.address && <span className="flex items-center gap-1"><MapPin size={11} /> {o.address}</span>}
            </p>
          </div>
          <p className="text-xs text-smoke">
            {new Date(o.order_date).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>

        {/* Items */}
        <div className="mt-3 flex flex-wrap gap-2">
          {(Array.isArray(o.items) && o.items.length ? o.items : [{ name: o.burger_name, qty: o.quantity }]).map((it, i) => (
            <span key={i} className="rounded-full bg-coal px-3 py-1.5 text-xs">
              🍔 {it.name} × {it.qty}{it.amount ? ` — PKR ${it.amount}` : ""}
            </span>
          ))}
        </div>

        {o.instructions && (
          <p className="mt-3 rounded-xl bg-coal px-3 py-2 text-xs text-smoke">📝 {o.instructions}</p>
        )}

        {/* Status pipeline */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-1" aria-label={`Order progress: ${meta.label}`}>
            {STATUS_FLOW.map((s, i) => (
              <span
                key={s}
                title={STATUS_META[s].label}
                className={`h-2.5 rounded-full transition-all ${
                  i <= progressIndex ? "w-7 bg-gradient-to-r from-flame to-ember" : "w-2.5 bg-line"
                }`}
              />
            ))}
          </div>

          {next && (
            <button
              onClick={() => setStatus(o, next)}
              disabled={busy === o.id}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-gradient-to-r from-flame to-ember px-5 py-2 text-xs font-bold shadow-glow transition hover:brightness-110 disabled:opacity-50"
            >
              {busy === o.id ? "Updating…" : <>Mark as {STATUS_META[next].label} <ChevronRight size={13} /></>}
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Active orders <span className="text-sm font-normal text-smoke">({active.length})</span>
        </h2>
        <button onClick={load} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-smoke transition hover:border-ember hover:text-cream">
          <RefreshCw size={13} aria-hidden="true" /> Refresh
        </button>
      </div>

      {active.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-card p-8 text-center text-sm text-smoke">
          No active orders right now. New orders will appear here instantly.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">{active.map((o) => <OrderCard key={o.id} o={o} />)}</ul>
      )}

      {done.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-bold">
            Delivered <span className="text-sm font-normal text-smoke">({done.length})</span>
          </h2>
          <ul className="mt-5 space-y-3 opacity-70">{done.map((o) => <OrderCard key={o.id} o={o} />)}</ul>
        </>
      )}
    </div>
  );
}
