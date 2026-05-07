import { getImageUrl } from "@/utils/imageUtils";
import { useState } from "react";

const ImageCell = ({ src, alt }) => {
  const [error, setError] = useState(false);
  const imageUrl = src ? getImageUrl(src) : null;

  if (!imageUrl || error) {
    return (
      <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 text-[9px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
        N/A
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || "Image"}
      className="h-12 w-12 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500 cursor-zoom-in"
      onError={() => setError(true)}
    />
  );
};

export default function DataTable({ columns, data, actions }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-x-auto shadow-2xl">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800/50">
        <thead className="bg-zinc-50 dark:bg-[#111]">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-8 py-6 text-left text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {data?.map((item, rowIdx) => (
            <tr
              key={item._id || rowIdx}
              className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group"
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className="px-8 py-6 whitespace-nowrap text-sm font-bold text-zinc-800 dark:text-zinc-200"
                >
                  {col.render ? (
                    col.render(item)
                  ) : col.key === "image" ? (
                    <ImageCell src={item[col.key]} alt={item.name || "Image"} />
                  ) : (
                    item[col.key]
                  )}
                </td>
              ))}
              {actions && (
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium opacity-50 group-hover:opacity-100 transition-opacity">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
          {(!data || data.length === 0) && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-8 py-24 text-center"
              >
                <span className="text-5xl block mb-4 grayscale opacity-20">
                  📭
                </span>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  No Database Records Found
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
