'use client';

import { useRef, useCallback } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { getImageUrl } from '@/utils/imageUtils';
import FilterBar from '@/components/common/FilterBar';
import { useTrackingStore } from '@/store/trackingStore';

export default function ProductFilter() {
  const { filters, setSearch, setSort, setCategory } = useProducts();
  const { categories } = useCategories();
  const trackSearch = useTrackingStore((state) => state.trackSearch);

  const sliderRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleMouseDown = (e) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX - sliderRef.current.offsetLeft;
    dragState.current.scrollLeft = sliderRef.current.scrollLeft;
    
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grabbing';
      sliderRef.current.style.transform = 'scale(0.99)';
    }
  };

  const handleMouseLeaveOrUp = () => {
    dragState.current.isDragging = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.transform = 'scale(1)';
    }
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDragging || !sliderRef.current) return;
    e.preventDefault(); 
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 2; 
    sliderRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  // 🚀 Decoupled Search Logic
  const handleSearchSubmit = useCallback((val) => {
    if (val && val.trim().length > 1) {
      trackSearch(val.trim(), filters.category !== 'all' ? filters.category : null); 
    }
  }, [trackSearch, filters.category]);

  const handleCategoryUpdate = useCallback((slug, name) => {
    setCategory(slug);
    if (slug !== 'all') {
      trackSearch(null, name); 
    }
  }, [setCategory, trackSearch]);

  return (
    <div className="mb-12">
      <FilterBar
        search={filters.search}
        onSearchChange={setSearch}          
        onSearchSubmit={handleSearchSubmit} 
        sort={filters.sort}
        onSortChange={setSort}
        sortOptions={[
          { value: "", label: "🌟 Default" },
          { value: "-createdAt", label: "✨ Newest" },
          { value: "price", label: "💵 Low Price" },
          { value: "-price", label: "💎 High Price" },
        ]}
      />

      {/* Premium Category Filter Buttons */}
      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="mt-8 flex overflow-x-auto w-full no-scrollbar gap-4 pb-4 px-1 snap-x snap-mandatory scroll-smooth touch-pan-x transition-transform cursor-grab"
      >
        {/* All Categories button */}
        <button
          onClick={() => handleCategoryUpdate('all', 'All Categories')}
          className={`flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group select-none pointer-events-auto ${
            filters.category === 'all'
              ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)]'
              : 'bg-white dark:bg-[#111] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors pointer-events-none ${
             filters.category === 'all' ? 'bg-zinc-800 dark:bg-zinc-100' : 'bg-zinc-100 dark:bg-[#0a0a0a] grayscale opacity-50 group-hover:opacity-100'
          }`}>
            ♾️
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest transition-colors pointer-events-none ${
            filters.category === 'all' ? 'text-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
          }`}>
            All Categories
          </span>
        </button>

        {/* Dynamic Category Buttons */}
        {categories?.map((cat) => {
          const isSelected = filters.category === cat.slug;
          return (
            <button
              key={cat._id}
              onClick={() => handleCategoryUpdate(cat.slug, cat.name)}
              className={`flex items-center gap-3 pr-6 pl-2 py-2 rounded-full border transition-all duration-300 shrink-0 snap-start group select-none pointer-events-auto ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)]'
                  : 'bg-white dark:bg-[#111] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 pointer-events-none">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className={`w-full h-full object-cover transition-all duration-500 pointer-events-none ${
                    isSelected ? 'grayscale-0 scale-110' : 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100'
                  }`}
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors pointer-events-none ${
                isSelected ? 'text-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}