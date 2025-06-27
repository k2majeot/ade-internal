import { z } from "zod";
import GenericForm, { type Field } from "@/components/GenericForm";
import { updateUser } from "@/api/user";
import { register } from "@/api/auth";
import { Role, Status } from "@shared/types";
import type { ApiResponse } from "@/types/apiTypes";
import { userDataSchema } from "@shared/validation";
import type { User } from "@/types";
import { toast } from "sonner";

const userFields: Field[] = [
  {
    label: "First Name",
    name: "fname",
    type: "input",
    placeholder: "Enter first name",
  },
  {
    label: "Last Name",
    name: "lname",
    type: "input",
    placeholder: "Enter last name",
  },
  {
    label: "Username",
    name: "username",
    type: "input",
    placeholder: "Choose a username",
  },
  {
    label: "Role",
    name: "role",
    type: "select",
    placeholder: "Select a role",
    options: Object.values(Role).map((role) => ({
      label: role,
      value: role,
    })),
  },
  {
    label: "Status",
    name: "status",
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
  type: "create";
};

type UpdateProps = BaseProps & {
  type: "update";
  user: User;
};

type Props = CreateProps | UpdateProps;

export default function ManageUser(props: Props) {
  const { setActiveStack, type } = props;
  const fields: Field[] = userFields.map((f) =>
    f.name === "username" ? { ...f, disabled: type === "update" } : f
  );

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    const result =
      type === "update"
        ? await updateUser(props.user.id, values)
        : await register(values);

    if (!result.success) {
      toast.error(result.message || "Submission failed");
      return;
    }

    toast.success(type === "update" ? "User updated" : "User created");
    setActiveStack((prev) => prev.slice(0, -1));
  };

  return (
    <GenericForm
      formSchema={userDataSchema}
      fields={fields}
      submitButton={{
        label: type === "update" ? "Update User" : "Create User",
        onSubmit: onSubmit,
      }}
      defaultValues={type === "update" ? props.user : {}}
    />
  );
}
