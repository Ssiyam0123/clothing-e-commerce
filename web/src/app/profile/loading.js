import { ProfileSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-10 pt-12 md:pt-32 pb-32">
      <ProfileSkeleton />
    </div>
  );
}
