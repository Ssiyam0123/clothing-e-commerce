"use client";

import { useState } from "react";
import Link from "next/link";
import { useSizes } from "@/hooks/useSizes";
import { useCategories } from "@/hooks/useCategories";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";
import Loader from "@/components/common/Loader";

export default function Sizes() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { sizes, isLoading, deleteSize } = useSizes(selectedCategory);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this size?")) {
      await deleteSize.mutateAsync(id);
    }
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    {
      label: "Category",
      key: "category",
      render: (item) => item.category?.name,
    },
  ];

  if (isLoading || categoriesLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sizes</h1>
        <Link
          href="/admin/sizes/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Size
        </Link>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-64 border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={sizes}
        actions={(item) => (
          <ActionButtons
            editUrl={`/admin/sizes/${item._id}`}
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />
    </div>
  );
}
