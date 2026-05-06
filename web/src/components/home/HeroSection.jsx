'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, A11y } from 'swiper/modules';
import { getImageUrl } from '@/utils/imageUtils';

// Import Swiper styles (they are loaded statically, but we'll add a preload hint)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection({ slides = [], ui = {}, lang = 'en' }) {
  const isBn = lang === 'bn';

  if (!slides || slides.length === 0) {
    return (
      <section
        className="relative h-[75vh] min-h-[500px] md:h-[85vh] md:min-h-[700px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
        aria-label="Loading hero section"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-black animate-pulse" />
        <div className="relative z-10 text-center">
          <h2 className="text-zinc-800 font-black text-5xl md:text-8xl tracking-tighter italic opacity-20">
            VANGUARD
          </h2>
          <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
            <div className="w-2 h-2 rounded-full bg-zinc-800 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-zinc-800 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-zinc-800 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[75vh] min-h-[500px] md:h-[85vh] md:min-h-[700px] overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero carousel"
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, A11y]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={slides.length > 1}
        className="h-full w-full"
        a11y={{
          enabled: true,
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}',
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide._id || idx}>
            <div className="relative h-full w-full group">
              <Image
                src={getImageUrl(slide.image, 1920, 85)}
                alt={slide.title || 'Campaign banner'}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center transition-transform duration-[15s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent h-full" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:px-24 pb-20 md:pb-28 z-10">
                <div className="max-w-4xl">
                  {slide.title && (
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm md:text-xl text-zinc-200 font-medium tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.link && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                      <Link
                        href={slide.link}
                        className={`inline-flex items-center justify-center bg-white text-black px-10 py-4 md:px-12 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 hover:scale-105 transition-all active:scale-95 shadow-xl ${
                          isBn ? 'font-sans font-bold' : ''
                        }`}
                        aria-label={ui.heroBtn || 'Explore Collection'}
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


    </section>
  );
}