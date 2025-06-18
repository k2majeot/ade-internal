import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { AlertCircleIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Role } from "@shared/types";
import { type UserData, userDataSchema } from "@shared/validation";
import { register } from "@/api/auth";

type Props = {
  activeStack: string[];
  setActiveStack: () => void;
};

export default function AddUser({ activeStack, setActiveStack }: Props) {
  const form = useForm<UserData>({
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      fname: "",
      lname: "",
      username: "",
      role: "",
    },
    mode: "onSubmit",
  });
  const { handleSubmit, setError, formState } = form;

  async function onSubmit(values: Register) {
    const result = await register(values);
    if (!result.success) {
      setError("root", {
        type: "manual",
        message: result.message,
      });
      toast("Submission failed");
      return;
    }
    toast("Submission successful");
    setActiveStack((prev) => prev.slice(0, -1));
  }

  const fname = form.watch("fname");
  const lname = form.watch("lname");
  useEffect(() => {
    if (fname && lname) {
      const generated = `${fname[0].toLowerCase()}${lname.toLowerCase()}`;
      form.setValue("username", generated);
    }
  }, [fname, lname]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="cursor-pointer">
            Create Account
          </Button>
          {formState.errors.root && (
            <Alert
              variant="destructive"
              className="bg-transparent border-none px-0 py-2"
            >
              <AlertCircleIcon />
              <AlertTitle>{formState.errors.root.message}</AlertTitle>
            </Alert>
          )}
        </div>
      </form>
    </Form>
  );
}
