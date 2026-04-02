// src/app/page.js
import HomeClient from '@/components/home/HomeClient';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505]">
      {/* কোনো Suspense লাগবে না, আমরা কম্পোনেন্টের ভেতরেই অটো-স্কেলিটন লজিক দিয়েছি */}
      <HomeClient />
    </main>
  );
}