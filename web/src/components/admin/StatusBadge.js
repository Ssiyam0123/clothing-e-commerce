"use client";

export default function StatusBadge({ value }) {
  if (!value) return null;

  // স্ট্যাটাস অনুযায়ী কালার ম্যাপিং (Senior Dev Pattern)
  const statusConfig = {
    // Product & General Visibility
    active: "bg-green-50 text-green-700 border-green-200",
    visible: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-red-50 text-red-700 border-red-200",
    hidden: "bg-red-50 text-red-700 border-red-200",

    // Order Status
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",

    // Payment Status
    paid: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    unpaid: "bg-orange-50 text-orange-700 border-orange-200",

    // Stock/Inventory logic
    "out of stock": "bg-red-100 text-red-800 border-red-300",
    "low stock": "bg-orange-100 text-orange-800 border-orange-300",
    "in stock": "bg-green-100 text-green-800 border-green-300",
    synced: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  // ভ্যালু অনুযায়ী স্টাইল সিলেক্ট করা
  const normalizedValue = value.toLowerCase();
  const badgeStyle =
    statusConfig[normalizedValue] || "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${badgeStyle}`}
    >
      <span className="mr-1.5 h-1 w-1 rounded-full bg-current animate-pulse"></span>
      {value}
    </span>
  );
}
