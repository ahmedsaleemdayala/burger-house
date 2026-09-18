const styles = {
  bestseller: "bg-mustard text-coal",
  new: "bg-ember text-coal",
  discount: "bg-flame text-cream",
};
const labels = { bestseller: "★ Best seller", new: "New", discount: "Deal" };

export default function Badge({ type }) {
  if (!styles[type]) return null;
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}
