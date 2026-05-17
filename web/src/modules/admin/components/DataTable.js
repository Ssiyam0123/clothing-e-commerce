import { getImageUrl } from "@/utils/imageUtils";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ImageCell = ({ src, alt }) => {
  const [error, setError] = useState(false);
  const imageUrl = src ? getImageUrl(src) : null;

  if (!imageUrl || error) {
    return (
      <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-[9px] font-black uppercase tracking-widest border border-border">
        N/A
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || "Image"}
      className="h-12 w-12 object-cover rounded-2xl border border-border grayscale hover:grayscale-0 transition-all duration-500 cursor-zoom-in"
      onError={() => setError(true)}
    />
  );
};

export default function DataTable({ columns, data, actions, className }) {
  return (
    <div className={cn("admin-table-container", className)}>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-border">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className="px-8 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap"
              >
                {col.label}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="px-8 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, rowIdx) => (
            <TableRow
              key={item._id || rowIdx}
              className="hover:bg-muted/30 border-border group transition-colors"
            >
              {columns.map((col, colIdx) => (
                <TableCell
                  key={colIdx}
                  className="px-8 py-6 whitespace-nowrap text-sm font-bold text-foreground"
                >
                  {col.render ? (
                    col.render(item)
                  ) : col.key === "image" ? (
                    <ImageCell src={item[col.key]} alt={item.name || "Image"} />
                  ) : (
                    item[col.key]
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium opacity-50 group-hover:opacity-100 transition-opacity">
                  {actions(item)}
                </TableCell>
              )}
            </TableRow>
          ))}
          {(!data || data.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-8 py-24 text-center"
              >
                <span className="text-5xl block mb-4 grayscale opacity-20">
                  📭
                </span>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  No Database Records Found
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
