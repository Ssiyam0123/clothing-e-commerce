'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { getImageUrl } from '@/utils/imageUtils';
import { useDebounce } from '@/hooks/useDebounce';

export default function FilterBar({
  search,
  onSearchSubmit,
  onSearchChange,
  sort,
  onSortChange,
  sortOptions,
  searchPlaceholder = "Search artifacts...",
  sortLabel = "Sort By:",
  liveSearch = true,
  debounceMs = 300
}) {
  const [inputValue, setInputValue] = useState(search || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const debouncedInput = useDebounce(inputValue, debounceMs);
  const onSearchChangeRef = useRef(onSearchChange);
  

  const currentSearchRef = useRef(search || '');

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    currentSearchRef.current = search || '';
    if (!isFocused && search !== undefined && search !== inputValue) {
      setInputValue(search || '');
    }
  }, [search, isFocused, inputValue]);

  useEffect(() => {
    if (liveSearch && onSearchChangeRef.current) {
      if (debouncedInput !== currentSearchRef.current) {
        onSearchChangeRef.current(debouncedInput);
      }
    }
  }, [debouncedInput, liveSearch]); 

  useEffect(() => {
    if (inputValue.trim().length > 1 && isFocused) {
      const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          const { data } = await api.get(`/products?search=${inputValue}&limit=5`);
          setSuggestions(data.products || []);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      };
      const delayDebounceFn = setTimeout(() => fetchSuggestions(), 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, isFocused]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsFocused(false);
      if (onSearchSubmit) onSearchSubmit(inputValue);
    }
  };

  const handleClearSearch = (e) => {
    e.preventDefault(); 
    setInputValue('');
    if (onSearchChange) onSearchChange(''); 
  };

  return (
    <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] border border-zinc-100 dark:border-zinc-800/80 p-2 flex flex-col md:flex-row gap-4 items-center justify-between relative z-50 transition-all w-full">
      
      {/* Search Input */}
      <div className="w-full md:w-1/2 relative group" ref={wrapperRef}>
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg text-zinc-400 transition-transform group-focus-within:scale-110 group-focus-within:text-zinc-900 dark:group-focus-within:text-white z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-14 pr-12 py-4 bg-zinc-50 dark:bg-[#0a0a0a] border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 rounded-full outline-none font-black text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400 text-xs uppercase tracking-widest relative z-10 hover:bg-zinc-100 dark:hover:bg-[#151515]"
        />
        
        {inputValue && (
          <button type="button" onClick={handleClearSearch} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-rose-500 transition-colors z-20">
            ✕
          </button>
        )}

        {/* Suggestions Dropdown */}
        {isFocused && inputValue.trim().length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
            {loadingSuggestions ? (
              <div className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 animate-pulse">
                Scanning Databanks...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="flex flex-col">
                {suggestions.map((prod) => (
                  <Link 
                    key={prod._id} 
                    // FIXED: Use slug instead of _id
                    href={`/products/${prod.slug}`}
                    onClick={() => setIsFocused(false)}
                    className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-[#111] transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                  >
                    <div className="h-12 w-10 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <img src={getImageUrl(prod.images?.[0])} alt={prod.name} className="h-full w-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-1">{prod.name}</p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">৳{prod.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
                <button 
                  type="button"
                  onClick={() => { setIsFocused(false); if (onSearchSubmit) onSearchSubmit(inputValue); }}
                  className="w-full p-4 bg-zinc-50 dark:bg-[#111] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] transition-colors"
                >
                  See all results for "{inputValue}" →
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                No matching artifacts found
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Sort Dropdown */}
      <div className="w-full md:w-auto flex items-center pr-2 group">
        {sortLabel && (
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] hidden sm:block mr-4 shrink-0 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-300">
            {sortLabel}
          </span>
        )}
        <div className="relative w-full md:w-auto">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full md:w-auto pl-6 pr-12 py-4 bg-zinc-50 dark:bg-[#0a0a0a] hover:bg-zinc-100 dark:hover:bg-[#151515] border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 rounded-full outline-none font-black text-zinc-900 dark:text-zinc-100 transition-all cursor-pointer appearance-none text-[10px] uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="font-bold text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 font-bold transition-transform duration-300 group-hover:translate-y-[-30%]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
          </span>
        </div>
      </div>
    </div>
  );
}