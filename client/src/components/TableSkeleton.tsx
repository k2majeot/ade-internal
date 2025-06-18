import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  rows = 5,
  columns,
}: {
  rows?: number;
  columns: string[];
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell>
            <Skeleton className="h-4 w-4 rounded" />{" "}
          </TableCell>
          {columns.map((_, colIndex) => (
            <TableCell
              key={colIndex}
              className={colIndex === columns.length - 1 ? "text-right" : ""}
            >
              <Skeleton
                className={`h-4 ${
                  colIndex === columns.length - 1 ? "w-16 ml-auto" : "w-24"
                } rounded`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
