'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// --- Framer Motion Variants for Premium Experience ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 15 } 
  },
  hover: {
    y: -15,
    boxShadow: "0px 30px 60px rgba(0,0,0,0.4)",
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

const imageVariants = {
  hidden: { scale: 1, filter: 'grayscale(100%)' },
  visible: { scale: 1, filter: 'grayscale(80%)' },
  hover: { 
    scale: 1.12, 
    filter: 'grayscale(0%)', 
    transition: { duration: 0.8, ease: 'easeOut' } 
  }
};

const textSlideVariants = {
  hidden: { y: 0, opacity: 0.8 },
  visible: { y: 0, opacity: 0.8 },
  hover: { 
    y: -10, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 } 
  }
};

const lineSlideVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { width: 0, opacity: 0 },
  hover: { 
    width: 80, 
    opacity: 1, 
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

export default function CategoryGrid({ categories, ui }) {
  // 🖱️ Desktop Drag-to-Scroll Logic
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(false); // Reset at start
    const slider = sliderRef.current;
    const startXPos = e.pageX - slider.offsetLeft;
    setStartX(startXPos);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!startX) return;
    const slider = sliderRef.current;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Sensitivity
    
    // যদি মাউস ৫ পিক্সেলের বেশি মুভ করে, তবেই এটাকে 'ড্র্যাগ' হিসেবে ধরবো
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
      slider.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setStartX(0);
    // ড্র্যাগিং স্টেটটা খুব অল্প সময় ধরে রাখা হয় যাতে ড্র্যাগ শেষে ভুল করে ক্লিক না পড়ে যায়
    setTimeout(() => setIsDragging(false), 50);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-[#050505] overflow-hidden transition-colors duration-700">
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic"
          >
            {ui.catTitle}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            className="h-1.5 bg-indigo-600 rounded-full"
          />
          <p className="text-gray-500 dark:text-gray-400 tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold pt-2">
            {ui.catSub}
          </p>
        </div>
      </div>

      {/* 🚀 Horizontal Scroll Container with Drag & Snap */}
      <motion.div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className={`flex overflow-x-auto gap-6 px-6 md:px-[8%] no-scrollbar pb-12 snap-x snap-mandatory scroll-smooth touch-pan-x transition-all ${
          startX !== 0 ? 'cursor-grabbing scale-[0.99]' : 'cursor-grab'
        }`}
      >
        {categories.map((cat) => (
          <motion.div 
            key={cat._id} 
            variants={cardVariants}
            whileHover="hover"
            className="min-w-[300px] md:min-w-[400px] aspect-[3/4] relative rounded-[2rem] overflow-hidden snap-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none"
          >
            {/* 🔗 Navigation to: /products?category=slug */}
            <Link 
              href={`/products?category=${cat.slug || cat._id}`} 
              onClick={(e) => isDragging && e.preventDefault()} 
              className="block w-full h-full"
            >
              
              {/* Category Image */}
              <motion.div variants={imageVariants} className="absolute inset-0">
                <Image
                  src={cat.image || '/placeholder-cat.jpg'}
                  alt={cat.name}
                  fill
                  priority
                  draggable={false} 
                  className="object-cover"
                />
              </motion.div>
              
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

              {/* Text Content Layer */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                <motion.span variants={textSlideVariants} className="text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                  Explore
                </motion.span>
                <motion.h3 variants={textSlideVariants} className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                  {cat.name}
                </motion.h3>
                {/* Animated Hover Line */}
                <motion.div variants={lineSlideVariants} className="h-1 bg-white mt-4 rounded-full" />
              </div>

              {/* Aesthetic Inner Border on Hover */}
              <motion.div 
                 variants={{ hidden: { opacity: 0 }, visible: { opacity: 0 }, hover: { opacity: 1 } }}
                 className="absolute inset-4 border border-white/10 rounded-[1.5rem] pointer-events-none" 
              />
            </Link>
          </motion.div>
        ))}
        
        {/* End of scroll spacer */}
        <div className="min-w-[20px] md:min-w-[100px] shrink-0" />
      </motion.div>
    </section>
  );
}