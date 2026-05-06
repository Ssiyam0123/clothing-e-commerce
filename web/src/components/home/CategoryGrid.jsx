'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { getImageUrl } from '@/utils/imageUtils';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/free-mode';

export default function CategoryGrid({ categories, ui }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section
      className="bg-white dark:bg-[#050505] overflow-hidden transition-colors duration-700"
      aria-label="Product categories"
    >
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-10 md:mb-16">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
            {ui.catTitle}
          </h2>
          <div className="h-1 w-16 bg-indigo-600 rounded-full transition-all duration-700 group-hover:w-24" />
          <p className="text-gray-500 dark:text-gray-400 tracking-[0.3em] uppercase text-[9px] md:text-xs font-bold pt-1">
            {ui.catSub}
          </p>
        </div>
      </div>

      {/* Swiper Slider Container */}
      <div className="px-4 md:px-[6%]">
        <Swiper
          slidesPerView={2.2}
          spaceBetween={12}
          freeMode={true}
          modules={[FreeMode]}
          breakpoints={{
            768: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4.2,
              spaceBetween: 24,
            },
          }}
          className="category-swiper !overflow-visible"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <div className="relative aspect-[3/4] w-full rounded-[1.25rem] md:rounded-[2rem] overflow-hidden shadow-lg select-none group">
                <Link
                  href={`/products?category=${cat.slug || cat._id}`}
                  className="block w-full h-full"
                  aria-label={`Browse ${cat.name} category`}
                >
                  {/* Image with CSS hover scale */}
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                    <Image
                      src={getImageUrl(cat.image || '/placeholder-cat.jpg', 600, 80)}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover grayscale-[80%] transition-all duration-700 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 z-10">
                    <span className="text-indigo-400 text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                      Explore
                    </span>
                    <h3 className="text-sm md:text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                      {cat.name}
                    </h3>

                    {/* Active line on hover (Desktop only) */}
                    <div className="hidden md:block h-1 w-0 group-hover:w-16 bg-white mt-3 transition-all duration-300 rounded-full" />
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}