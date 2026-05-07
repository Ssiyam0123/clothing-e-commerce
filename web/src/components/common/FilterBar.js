"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  debounceMs = 300,
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(search || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const debouncedInput = useDebounce(inputValue, debounceMs);
  const onSearchChangeRef = useRef(onSearchChange);
  const currentSearchRef = useRef(search || "");

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    currentSearchRef.current = search || "";
    if (search !== undefined && search !== inputValue) {
      setInputValue(search || "");
    }
  }, [search]);

  useEffect(() => {
    if (liveSearch && onSearchChangeRef.current) {
      if (debouncedInput !== currentSearchRef.current) {
        onSearchChangeRef.current(debouncedInput);
      }
    }
  }, [debouncedInput, liveSearch]);

  useEffect(() => {
    if (inputValue.trim().length > 1 && open) {
      const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          const { data } = await api.get(
            `/products?search=${inputValue}&limit=5`,
          );
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
  }, [inputValue, open]);

  const handleClearSearch = (e) => {
    e.preventDefault();
    setInputValue("");
    if (onSearchChange) onSearchChange("");
  };

  return (
    <div className="bg-background/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-border/50 p-3 flex flex-col md:flex-row gap-4 items-center justify-between relative z-50 transition-all w-full glass">
      {/* Search Input with Popover Suggestions */}
      <div className="w-full md:w-1/2 relative group">
        <Popover open={open && inputValue.trim().length > 1} onOpenChange={setOpen}>
          <div className="relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all group-focus-within:text-accent-secondary z-10" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value.trim().length > 1) setOpen(true);
              }}
              onFocus={() => {
                if (inputValue.trim().length > 1) setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOpen(false);
                  if (onSearchSubmit) onSearchSubmit(inputValue);
                }
              }}
              className="w-full pl-14 pr-12 py-5 bg-accent/30 border-none rounded-full outline-none font-black text-foreground transition-all placeholder:text-muted-foreground/30 text-[10px] uppercase tracking-[0.2em] relative z-10 hover:bg-accent/50 focus:ring-2 focus:ring-accent-secondary/20"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent-secondary transition-colors z-20"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <PopoverTrigger asChild>
            <div className="absolute inset-0 pointer-events-none invisible" />
          </PopoverTrigger>
          <PopoverContent 
            className="w-[calc(100vw-3rem)] md:w-[var(--radix-popover-trigger-width)] p-0 border-none bg-background/95 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-[2.5rem] mt-4"
            align="start"
            sideOffset={8}
          >
            <Command className="bg-transparent">
              <CommandList className="max-h-[400px]">
                {loadingSuggestions ? (
                  <div className="p-8 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-accent-secondary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Scanning Databanks...</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <CommandGroup heading={<span className="px-4 text-[9px] font-black text-accent-secondary uppercase tracking-[0.4em]">Matching Artifacts</span>}>
                    {suggestions.map((prod) => (
                      <CommandItem
                        key={prod._id}
                        onSelect={() => {
                          setOpen(false);
                          router.push(`/products/${prod.slug}`);
                        }}
                        className="flex items-center gap-6 p-4 cursor-pointer hover:bg-accent/50 transition-all rounded-3xl mx-2 my-1"
                      >
                        <div className="h-16 w-12 rounded-2xl overflow-hidden shrink-0 bg-accent relative shadow-lg">
                          <img
                            src={getImageUrl(prod.images?.[0], 100, 75)}
                            alt={prod.name}
                            className="h-full w-full object-cover transition-all"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-black text-foreground uppercase tracking-tight line-clamp-1 italic">
                            {prod.name}
                          </p>
                          <p className="text-[10px] font-bold text-accent-secondary uppercase tracking-widest">
                            ৳{prod.price.toLocaleString()}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                    <div className="p-2">
                       <Button
                        variant="ghost"
                        onClick={() => {
                          setOpen(false);
                          if (onSearchSubmit) onSearchSubmit(inputValue);
                        }}
                        className="w-full h-12 rounded-2xl bg-accent/30 hover:bg-accent-secondary hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-all"
                      >
                        See all results for "{inputValue}" →
                      </Button>
                    </div>
                  </CommandGroup>
                ) : (
                  <CommandEmpty className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                    No matching artifacts found
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Sort Dropdown with Shadcn Select */}
      <div className="w-full md:w-auto flex items-center pr-2 group gap-4">
        {sortLabel && (
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] hidden lg:block shrink-0 transition-colors group-hover:text-foreground">
            {sortLabel}
          </span>
        )}
        <Select value={sort || "all"} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:min-w-[200px] md:max-w-[300px] h-16 bg-accent/30 border-none rounded-full px-8 font-black text-[10px] uppercase tracking-widest hover:bg-accent/50 transition-all shadow-sm focus:ring-2 focus:ring-accent-secondary/20">
            <SelectValue placeholder="SORT SEQUENCE" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-3xl border-none shadow-2xl rounded-[2rem] p-2">
            {sortOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-2xl py-3 px-6 font-black text-[10px] uppercase tracking-widest focus:bg-accent-secondary focus:text-white cursor-pointer"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
