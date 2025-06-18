import { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { TableSkeleton } from "@/components/TableSkeleton";
import { getUsers } from "@/api/user";
import { type User, type UserList } from "@shared/validation";
import type { ApiResult } from "@/types/apiTypes";

type Props = {
  activeStack: string[];
  setActiveStack: () => void;
};

export default function ManageUsers({ activeStack, setActiveStack }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setLoading] = useState(true);

  async function fetchUsers() {
    const result: ApiResult<UserList> = await getUsers();
    if (!result.success) {
      setUsers([]);
      return;
    }
    setUsers(result.data);
    setLoading(true);
  }

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, []);

  function toggleSelection(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  const columns = ["First Name", "Last Name", "Username", "Role"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Button onClick={() => setActiveStack([...activeStack, "Add User"])}>
          Add User
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Manage Users</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit User</DropdownMenuItem>
            <DropdownMenuItem>Deactivate User</DropdownMenuItem>
            <DropdownMenuItem>Delete User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            {columns.map((label, index) => (
              <TableHead
                key={label}
                className={index === columns.length - 1 ? "text-right" : ""}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <TableSkeleton rows={10} columns={columns} />
              </TableCell>
            </TableRow>
          ) : users.length ? (
            users.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={(checked) =>
                        toggleSelection(row.id, checked)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>{row.fname}</TableCell>
                <TableCell>{row.lname}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell className="text-right">{row.role}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No users found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
