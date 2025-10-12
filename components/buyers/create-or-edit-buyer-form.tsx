"use client";

import { Buyer } from "@prisma/client";
import React from "react";
import { commonValuesList } from "@/lib/coreconstants";
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
    // @ts-expect-error itzok
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      id: buyer?.id ?? "",
      title: buyer?.title ?? "",

      ds_wash_length_min: buyer?.ds_wash_length_min,
      ds_wash_length_max: buyer?.ds_wash_length_max,
      ds_wash_width_min: buyer?.ds_wash_length_min,
      ds_wash_width_max: buyer?.ds_wash_length_max,

      spirality_max: buyer?.spirality_max ?? undefined,

      cf_wash_cs: buyer?.cf_wash_cs ?? undefined,
      cf_wash_cc: buyer?.cf_wash_cc ?? undefined,

      cf_rub_dry: buyer?.cf_rub_dry ?? undefined,
      cf_rub_wet: buyer?.cf_rub_wet ?? undefined,

      cf_water_cs: buyer?.cf_water_cs ?? undefined,
      cf_water_cc: buyer?.cf_water_cc ?? undefined,

      cf_persp_cs_acd: buyer?.cf_persp_cs_acd ?? undefined,
      cf_persp_cc_acd: buyer?.cf_persp_cc_acd ?? undefined,
      cf_persp_cs_alk: buyer?.cf_persp_cs_alk ?? undefined,
      cf_persp_cc_alk: buyer?.cf_persp_cc_alk ?? undefined,

      piling_min: buyer?.piling_min ?? undefined,
      piling_max: buyer?.piling_max ?? undefined,

      bursting_strength_kpa: buyer?.bursting_strength_kpa ?? undefined,

      ph_min: buyer?.ph_min ? Number(buyer.ph_min) : undefined,
      ph_max: buyer?.ph_max ? Number(buyer.ph_max) : undefined,

      cf_dye_transfer: buyer?.cf_dye_transfer ?? undefined,

      fabric_r_dia: buyer?.fabric_r_dia ?? undefined,
      fabric_f_dia: buyer?.fabric_f_dia ?? undefined,
      fabric_r_gsm: buyer?.fabric_r_gsm ?? undefined,
      fabric_f_gsm: buyer?.fabric_f_gsm ?? undefined,
    },
  });

  // console.log(form.formState.errors);

  const onSubmit = async (payload: FormType) => {
    try {
      setLoading(true);
      // console.table(payload);

      const res = await fetch("/api/buyer", {
        method: buyer ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const status = res.status;
      const data = await res.json();
      const buyerData: Buyer = data.buyer;

      // console.log("res:", status, res);
      // console.log("data:", data);

      if (data?.success) {
        toast.success(
          data?.message || `Successfully ${buyer ? "updated" : "created"}`
        );

        router.push(`/buyers/${buyerData.id}`);
        router.refresh();
      } else {
        toast.error(data?.error || `Failed to ${buyer ? "update" : "create"}`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const commonValuesSelect = (
    <SelectContent>
      <SelectItem value={"undefined"}>None</SelectItem>

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
                      step="any"
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
                      step="any"
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
                      step="any"
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
                      step="any"
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
                  <Input
                    placeholder="Enter value"
                    type="number"
                    step="any"
                    {...field}
                  />
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    onValueChange={(e) => field.onChange(parseFloat(e))}
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
          <GroupWrapper text="Piling">
            <FormField
              control={form.control}
              name="piling_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
                  </FormControl>
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
                  <Input
                    placeholder="Enter value"
                    type="number"
                    step="any"
                    {...field}
                  />
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
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
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
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
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
                  onValueChange={(e) => field.onChange(parseFloat(e))}
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
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
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
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
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
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
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
                    <Input
                      placeholder="Enter value"
                      type="number"
                      step="any"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </GroupWrapper>

          {/* submit */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full max-w-md"
              // text-2xl py-6
              disabled={loading}
            >
              {loading ? btnText.loading : btnText.default}
            </Button>
          </div>
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
    <div className="bg-accent/40 rounded-md p-4 space-y-4 ">
      <h2 className="text-lg font-medium">{text}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};
