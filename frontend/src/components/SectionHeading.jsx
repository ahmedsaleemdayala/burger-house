/** Consistent section header: small eyebrow + big display title */
export default function SectionHeading({ eyebrow, title, center = true }) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">{eyebrow}</p>
      <h2 className="display mt-3 text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}
