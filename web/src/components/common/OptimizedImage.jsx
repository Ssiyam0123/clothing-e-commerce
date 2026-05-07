"use client";

import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/utils/imageUtils";

export default function OptimizedImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
  fetchPriority = "auto",
  width = 600,
  quality = 80,
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-elevated dark:bg-accent-primary flex flex-col items-center justify-center ${className}`}
        aria-hidden="true"
      >
        <span className="text-4xl grayscale opacity-20">👕</span>
      </div>
    );
  }

  // Pass width and quality to getImageUrl
  const optimizedSrc = getImageUrl(src, width, quality);

  return (
    <Image
      src={optimizedSrc}
      alt={alt || "Image"}
      fill
      priority={priority}
      fetchPriority={fetchPriority}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      className={`object-cover transition-opacity duration-500 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
