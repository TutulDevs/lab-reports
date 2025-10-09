"use client";

import { Buyer } from "@prisma/client";
import React from "react";
import { commonValuesList, PartialUser } from "@/lib/coreconstants";
import { createBuyerSchema, updateBuyerSchema } from "@/lib/schemas";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

type CreateSchemaType = z.infer<typeof createBuyerSchema>;
type UpdateSchemaType = z.infer<typeof updateBuyerSchema>;

type FormType = CreateSchemaType | UpdateSchemaType;

export const CreateOrEditBuyerForm: React.FC<{ buyer?: Buyer }> = ({
  buyer,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const btnText = {
    default: buyer ? "Update" : "Create",
    loading: buyer ? "Updating..." : "Creating...",
  };

  const schema = buyer ? updateBuyerSchema : createBuyerSchema;

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      id: buyer?.id ?? "",
      title: buyer?.title ?? "",
    },
  });

  console.log(form.formState.errors);

  const onSubmit = async (payload: FormType) => {
    try {
      setLoading(true);
      console.table(payload);

      // const res = await fetch("/api/staff", {
      //   method: buyer ? "PUT" : "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     ...payload,
      //   }),
      // });
      // const status = res.status;
      // const data = await res.json();

      // console.log("res:", status, res);
      // console.log("data:", data);

      // if (data?.success) {
      //   toast.success(
      //     data?.message || `Successfully ${buyer ? "updated" : "created"}`
      //   );
      //   router.refresh();
      // } else {
      //   toast.error(data?.error || `Failed to ${buyer ? "update" : "create"}`);
      //   if (status == 401) window.location.href = "/login";
      // }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const commonValuesSelect = (
    <SelectContent>
      {commonValuesList.map((x) => (
        <SelectItem key={x} value={String(x)}>
          {x}
        </SelectItem>
      ))}
    </SelectContent>
  );

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-6 mx-auto max-w-4xl "
        >
          {/* title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buyer Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dimensional stability to Wash */}
          <GroupWrapper text={"Dimensional stability to Wash"}>
            <FormField
              control={form.control}
              name="ds_wash_length_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length Minimum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter min length"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ds_wash_length_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length Maximum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter max length"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ds_wash_width_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width Minimum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter min width"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ds_wash_width_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width Maximum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter max width"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* spirality */}
          <FormField
            control={form.control}
            name="spirality_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spirality Maximum</FormLabel>
                <FormControl>
                  <Input placeholder="Enter value" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* cf to wash */}
          <GroupWrapper text="CF to Wash">
            <FormField
              control={form.control}
              name="cf_wash_cs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CS</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cf_wash_cc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* cf to rub */}
          <GroupWrapper text="CF to Rubbing">
            <FormField
              control={form.control}
              name="cf_rub_dry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dry</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cf_rub_wet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wet</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* cf to water */}
          <GroupWrapper text="CF to Water">
            <FormField
              control={form.control}
              name="cf_water_cs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CS</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cf_water_cc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* cf to perspiration */}
          <GroupWrapper text="CF to Perspiration">
            <FormField
              control={form.control}
              name="cf_persp_cs_acd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CS ACD</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cf_persp_cc_acd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC ACD</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cf_persp_cs_alk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CS ALK</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cf_persp_cc_alk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CC ALK</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* piling */}
          <GroupWrapper text="CF to Water">
            <FormField
              control={form.control}
              name="piling_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="piling_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    {commonValuesSelect}
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* bursting_strength_kpa */}
          <FormField
            control={form.control}
            name="bursting_strength_kpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bursting Strength (KPA)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter value" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ph level */}
          <GroupWrapper text="PH Level">
            <FormField
              control={form.control}
              name="ph_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ph_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* cf to dye transfer */}
          <FormField
            control={form.control}
            name="cf_dye_transfer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CF to Dye Transfer</FormLabel>

                <Select
                  onValueChange={(e) => field.onChange(parseInt(e))}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                  </FormControl>

                  {commonValuesSelect}
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fabric Dia */}
          <GroupWrapper text="Fabric Dia">
            <FormField
              control={form.control}
              name="fabric_r_dia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>R. Dia</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fabric_f_dia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>F. Dia</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* Fabric Weight */}
          <GroupWrapper text="Fabric Weight">
            <FormField
              control={form.control}
              name="fabric_r_gsm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>R. GSM</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fabric_f_gsm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>F. GSM</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? btnText.loading : btnText.default}
          </Button>
        </form>
      </Form>
    </>
  );
};

const GroupWrapper: React.FC<{
  text: React.ReactNode;
  children: React.ReactNode;
}> = ({ text, children }) => {
  return (
    <>
      <h2 className="text-lg font-medium">{text}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </>
  );
};
