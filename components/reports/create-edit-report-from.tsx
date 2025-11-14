"use client";

import { Buyer } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
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
import {
  reportSampleList,
  reportSampleStageList,
  reportStatusList,
} from "@/lib/corearrays";
import { createReportSchema, updateReportSchema } from "@/lib/schemas";
import {
  BuyersForReport,
  ReportOverallResult,
  ReportSampleStage,
  ReportSampleType,
  ReportStatus,
  ReportWithUser,
} from "@/lib/coreconstants";
import { FromGroupWrapper } from "../form-group-wrapper";
import { Dialog, DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { FormPreviewContent } from "./form-preview-content";

type CreateSchemaType = z.infer<typeof createReportSchema>;
type UpdateSchemaType = z.infer<typeof updateReportSchema>;

export type ReportFormType = CreateSchemaType | UpdateSchemaType;

export const CreateOrEditReportForm: React.FC<{
  report?: ReportWithUser;
  buyers: BuyersForReport[];
}> = ({ report, buyers }) => {
  const [buyer, setBuyer] = useState<null | Buyer>(
    (report?.buyer as Buyer) ?? null,
  );
  const [reportData, setReportData] = useState<null | ReportFormType>(null);

  const schema = report ? updateReportSchema : createReportSchema;

  const form = useForm<ReportFormType>({
    // @ts-expect-error itzok
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      id: report?.id ?? "",
      buyerId: report?.buyerId ?? "",

      // report related
      sample_receive_date: report?.sample_receive_date ?? new Date(),
      report_id: report?.report_id ?? ``,
      status: report?.status ?? ReportStatus.IN_PROGRESS,
      sample_type: report?.sample_type ?? ReportSampleType.FABRIC,
      sample_stage: report?.sample_stage ?? ReportSampleStage.A_STENTER,
      order_number: report?.order_number ?? 1111111,
      batch_number: report?.batch_number ?? 3333333,
      color: report?.color ?? "",
      fabric_type: report?.fabric_type ?? "",
      roll_number: report?.roll_number ?? 999999,
      remarks: report?.remarks ?? "",

      result: report?.result ?? ReportOverallResult.PENDING,
      fail_portions: report?.fail_portions ?? "",

      // for buyer req
      ds_wash_length_min: report?.ds_wash_length_min ?? 55,
      ds_wash_length_max: report?.ds_wash_length_max ?? 55,
      ds_wash_width_min: report?.ds_wash_length_min ?? 55,
      ds_wash_width_max: report?.ds_wash_length_max ?? 55,

      spirality_max: report?.spirality_max ?? undefined,

      cf_wash_cs: report?.cf_wash_cs ?? undefined,
      cf_wash_cc: report?.cf_wash_cc ?? undefined,

      cf_rub_dry: report?.cf_rub_dry ?? undefined,
      cf_rub_wet: report?.cf_rub_wet ?? undefined,

      cf_water_cs: report?.cf_water_cs ?? undefined,
      cf_water_cc: report?.cf_water_cc ?? undefined,

      cf_persp_cs_acd: report?.cf_persp_cs_acd ?? undefined,
      cf_persp_cc_acd: report?.cf_persp_cc_acd ?? undefined,
      cf_persp_cs_alk: report?.cf_persp_cs_alk ?? undefined,
      cf_persp_cc_alk: report?.cf_persp_cc_alk ?? undefined,

      pilling_min: report?.pilling_min ?? undefined,
      pilling_max: report?.pilling_max ?? undefined,

      bursting_strength_kpa: report?.bursting_strength_kpa ?? undefined,

      ph_min: report?.ph_min ? Number(report.ph_min) : undefined,
      ph_max: report?.ph_max ? Number(report.ph_max) : undefined,

      cf_dye_transfer: report?.cf_dye_transfer ?? undefined,

      fabric_r_dia: report?.fabric_r_dia ?? undefined,
      fabric_f_dia: report?.fabric_f_dia ?? undefined,
      fabric_r_gsm: report?.fabric_r_gsm ?? undefined,
      fabric_f_gsm: report?.fabric_f_gsm ?? undefined,
    },
  });

  const buyerId = useWatch({ control: form.control, name: "buyerId" }) ?? "";

  useEffect(() => {
    const getBuyer = async () => {
      const res = await fetch(`/api/buyer/${buyerId}`);

      if (res.ok) {
        const data = await res.json();
        setBuyer(data ?? null);
      }
    };

    if (!report) getBuyer();
    // if (report) setBuyer(report.buyer as Buyer);
  }, [buyerId, report]);

  const [failPortions, setFailPortions] = useState<(keyof Buyer)[]>([]);

  const onPreviewSubmit = async (payload: ReportFormType) => {
    if (buyer) {
      const fails: (keyof Buyer)[] = [];

      // check ds_wash_length_min
      if (Number(payload.ds_wash_length_min) < buyer?.ds_wash_length_min) {
        fails.push("ds_wash_length_min");
      }

      // check ds_wash_length_max
      if (Number(payload.ds_wash_length_max) > buyer?.ds_wash_length_max) {
        fails.push("ds_wash_length_max");
      }

      // check ds_wash_width_min
      if (Number(payload.ds_wash_width_min) < buyer?.ds_wash_width_min) {
        fails.push("ds_wash_width_min");
      }

      // check ds_wash_width_max
      if (Number(payload.ds_wash_width_max) > buyer?.ds_wash_width_max) {
        fails.push("ds_wash_width_max");
      }

      // check spirality_max
      if (
        buyer?.spirality_max &&
        payload.spirality_max &&
        payload.spirality_max > buyer?.spirality_max
      ) {
        fails.push("spirality_max");
      }

      // check pilling_min
      if (
        buyer?.pilling_min &&
        payload.pilling_min &&
        payload.pilling_min < buyer?.pilling_min
      ) {
        fails.push("pilling_min");
      }

      // check pilling_max
      if (
        buyer?.pilling_max &&
        payload.pilling_max &&
        payload.pilling_max > buyer?.pilling_max
      ) {
        fails.push("pilling_max");
      }

      // check ph_min
      if (
        buyer?.ph_min &&
        payload.ph_min &&
        payload.ph_min < Number(buyer?.ph_min)
      ) {
        fails.push("ph_min");
      }

      // check ph_max
      if (
        buyer?.ph_max &&
        payload.ph_max &&
        payload.ph_max > Number(buyer?.ph_max)
      ) {
        fails.push("ph_max");
      }

      // check cf_wash_cs
      if (
        buyer?.cf_wash_cs &&
        payload.cf_wash_cs &&
        payload.cf_wash_cs > buyer?.cf_wash_cs
      ) {
        fails.push("cf_wash_cs");
      }

      // check cf_wash_cc
      if (
        buyer?.cf_wash_cc &&
        payload.cf_wash_cc &&
        payload.cf_wash_cc > buyer?.cf_wash_cc
      ) {
        fails.push("cf_wash_cc");
      }

      // check cf_rub_dry
      if (
        buyer?.cf_rub_dry &&
        payload.cf_rub_dry &&
        payload.cf_rub_dry > buyer?.cf_rub_dry
      ) {
        fails.push("cf_rub_dry");
      }

      // check cf_rub_wet
      if (
        buyer?.cf_rub_wet &&
        payload.cf_rub_wet &&
        payload.cf_rub_wet > buyer?.cf_rub_wet
      ) {
        fails.push("cf_rub_wet");
      }

      // check cf_water_cs
      if (
        buyer?.cf_water_cs &&
        payload.cf_water_cs &&
        payload.cf_water_cs > buyer?.cf_water_cs
      ) {
        fails.push("cf_water_cs");
      }

      // check cf_water_cc
      if (
        buyer?.cf_water_cc &&
        payload.cf_water_cc &&
        payload.cf_water_cc > buyer?.cf_water_cc
      ) {
        fails.push("cf_water_cc");
      }

      // check cf_persp_cs_acd
      if (
        buyer?.cf_persp_cs_acd &&
        payload.cf_persp_cs_acd &&
        payload.cf_persp_cs_acd > buyer?.cf_persp_cs_acd
      ) {
        fails.push("cf_persp_cs_acd");
      }

      // check cf_persp_cc_acd
      if (
        buyer?.cf_persp_cc_acd &&
        payload.cf_persp_cc_acd &&
        payload.cf_persp_cc_acd > buyer?.cf_persp_cc_acd
      ) {
        fails.push("cf_persp_cc_acd");
      }

      // check cf_persp_cs_alk
      if (
        buyer?.cf_persp_cs_alk &&
        payload.cf_persp_cs_alk &&
        payload.cf_persp_cs_alk > buyer?.cf_persp_cs_alk
      ) {
        fails.push("cf_persp_cs_alk");
      }

      // check cf_persp_cc_alk
      if (
        buyer?.cf_persp_cc_alk &&
        payload.cf_persp_cc_alk &&
        payload.cf_persp_cc_alk > buyer?.cf_persp_cc_alk
      ) {
        fails.push("cf_persp_cc_alk");
      }

      // check cf_dye_transfer
      if (
        buyer?.cf_dye_transfer &&
        payload.cf_dye_transfer &&
        payload.cf_dye_transfer > buyer?.cf_dye_transfer
      ) {
        fails.push("cf_dye_transfer");
      }

      // check bursting_strength_kpa
      if (
        buyer?.bursting_strength_kpa &&
        payload.bursting_strength_kpa &&
        payload.bursting_strength_kpa > buyer?.bursting_strength_kpa
      ) {
        fails.push("bursting_strength_kpa");
      }

      // check fabric_r_dia
      if (
        buyer?.fabric_r_dia &&
        payload.fabric_r_dia &&
        payload.fabric_r_dia > buyer?.fabric_r_dia
      ) {
        fails.push("fabric_r_dia");
      }

      // check fabric_f_dia
      if (
        buyer?.fabric_f_dia &&
        payload.fabric_f_dia &&
        payload.fabric_f_dia > buyer?.fabric_f_dia
      ) {
        fails.push("fabric_f_dia");
      }

      // check fabric_r_gsm
      if (
        buyer?.fabric_r_gsm &&
        payload.fabric_r_gsm &&
        payload.fabric_r_gsm > buyer?.fabric_r_gsm
      ) {
        fails.push("fabric_r_gsm");
      }

      // check fabric_f_gsm
      if (
        buyer?.fabric_f_gsm &&
        payload.fabric_f_gsm &&
        payload.fabric_f_gsm > buyer?.fabric_f_gsm
      ) {
        fails.push("fabric_f_gsm");
      }

      console.log(fails);

      setFailPortions(fails);
      setReportData(payload);
    }
  };

  const getBuyerValue = (key: keyof Buyer) => {
    if (!buyer) return null;
    const value = buyer[key];
    if (value == null || value == undefined) return null;
    return ` (${buyer[key]})`;
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onPreviewSubmit)}
          className="space-y-4 mt-6 mx-auto max-w-4xl "
        >
          {/* buyer */}
          <FormField
            control={form.control}
            name="buyerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buyer</FormLabel>

                <Select
                  onValueChange={(e) => field.onChange(e)}
                  defaultValue={field.value}
                  required
                  disabled={!!report}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a buyer" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {report ? (
                      <SelectItem value={buyer?.id ?? ""}>
                        {buyer?.title}
                      </SelectItem>
                    ) : (
                      buyers.map((x) => (
                        <SelectItem key={x.id} value={x.id}>
                          {x.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* date */}
          <FormField
            control={form.control}
            name="sample_receive_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Receive Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
                    type="datetime-local"
                    required
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* report related */}
          <FromGroupWrapper text="Report Related">
            {/* status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(Number(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {reportStatusList.map((x) => (
                        <SelectItem key={x.value} value={String(x.value)}>
                          {x.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* sample type */}
            <FormField
              control={form.control}
              name="sample_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Type</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseFloat(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {/* <SelectItem value={"undefined"}>None</SelectItem> */}

                      {reportSampleList.map((x) => (
                        <SelectItem key={x.value} value={String(x.value)}>
                          {x.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* sample stage */}
            <FormField
              control={form.control}
              name="sample_stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Stage</FormLabel>

                  <Select
                    onValueChange={(e) => field.onChange(parseFloat(e))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {/* <SelectItem value={"undefined"}>None</SelectItem> */}

                      {reportSampleStageList.map((x) => (
                        <SelectItem key={x.value} value={String(x.value)}>
                          {x.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* roll no */}
            <FormField
              control={form.control}
              name="roll_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
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

            {/* order number */}
            <FormField
              control={form.control}
              name="order_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number</FormLabel>
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

            {/* batch number */}
            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>
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

            {/* fabric type */}
            <FormField
              control={form.control}
              name="fabric_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fabric Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* remarks */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FromGroupWrapper>

          {/* Dimensional stability to Wash */}
          <FromGroupWrapper text={"Dimensional stability to Wash"}>
            <FormField
              control={form.control}
              name="ds_wash_length_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Length Minimum
                    {getBuyerValue("ds_wash_length_min")}
                  </FormLabel>
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
                  <FormLabel>
                    Length Maximum
                    {getBuyerValue("ds_wash_length_max")}
                  </FormLabel>
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
                  <FormLabel>
                    Width Minimum
                    {getBuyerValue("ds_wash_width_min")}
                  </FormLabel>
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
                  <FormLabel>
                    Width Maximum
                    {getBuyerValue("ds_wash_length_max")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* spirality, bursting strength, cf to dye transfer */}
          <FromGroupWrapper noBg text="">
            {/* spirality */}
            <FormField
              control={form.control}
              name="spirality_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Spirality Maximum
                    {getBuyerValue("spirality_max")}
                  </FormLabel>
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

            {/* bursting_strength_kpa */}
            <FormField
              control={form.control}
              name="bursting_strength_kpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bursting Strength (KPA)
                    {getBuyerValue("bursting_strength_kpa")}
                  </FormLabel>
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

            {/* bursting_strength_kpa */}
            <FormField
              control={form.control}
              name="cf_dye_transfer"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>
                    CF to Dye Transfer
                    {getBuyerValue("cf_dye_transfer")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* cf to wash */}
          <FromGroupWrapper text="CF to Wash">
            <FormField
              control={form.control}
              name="cf_wash_cs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CS
                    {getBuyerValue("cf_wash_cs")}
                  </FormLabel>
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
              name="cf_wash_cc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CC
                    {getBuyerValue("cf_wash_cc")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* cf to rub */}
          <FromGroupWrapper text="CF to Rub">
            <FormField
              control={form.control}
              name="cf_rub_dry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dry
                    {getBuyerValue("cf_rub_dry")}
                  </FormLabel>
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
              name="cf_rub_wet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Wet
                    {getBuyerValue("cf_rub_wet")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* cf to water */}
          <FromGroupWrapper text="CF to Water">
            <FormField
              control={form.control}
              name="cf_water_cs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CS
                    {getBuyerValue("cf_water_cs")}
                  </FormLabel>
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
              name="cf_water_cc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CC
                    {getBuyerValue("cf_water_cc")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* cf to perspiration */}
          <FromGroupWrapper text="CF to Perspiration">
            <FormField
              control={form.control}
              name="cf_persp_cs_acd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CS ACD
                    {getBuyerValue("cf_persp_cs_acd")}
                  </FormLabel>
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
              name="cf_persp_cc_acd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CC ACD
                    {getBuyerValue("cf_persp_cc_acd")}
                  </FormLabel>
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
              name="cf_persp_cs_alk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CS ALK
                    {getBuyerValue("cf_persp_cs_alk")}
                  </FormLabel>
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
              name="cf_persp_cc_alk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CC ALK
                    {getBuyerValue("cf_persp_cc_alk")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* pilling */}
          <FromGroupWrapper text="Pilling">
            <FormField
              control={form.control}
              name="pilling_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Minimum
                    {getBuyerValue("pilling_min")}
                  </FormLabel>
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
              name="pilling_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Maximum
                    {getBuyerValue("pilling_max")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* ph level */}
          <FromGroupWrapper text="PH Level">
            <FormField
              control={form.control}
              name="ph_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Minimum
                    {getBuyerValue("ph_min")}
                  </FormLabel>
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
                  <FormLabel>
                    Maximum
                    {getBuyerValue("ph_max")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* fabric dia */}
          <FromGroupWrapper text="Fabric Dia">
            <FormField
              control={form.control}
              name="fabric_r_dia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    R. Dia
                    {getBuyerValue("fabric_r_dia")}
                  </FormLabel>
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
                  <FormLabel>
                    F. Dia
                    {getBuyerValue("fabric_f_dia")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* fabric weight */}
          <FromGroupWrapper text="Fabric Weight">
            <FormField
              control={form.control}
              name="fabric_r_gsm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    R. GSM
                    {getBuyerValue("fabric_r_gsm")}
                  </FormLabel>
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
                  <FormLabel>
                    F. GSM
                    {getBuyerValue("fabric_f_gsm")}
                  </FormLabel>
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
          </FromGroupWrapper>

          {/* submit */}
          <div className="flex justify-center">
            <Button type="submit" className="w-full max-w-md">
              Preview
            </Button>
          </div>
        </form>
      </Form>

      {/* show errors */}
      {/* <div className="border p-2 mt-4">
        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
      </div> */}

      {/* show details */}
      <Dialog
        open={!!reportData}
        onOpenChange={() => {
          setReportData(null);
          setFailPortions([]);
        }}
      >
        <DialogContent
          className="!max-w-4xl"
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {reportData && buyer && (
            <FormPreviewContent
              report={report}
              formData={reportData}
              buyer={buyer}
              failPortions={failPortions}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
