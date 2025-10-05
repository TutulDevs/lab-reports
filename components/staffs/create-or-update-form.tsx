"use client";

import { PartialUser } from "@/lib/coreconstants";
import { registerStaffSchema, updateStaffSchema } from "@/lib/schemas";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, sleep } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Role } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RegisterSchemaType = z.infer<typeof registerStaffSchema>;
type UpdateSchemaType = z.infer<typeof updateStaffSchema>;

type FormType = RegisterSchemaType | UpdateSchemaType;

export const CreateOrUpdateUserForm: React.FC<{
  user?: PartialUser;
  closeModal: () => void;
}> = ({ user, closeModal }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const btnText = {
    default: user ? "Update" : "Create",
    loading: user ? "Updating" : "Creating",
  };

  const schema = user ? updateStaffSchema : registerStaffSchema;

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: user?.id ?? "",
      username: user?.username ?? "",
      password: "",
      fullname: user?.fullname ?? "",
      designation: user?.designation ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      role: user?.role ?? Role.STAFF,
    },
  });

  const onSubmit = async (payload: FormType) => {
    try {
      setLoading(true);
      // console.table(payload);

      const res = await fetch("/api/staff", {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const status = res.status;
      const data = await res.json();

      // console.log("res:", status, res);
      // console.log("data:", data);

      if (data?.success) {
        toast.success(
          data?.message || `Successfully ${user ? "updated" : "created"}`
        );
        closeModal();
        // form.reset();
        router.refresh();
      } else {
        toast.error(data?.error || `Failed to ${user ? "update" : "create"}`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="pr-12"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="bg-red-500x cursor-pointer absolute right-4 top-7"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </button>
                {/*  */}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
                    <SelectItem value={Role.STAFF}>{Role.STAFF}</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* full name */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* designation */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? btnText.loading : btnText.default}
          </Button>
        </form>
      </Form>
    </>
  );
};
