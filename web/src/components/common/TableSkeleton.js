// src/components/common/TableSkeleton.js
import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({ rowCount = 5, colCount = 5 }) {
  return (
    <div className="bg-card rounded-[2.5rem] border border-border overflow-x-auto shadow-sm w-full">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            {Array.from({ length: colCount }).map((_, idx) => (
              <th key={idx} className="px-8 py-6 text-left">
                <Skeleton className="h-3 w-24 bg-muted-foreground/10" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: colCount }).map((_, colIdx) => (
                <td key={colIdx} className="px-8 py-6 whitespace-nowrap">
                  {colIdx === 0 ? (
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-2xl bg-muted-foreground/10 shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-32 bg-muted-foreground/10" />
                        <Skeleton className="h-2 w-20 bg-muted-foreground/10" />
                      </div>
                    </div>
                  ) : colIdx === colCount - 1 ? (
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-10 w-10 rounded-xl bg-muted-foreground/10" />
                      <Skeleton className="h-10 w-10 rounded-xl bg-muted-foreground/10" />
                    </div>
                  ) : (
                    <Skeleton className="h-3 w-16 bg-muted-foreground/10" />
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
