import { z } from "zod";
import GenericForm, { type Field } from "@/components/GenericForm";
import { createClient, updateClient } from "@/api/client";
import { Status } from "@shared/types";
import { clientDataSchema } from "@shared/validation";
import type { Client } from "@/types";
import { toast } from "sonner";

const clientFields: Field[] = [
  {
    name: "fname",
    label: "First Name",
    type: "input",
    placeholder: "Enter first name",
  },
  {
    name: "lname",
    label: "Last Name",
    type: "input",
    placeholder: "Enter last name",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select a status",
    options: Object.values(Status).map((status) => ({
      label: status,
      value: status,
    })),
  },
];

type BaseProps = {
  setActiveStack: (prev: string[]) => string[];
};

type CreateProps = BaseProps & {
  client?: undefined;
};

type UpdateProps = BaseProps & {
  client: Client;
};

type Props = CreateProps | UpdateProps;

export default function ManageClient(props: Props) {
  const { setActiveStack, client } = props;

  const onSubmit = async (values: z.infer<typeof clientDataSchema>) => {
    const result = client
      ? await updateClient(client.id, values)
      : await createClient(values);

    if (!result.success) {
      toast.error(result.message || "Submission failed");
      return;
    }

    toast.success(client ? "Client updated" : "Client created");
    setActiveStack((prev) => prev.slice(0, -1));
  };

  return (
    <GenericForm
      formSchema={clientDataSchema}
      fields={clientFields}
      defaultValues={client ?? {}}
      submitButton={{
        label: client ? "Update Client" : "Create Client",
        onSubmit,
      }}
    />
  );
}
