"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/utils/swal";

export default function ProductShareButton({ productName, productDescription }) {
  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName || "Product",
          text: productDescription || "",
          url: url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        notify.success("Link copied to clipboard!");
      } catch (err) {
        console.error("Copy link failed:", err);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass hover:bg-accent-secondary hover:text-white transition-all"
      aria-label="Share product"
    >
      <Share2 size={18} />
    </Button>
  );
}
