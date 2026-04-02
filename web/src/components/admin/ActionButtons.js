import Link from 'next/link';

export default function ActionButtons({ editUrl, onDelete }) {
  return (
    <div className="flex space-x-2">
      <Link
        href={editUrl}
        className="text-indigo-600 hover:text-indigo-900 font-medium"
      >
        Edit
      </Link>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-900 font-medium"
      >
        Delete
      </button>
    </div>
  );
}