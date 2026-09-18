import { Star } from "lucide-react";

export default function StarRating({ rating, showValue = true }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          aria-hidden="true"
          className={i <= Math.round(rating) ? "fill-mustard text-mustard" : "text-line"}
        />
      ))}
      {showValue && <span className="ml-1 text-xs font-medium text-smoke">{rating.toFixed(1)}</span>}
    </span>
  );
}
