import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Props<Row extends { id: number }> = {
  columns: { label: string; key: keyof Row }[];
  data: Row[];
  selected: Set<Row>;
  onToggle: (row: Row) => void;
  actions: {
    label: string;
    disabled: boolean;
    onClick: () => void;
  }[];
  createButton: {
    label: string;
    onClick: () => void;
  };
  isLoading: boolean;
};

export function ManageTable<Row extends { id: number }>({
  columns,
  data,
  selected,
  onToggle,
  actions,
  createButton,
  isLoading,
}: Props<Row>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Button onClick={createButton.onClick}>{createButton.label}</Button>
        {actions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={selected.size === 0}>
                Actions <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {actions.map((a) => (
                <DropdownMenuItem
                  key={a.label}
                  onClick={a.onClick}
                  disabled={a.disabled}
                >
                  {a.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isLoading ? (
        <div />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              {columns.map((c, i) => (
                <TableHead
                  key={String(c.key)}
                  className={i === columns.length - 1 ? "text-right" : ""}
                >
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((r) => (
                <TableRow key={r.id} onClick={() => onToggle(r)}>
                  <TableCell>
                    <Checkbox
                      checked={[...selected].some((s) => s.id === r.id)}
                    />
                  </TableCell>
                  {columns.map((c, i) => (
                    <TableCell
                      key={String(c.key)}
                      className={i === columns.length - 1 ? "text-right" : ""}
                    >
                      {String(r[c.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
