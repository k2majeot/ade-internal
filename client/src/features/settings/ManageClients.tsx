import { useEffect, useState, useMemo } from "react";
import { ManageTable } from "@/components/ManageTable";
import { getClients } from "@/api/client";
import type { Client } from "@shared/validation";
import type { ApiResponse } from "@/types/apiTypes";

const columns = [
  { label: "First Name", key: "fname" },
  { label: "Last Name", key: "lname" },
  { label: "Status", key: "status" },
];

type Props = {
  activeStack: string[];
  setActiveStack: React.Dispatch<React.SetStateAction<string[]>>;
  setClient: (client: Client) => void;
};

export default function ManageClients({
  activeStack,
  setActiveStack,
  setClient,
}: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Set<Client>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  const actions = useMemo(
    () => [
      {
        label: "Update Client",
        disabled: selectedClients.size !== 1,
        onClick: () => {
          const client = [...selectedClients][0];
          setClient(client);
          setActiveStack((stk) => [...stk, "Update Client"]);
        },
      },
    ],
    [selectedClients, setClient, setActiveStack]
  );

  const fetchClients = async () => {
    setLoading(true);
    const result: ApiResponse<Client[]> = await getClients();
    setClients(result.success ? result.data : []);
    setSelectedClients(new Set());
    setLoading(false);
  };

  const toggle = (client: Client) =>
    setSelectedClients((prev) => {
      const next = new Set(prev);
      next.has(client) ? next.delete(client) : next.add(client);
      return next;
    });

  useEffect(() => {
    void fetchClients();
  }, []);

  return (
    <ManageTable<Client>
      title="Clients"
      columns={columns}
      data={clients}
      selected={selectedClients}
      onToggle={toggle}
      actions={actions}
      createButton={{
        label: "Create Client",
        onClick: () => setActiveStack((stk) => [...stk, "Create Client"]),
      }}
      isLoading={loading}
    />
  );
}
