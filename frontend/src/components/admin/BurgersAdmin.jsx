import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Upload, X, RefreshCw, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.js";

const EMPTY = {
  name: "", description: "", ingredients: "", category: "Beef",
  price: "", oldPrice: "", rating: "4.5", image: "", availability: true, badges: [],
};
const CATEGORIES = ["Beef", "Chicken", "Premium", "Veggie"];
const BADGES = [
  { value: "bestseller", label: "★ Best seller" },
  { value: "new", label: "New" },
  { value: "discount", label: "Deal" },
];

/** Full burger CRUD — add, edit, delete, upload your own pictures */
export default function BurgersAdmin() {
  const [burgers, setBurgers] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = () => {
    api.get("/burgers")
      .then((res) => setBurgers(res.data))
      .catch(() => { setBurgers([]); toast.error("Could not load the menu — please check the backend server"); });
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleBadge = (b) =>
    setForm((f) => ({ ...f, badges: f.badges.includes(b) ? f.badges.filter((x) => x !== b) : [...f.badges, b] }));

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (b) => {
    setForm({
      name: b.name, description: b.description || "",
      ingredients: (b.ingredients || []).join(", "),
      category: b.category || "Beef",
      price: String(b.price), oldPrice: b.oldPrice ? String(b.oldPrice) : "",
      rating: String(b.rating), image: b.image || "",
      availability: b.availability !== false, badges: b.badges || [],
    });
    setEditingId(b.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Upload the selected picture to Supabase Storage via the backend */
  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, image: data.url }));
      toast.success("Image uploaded successfully ✅");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Upload failed — please check the Supabase storage bucket");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Please enter the burger name");
    if (!form.price || Number(form.price) <= 0) return toast.error("Please enter a valid price");
    if (!form.image) return toast.error("Please upload an image or paste an image URL");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      rating: Number(form.rating) || 4.5,
      image: form.image,
      availability: form.availability,
      badges: form.badges,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/burgers/${editingId}`, payload);
        toast.success("Burger updated successfully ✅");
      } else {
        await api.post("/burgers", payload);
        toast.success("New burger added to the menu 🍔");
      }
      setShowForm(false);
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/burgers/${b.id}`);
      toast.success("Burger deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Delete failed");
    }
  };

  const toggleAvailability = async (b) => {
    try {
      await api.patch(`/burgers/${b.id}`, { availability: !b.availability });
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-coal px-4 py-2.5 text-sm placeholder:text-smoke/50 focus:border-ember focus:outline-none";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-smoke";

  if (!burgers) {
    return <div className="grid h-60 place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-ember" /></div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Menu burgers <span className="text-sm font-normal text-smoke">({burgers.length})</span></h2>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-smoke transition hover:border-ember hover:text-cream">
            <RefreshCw size={13} aria-hidden="true" /> Refresh
          </button>
          <button onClick={showForm ? () => setShowForm(false) : openAdd} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-flame to-ember px-5 py-2 text-xs font-bold shadow-glow transition hover:brightness-110">
            {showForm ? <><X size={14} /> Close form</> : <><Plus size={14} /> Add new burger</>}
          </button>
        </div>
      </div>

      {/* ============ ADD / EDIT FORM ============ */}
      {showForm && (
        <div className="mt-5 rounded-3xl border border-ember/40 bg-card p-6">
          <h3 className="font-bold">{editingId ? "✏️ Edit burger" : "🍔 Add new burger"}</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="b-name" className={labelCls}>Burger name *</label>
              <input id="b-name" value={form.name} onChange={set("name")} placeholder="e.g. Mega Cheese Blast" className={inputCls} />
            </div>
            <div>
              <label htmlFor="b-cat" className={labelCls}>Category</label>
              <select id="b-cat" value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="b-desc" className={labelCls}>Short description</label>
              <input id="b-desc" value={form.description} onChange={set("description")} placeholder="A short one-line description" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="b-ing" className={labelCls}>Ingredients (separate with commas)</label>
              <input id="b-ing" value={form.ingredients} onChange={set("ingredients")} placeholder="Beef patty, Cheddar, Lettuce, Brioche bun" className={inputCls} />
            </div>
            <div>
              <label htmlFor="b-price" className={labelCls}>Price (PKR) *</label>
              <input id="b-price" type="number" min="1" value={form.price} onChange={set("price")} placeholder="750" className={inputCls} />
            </div>
            <div>
              <label htmlFor="b-old" className={labelCls}>Old price (optional — shows a discount)</label>
              <input id="b-old" type="number" min="0" value={form.oldPrice} onChange={set("oldPrice")} placeholder="900" className={inputCls} />
            </div>
            <div>
              <label htmlFor="b-rating" className={labelCls}>Rating (0–5)</label>
              <input id="b-rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set("rating")} className={inputCls} />
            </div>
            <div>
              <span className={labelCls}>Badges</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {BADGES.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => toggleBadge(b.value)}
                    aria-pressed={form.badges.includes(b.value)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      form.badges.includes(b.value)
                        ? "bg-gradient-to-r from-flame to-ember text-cream"
                        : "border border-line text-smoke hover:border-ember"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ---- Picture upload ---- */}
            <div className="sm:col-span-2">
              <span className={labelCls}>Burger picture *</span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-coal">
                  {form.image
                    ? <img src={form.image} alt="Burger preview" className="h-full w-full object-cover" />
                    : <ImageIcon size={26} className="text-smoke" aria-hidden="true" />}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => uploadImage(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-smoke transition hover:border-ember hover:text-cream disabled:opacity-50"
                  >
                    <Upload size={15} aria-hidden="true" /> {uploading ? "Uploading…" : "Upload your own image"}
                  </button>
                  <input
                    value={form.image}
                    onChange={set("image")}
                    placeholder="…or paste an image URL"
                    className={inputCls}
                    aria-label="Image URL"
                  />
                  <p className="text-[11px] text-smoke">JPG / PNG / WEBP — max 5 MB. Uploads are saved to Supabase Storage.</p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                id="b-avail"
                type="checkbox"
                checked={form.availability}
                onChange={(e) => setForm((f) => ({ ...f, availability: e.target.checked }))}
                className="h-4 w-4 accent-[#f97316]"
              />
              <label htmlFor="b-avail" className="text-sm">Available (customers can order this)</label>
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving || uploading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame to-ember py-3 font-bold shadow-glow transition hover:brightness-110 disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {saving ? "Saving…" : editingId ? "Update burger" : "Add burger to menu"}
          </button>
        </div>
      )}

      {/* ============ BURGER LIST ============ */}
      <ul className="mt-6 space-y-3">
        {burgers.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-3">
            <img src={b.image} alt={b.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{b.name} <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[10px] text-smoke">{b.category}</span></p>
              <p className="text-sm text-mustard">PKR {b.price} <span className="ml-2 text-xs text-smoke">★ {b.rating}</span></p>
            </div>
            <button
              onClick={() => toggleAvailability(b)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                b.availability ? "bg-[#25D366]/15 text-[#25D366]" : "bg-flame/15 text-flame"
              }`}
            >
              {b.availability ? "Available" : "Sold out"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => openEdit(b)} aria-label={`Edit ${b.name}`} className="grid h-9 w-9 place-items-center rounded-xl border border-line text-smoke transition hover:border-mustard hover:text-mustard">
                <Pencil size={15} />
              </button>
              <button onClick={() => remove(b)} aria-label={`Delete ${b.name}`} className="grid h-9 w-9 place-items-center rounded-xl border border-line text-smoke transition hover:border-flame hover:text-flame">
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
