import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import BurgerCard from "../components/BurgerCard.jsx";
import SkeletonCard from "../components/Skeleton.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Reveal from "../components/Reveal.jsx";
import useBurgers from "../lib/useBurgers.js";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function Menu() {
  // Menu comes 100% from the database
  const { burgers, loading, error } = useBurgers();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  // Categories are derived from whatever exists in the database
  const categories = useMemo(() => {
    const set = new Set((burgers || []).map((b) => b.category).filter(Boolean));
    return ["All", ...set];
  }, [burgers]);

  const visible = useMemo(() => {
    if (!burgers) return [];
    let list = burgers.filter(
      (b) =>
        (category === "All" || b.category === category) &&
        (b.name.toLowerCase().includes(query.toLowerCase()) ||
          (b.description || "").toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [burgers, query, category, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal><SectionHeading eyebrow="The full lineup" title="Our menu" /></Reveal>

      {/* Controls: search / category filter / sort */}
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke" aria-hidden="true" />
          <label htmlFor="menu-search" className="sr-only">Search burgers</label>
          <input
            id="menu-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search burgers…"
            className="w-full rounded-full border border-line bg-card py-2.5 pl-11 pr-4 text-sm placeholder:text-smoke/60 focus:border-ember focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === c
                  ? "bg-gradient-to-r from-flame to-ember text-cream shadow-glow"
                  : "border border-line text-smoke hover:border-ember hover:text-cream"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="menu-sort" className="sr-only">Sort burgers</label>
          <select
            id="menu-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-line bg-card px-4 py-2.5 text-sm focus:border-ember focus:outline-none"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : visible.map((b) => <BurgerCard key={b.id} burger={b} />)}
      </div>

      {!loading && error && (
        <p className="mt-16 rounded-3xl border border-line bg-card p-8 text-center text-sm text-smoke">
          Menu could not be loaded — please make sure the backend server is running.
        </p>
      )}
      {!loading && !error && visible.length === 0 && (
        <p className="mt-16 text-center text-smoke">
          {burgers.length === 0
            ? "No burgers on the menu yet — add some from the admin dashboard."
            : `No burgers match "${query}". Try another search or pick a different category.`}
        </p>
      )}
    </section>
  );
}
