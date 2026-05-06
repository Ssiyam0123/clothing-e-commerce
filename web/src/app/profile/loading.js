import { AddressFormSkeleton } from '@/components/common/Skeletons';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-8 mb-16">
          <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>
        <AddressFormSkeleton />
      </div>
    </div>
  );
}
