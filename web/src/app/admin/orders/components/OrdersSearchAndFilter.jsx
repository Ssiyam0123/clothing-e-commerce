"use client";

import FilterBar from "@/components/common/FilterBar";

export default function OrdersSearchAndFilter({
  status,
  onStatusChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
}) {
  const statuses = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 border-b border-border/10 bg-background/20">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onStatusChange(s.value)}
            className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border duration-300 active:scale-95 ${
              status === s.value
                ? "bg-foreground text-background border-foreground shadow-lg"
                : "bg-background/50 text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Autocomplete Search & Sort dropdown */}
      <FilterBar
        search={search}
        onSearchSubmit={onSearchChange}
        onSearchChange={onSearchChange}
        sort={sort}
        onSortChange={onSortChange}
        sortOptions={[
          { label: "🌟 Default", value: "all" },
          { label: "Newest First", value: "-createdAt" },
          { label: "Oldest First", value: "createdAt" },
          { label: "Price: High", value: "-totalPrice" },
          { label: "Price: Low", value: "totalPrice" },
        ]}
        searchPlaceholder="Order ID, Customer Name or Phone..."
      />
    </div>
  );
}
