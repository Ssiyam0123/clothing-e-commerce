// src/components/common/TableSkeleton.js
export default function TableSkeleton({ rowCount = 5, colCount = 5 }) {
  return (
    <div className="bg-surface dark:bg-[#0a0a0a] rounded-[2.5rem] border border-light overflow-x-auto shadow-sm w-full">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800/50">
        <thead className="bg-surface-alt dark:bg-[#111]">
          <tr>
            {Array.from({ length: colCount }).map((_, idx) => (
              <th key={idx} className="px-8 py-6 text-left">
                <div className="h-3 bg-elevated dark:bg-elevated rounded-full w-24 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <tr key={rowIdx} className="animate-pulse">
              {Array.from({ length: colCount }).map((_, colIdx) => (
                <td key={colIdx} className="px-8 py-6 whitespace-nowrap">
                  {colIdx === 0 ? (
                    // First column usually has an image/avatar in our design
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-elevated dark:bg-elevated shrink-0"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-elevated dark:bg-elevated rounded-full w-32"></div>
                        <div className="h-2 bg-elevated dark:bg-elevated rounded-full w-20"></div>
                      </div>
                    </div>
                  ) : colIdx === colCount - 1 ? (
                    // Last column usually has action buttons
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-8 w-8 rounded-xl bg-elevated dark:bg-elevated"></div>
                      <div className="h-8 w-8 rounded-xl bg-elevated dark:bg-elevated"></div>
                      <div className="h-8 w-8 rounded-xl bg-elevated dark:bg-elevated"></div>
                    </div>
                  ) : (
                    // Middle columns text
                    <div className="h-3 bg-elevated dark:bg-elevated rounded-full w-16"></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
