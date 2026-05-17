"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  rating,
  onChange,
  editable = false,
  size = "medium",
}) {
  const sizes = {
    small: "h-3 w-3",
    medium: "h-4 w-4",
    large: "h-6 w-6",
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1.5">
      {stars.map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={editable ? { scale: 1.2, rotate: 10 } : {}}
          whileTap={editable ? { scale: 0.9 } : {}}
          onClick={() => editable && onChange(star)}
          disabled={!editable}
          className={cn(
            "focus:outline-none transition-all duration-300",
            !editable && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= Math.round(rating)
                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                : "text-muted-foreground/20 fill-transparent"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}
