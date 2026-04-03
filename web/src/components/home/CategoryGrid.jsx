'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/free-mode';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const imageVariants = {
  hover: { 
    scale: 1.1, 
    filter: 'grayscale(0%)', 
    transition: { duration: 0.6, ease: 'easeOut' } 
  }
};

export default function CategoryGrid({ categories, ui }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#050505] overflow-hidden transition-colors duration-700">
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-10 md:mb-16">
        <div className="flex flex-col items-center text-center space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic"
          >
            {ui.catTitle}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '60px' }}
            viewport={{ once: true }}
            className="h-1 bg-indigo-600 rounded-full"
          />
          <p className="text-gray-500 dark:text-gray-400 tracking-[0.3em] uppercase text-[9px] md:text-xs font-bold pt-1">
            {ui.catSub}
          </p>
        </div>
      </div>

      {/* 🚀 Swiper Slider Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="px-4 md:px-[6%]"
      >
        <Swiper
          slidesPerView={2.2} // মোবাইলে ২টার বেশি কার্ড দেখা যাবে
          spaceBetween={12}   // ছোট গ্যাপ
          freeMode={true}
          modules={[FreeMode]}
          breakpoints={{
            // ডেক্সটপ ভিউ
            1024: {
              slidesPerView: 4.2,
              spaceBetween: 24,
            },
            // ট্যাবলেট ভিউ
            768: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            }
          }}
          className="category-swiper !overflow-visible"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <motion.div 
                whileHover="hover"
                className="relative aspect-[3/4] w-full rounded-[1.25rem] md:rounded-[2rem] overflow-hidden shadow-lg select-none group"
              >
                <Link href={`/products?category=${cat.slug || cat._id}`} className="block w-full h-full">
                  {/* Image */}
                  <motion.div variants={imageVariants} className="absolute inset-0">
                    <Image
                      src={cat.image || '/placeholder-cat.jpg'}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover grayscale-[80%]"
                    />
                  </motion.div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

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
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}