'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { getImageUrl } from '@/utils/imageUtils';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 🚀 FIX: slides = [] ডিফল্ট হিসেবে সেট করা হয়েছে যাতে undefined এরর না আসে
export default function HeroSection({ slides = [], ui = {}, lang = 'en' }) {
  const isBn = lang === 'bn';

  // 🛡️ Guard Clause: যদি স্লাইডস এখনও না আসে (Loading state)
  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[75vh] min-h-[500px] md:h-[85vh] md:min-h-[700px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        {/* Ambient Skeleton Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-black animate-pulse" />
        <div className="relative z-10 text-center">
          <h2 className="text-zinc-800 font-black text-5xl md:text-8xl tracking-tighter italic opacity-20">
            VANGUARD
          </h2>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-800 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-zinc-800 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-zinc-800 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[75vh] min-h-[500px] md:h-[85vh] md:min-h-[700px] overflow-hidden bg-[#0a0a0a]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={slides.length > 1} // 🚀 শুধু ১টার বেশি স্লাইড থাকলে লুপ হবে
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id || Math.random()}>
            <div className="relative h-full w-full group">
              <img
                src={getImageUrl(slide.image)}
                className="w-full h-full object-cover object-center transform transition-transform duration-[15s] ease-out group-hover:scale-105"
                alt={slide.title || "Campaign Banner"}
                loading="eager"
              />
              {/* Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent h-full"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:px-24 pb-20 md:pb-28 z-10">
                <div className="max-w-4xl">
                  {slide.title && (
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm md:text-xl text-zinc-300 font-medium tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.link && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                      <Link
                        href={slide.link}
                        className={`inline-flex items-center justify-center bg-white text-black px-10 py-4 md:px-12 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 hover:scale-105 transition-all active:scale-95 shadow-xl ${isBn ? 'font-sans font-bold' : ''}`}
                      >
                        {ui.heroBtn || 'Explore Collection'}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        @keyframes slide-in-from-bottom-8 {
          from { transform: translateY(2rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in { animation-fill-mode: forwards; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .fade-in { animation-name: fade-in; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        
        :global(.swiper-pagination-bullet) { 
          background-color: #ffffff !important; 
          opacity: 0.3; 
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        :global(.swiper-pagination-bullet-active) { 
          opacity: 1; 
          width: 30px; 
          border-radius: 6px; 
        }
      `}</style>
    </section>
  );
}