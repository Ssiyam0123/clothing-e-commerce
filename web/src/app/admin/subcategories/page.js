'use client';

import Link from 'next/link';
import { useSubcategories } from '@/hooks/useSubcategories';
import DataTable from '@/components/admin/DataTable';
import ActionButtons from '@/components/admin/ActionButtons';
import Loader from '@/components/common/Loader';

export default function Subcategories() {
  const { subcategories, isLoading, deleteSubcategory } = useSubcategories();

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      await deleteSubcategory.mutateAsync(id);
    }
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Slug', key: 'slug' },
    { label: 'Category', key: 'category', render: (item) => item.category?.name },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
        <Link
          href="/admin/subcategories/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Subcategory
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={subcategories}
        actions={(item) => (
          <ActionButtons
            editUrl={`/admin/subcategories/${item._id}`}
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />
    </div>
  );
}