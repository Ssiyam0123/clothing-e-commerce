"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X, Loader2, User as UserIcon, FileText, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
  entityType = "product", // "product", "user", "blog"
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(search || "");
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false); // Legacy support for other components

  const debouncedInput = useDebounce(inputValue, debounceMs);
  const onSearchChangeRef = useRef(onSearchChange);
  const currentSearchRef = useRef(search || "");

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    currentSearchRef.current = search || "";
    // Only update input if it's NOT focused, to prevent "glitches" while typing
    if (!isFocused && search !== undefined && search !== inputValue) {
      setInputValue(search || "");
    }
  }, [search, isFocused]);

  useEffect(() => {
    if (liveSearch && onSearchChangeRef.current) {
      if (debouncedInput !== currentSearchRef.current) {
        onSearchChangeRef.current(debouncedInput);
      }
    }
  }, [debouncedInput, liveSearch]);

  const handleClearSearch = (e) => {
    e.preventDefault();
    setInputValue("");
    if (onSearchChange) onSearchChange("");
  };

  const getEntityIcon = () => {
    if (entityType === "user") return <UserIcon size={16} />;
    if (entityType === "blog") return <FileText size={16} />;
    return <Package size={16} />;
  };

  return (
    <div className="bg-card/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-border p-3 flex flex-col md:flex-row gap-4 items-center justify-between relative z-50 transition-all w-full">
      {/* Search Input - Simplified for performance and no glitches */}
      <div className="w-full md:w-1/2 relative group">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all group-focus-within:text-primary z-10" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (onSearchSubmit) onSearchSubmit(inputValue);
                if (onSearchChange) onSearchChange(inputValue);
              }
            }}
            className="w-full pl-14 pr-12 py-5 bg-muted/50 border border-transparent rounded-full outline-none font-black text-foreground transition-all placeholder:text-muted-foreground/30 text-[10px] uppercase tracking-[0.2em] relative z-10 hover:bg-muted focus:ring-2 focus:ring-primary/20 focus:border-border"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors z-20"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Sort Dropdown with Shadcn Select */}
      <div className="w-full md:w-auto flex items-center pr-2 group gap-4">
        {sortLabel && (
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] hidden lg:block shrink-0 transition-colors group-hover:text-foreground">
            {sortLabel}
          </span>
        )}
        <Select value={sort || "all"} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:min-w-[200px] md:max-w-[300px] h-20 bg-muted/50 border border-transparent rounded-full px-8 font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all shadow-sm focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="SORT SEQUENCE" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-3xl border border-border shadow-2xl rounded-[2rem] p-2">
            {sortOptions?.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-2xl py-3 px-6 font-black text-[10px] uppercase tracking-widest focus:bg-primary focus:text-primary-foreground cursor-pointer"
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
