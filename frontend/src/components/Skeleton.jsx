/** Loading skeleton for burger cards */
export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card" aria-hidden="true">
      <div className="skeleton h-52 w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-2/3 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-1/2 rounded-full" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
