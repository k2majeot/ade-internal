import { useEffect, useMemo, useState } from "react";
import { ManageTable } from "@/components/ManageTable";
import { getUsers, deactivateUsers, deleteUsers } from "@/api/user";
import type { User, UserList } from "@shared/validation";
import type { ApiResponse } from "@/types/apiTypes";

const columns = [
  { label: "First Name", key: "fname" },
  { label: "Last Name", key: "lname" },
  { label: "Username", key: "username" },
  { label: "Role", key: "role" },
  { label: "Status", key: "status" },
];

type Props = {
  activeStack: string[];
  setActiveStack: React.Dispatch<React.SetStateAction<string[]>>;
  setUser: (user: User) => void;
};

export default function ManageUsers({
  activeStack,
  setActiveStack,
  setUser,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<User>>(new Set());
  const [loading, setLoading] = useState(true);

  const selectedArray = [...selectedUsers];
  const selectedCount = selectedArray.length;

  const fetchUsers = async () => {
    setLoading(true);
    const result: ApiResponse<UserList> = await getUsers();
    setUsers(result.success ? result.data : []);
    setSelectedUsers(new Set());
    setLoading(false);
  };

  const toggle = (row: User) =>
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.has(row) ? next.delete(row) : next.add(row);
      return next;
    });

  useEffect(() => {
    void fetchUsers();
  }, []);

  const actions = useMemo(
    () => [
      {
        label: "Update User",
        disabled: selectedCount !== 1,
        onClick: () => {
          setUser(selectedArray[0]);
          setActiveStack((stk) => [...stk, "Update User"]);
        },
      },
      {
        label: selectedCount === 1 ? "Deactivate User" : "Deactivate Users",
        disabled: selectedCount === 0,
        onClick: async () => {
          const ids = selectedArray.map((u) => u.id);
          await deactivateUsers(ids);
          await fetchUsers();
        },
      },
      {
        label: selectedCount === 1 ? "Delete User" : "Delete Users",
        disabled: selectedCount === 0,
        onClick: async () => {
          const payload = selectedArray.map((u) => ({
            id: u.id,
            username: u.username,
          }));
          await deleteUsers(payload);
          await fetchUsers();
        },
      },
    ],
    [selectedArray, selectedCount, setUser, setActiveStack]
  );

  return (
    <ManageTable<User>
      columns={columns}
      data={users}
      selected={selectedUsers}
      onToggle={toggle}
      actions={actions}
      createButton={{
        label: "Create User",
        onClick: () => setActiveStack((stk) => [...stk, "Create User"]),
      }}
      isLoading={loading}
    />
  );
}
