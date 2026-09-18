import { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import {
  ShoppingBag, CalendarDays, CalendarRange, Calendar, MessageCircle,
  Users, Percent, Trophy, TrendingDown, RefreshCw,
} from "lucide-react";
import api from "../../lib/api.js";

const COLORS = ["#f43f2e", "#f97316", "#facc15", "#fb923c", "#fda4af", "#a1a1aa", "#ef4444", "#eab308"];
const tooltipStyle = { background: "#1a1a1f", border: "1px solid #2a2a31", borderRadius: 12, color: "#faf7f2" };

/* Demo data — only shown when the backend is unreachable */
const DEMO = {
  totalOrders: 1284, ordersToday: 42, ordersThisWeek: 297, ordersThisMonth: 1043,
  whatsappClicks: 1811, visitors: 5420, conversionRate: 23.7,
  mostOrdered: "Inferno Smash", leastOrdered: "Garden Crunch Veggie",
  byBurger: [
    { name: "Inferno Smash", value: 342 }, { name: "Crispy Zinger Stack", value: 288 },
    { name: "Double Trouble Tower", value: 214 }, { name: "Classic House Beef", value: 176 },
    { name: "Peri Peri Fire", value: 121 }, { name: "Smoky BBQ Ranch", value: 82 },
  ],
  daily: [
    { day: "Mon", orders: 31 }, { day: "Tue", orders: 38 }, { day: "Wed", orders: 35 },
    { day: "Thu", orders: 49 }, { day: "Fri", orders: 71 }, { day: "Sat", orders: 84 }, { day: "Sun", orders: 62 },
  ],
  monthly: [
    { month: "Feb", orders: 610 }, { month: "Mar", orders: 720 }, { month: "Apr", orders: 690 },
    { month: "May", orders: 840 }, { month: "Jun", orders: 960 }, { month: "Jul", orders: 1043 },
  ],
  devices: [{ name: "Mobile", value: 71 }, { name: "Desktop", value: 24 }, { name: "Tablet", value: 5 }],
  topPages: [
    { page: "/menu", visits: 2810 }, { page: "/", visits: 1930 },
    { page: "/about", visits: 410 }, { page: "/contact", visits: 270 },
  ],
};

function StatCard({ icon: Icon, label, value, accent = "text-ember" }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-smoke">{label}</p>
        <Icon size={18} className={accent} aria-hidden="true" />
      </div>
      <p className="display mt-3 truncate text-3xl">{value}</p>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [data, setData] = useState(null);
  const [live, setLive] = useState(false);

  const load = () => {
    api.get("/analytics/summary")
      .then((res) => { setData(res.data); setLive(true); })
      .catch(() => { setData(DEMO); setLive(false); });
  };
  useEffect(load, []);

  if (!data) {
    return <div className="grid h-60 place-items-center" role="status"><div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-ember" /></div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm ${live ? "text-[#25D366]" : "text-mustard"}`}>
          {live ? "● Live data from Supabase" : "● Backend offline — demo data shown"}
        </p>
        <button onClick={load} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-smoke transition hover:border-ember hover:text-cream">
          <RefreshCw size={13} aria-hidden="true" /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total orders" value={data.totalOrders} />
        <StatCard icon={CalendarDays} label="Orders today" value={data.ordersToday} accent="text-mustard" />
        <StatCard icon={CalendarRange} label="Orders this week" value={data.ordersThisWeek} />
        <StatCard icon={Calendar} label="Orders this month" value={data.ordersThisMonth} accent="text-mustard" />
        <StatCard icon={MessageCircle} label="WhatsApp clicks" value={data.whatsappClicks} accent="text-[#25D366]" />
        <StatCard icon={Users} label="Visitors" value={data.visitors} />
        <StatCard icon={Percent} label="Conversion rate" value={`${data.conversionRate}%`} accent="text-mustard" />
        <StatCard icon={Trophy} label="Most ordered" value={data.mostOrdered} accent="text-mustard" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard icon={Trophy} label="Best seller" value={data.mostOrdered} accent="text-mustard" />
        <StatCard icon={TrendingDown} label="Least ordered" value={data.leastOrdered} accent="text-flame" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-6">
          <h2 className="font-bold">Monthly order trend</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={data.monthly}>
                <CartesianGrid stroke="#2a2a31" strokeDasharray="4 4" />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{ fill: "#facc15", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-card p-6">
          <h2 className="font-bold">Orders by burger</h2>
          <div className="mt-4 h-72">
            {data.byBurger.length === 0 ? (
              <p className="grid h-full place-items-center text-sm text-smoke">No orders yet</p>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.byBurger} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                    {data.byBurger.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#141417" />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-card p-6">
          <h2 className="font-bold">Daily orders (this week)</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={data.daily}>
                <CartesianGrid stroke="#2a2a31" strokeDasharray="4 4" />
                <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(249,115,22,0.08)" }} />
                <Bar dataKey="orders" fill="#f43f2e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-card p-6">
          <h2 className="font-bold">Customer device</h2>
          <div className="mt-4 h-72">
            {data.devices.length === 0 ? (
              <p className="grid h-full place-items-center text-sm text-smoke">No visits recorded yet</p>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.devices} dataKey="value" nameKey="name" outerRadius={95}>
                    {data.devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#141417" />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Top landing pages */}
      <div className="mt-6 rounded-3xl border border-line bg-card p-6">
        <h2 className="font-bold">Top landing pages</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-smoke">
              <th className="py-2 pr-4">Page</th>
              <th className="py-2">Visits</th>
            </tr>
          </thead>
          <tbody>
            {data.topPages.map((p) => (
              <tr key={p.page} className="border-b border-line/50 last:border-0">
                <td className="py-3 pr-4 font-medium">{p.page}</td>
                <td className="py-3 text-mustard">{p.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
