"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/common/Loader";

const ReviewSection = dynamic(
  () => import("./ReviewSection"),
  {
    loading: () => (
      <div className="py-20 text-center">
        <Loader />
      </div>
    ),
    ssr: false,
  },
);

export default function ReviewSectionWrapper({ productId }) {
  return <ReviewSection productId={productId} />;
}
