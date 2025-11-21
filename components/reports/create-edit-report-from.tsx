"use client";

import { Buyer, Report } from "@prisma/client";
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
  getBuyerValue,
  reportSampleList,
  reportSampleStageList,
  reportStatusList,
} from "@/lib/corearrays";
import { createReportSchema, updateReportSchema } from "@/lib/schemas";
import {
  BuyersForReport,
  BuyerWithUser,
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
  const [buyer, setBuyer] = useState<null | BuyerWithUser>(
    (report?.buyer as BuyerWithUser) ?? null,
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
      order_number: report?.order_number,
      batch_number: report?.batch_number,
      color: report?.color ?? "",
      fabric_type: report?.fabric_type ?? "",
      roll_number: report?.roll_number,
      remarks: report?.remarks ?? "",

      result: report?.result ?? ReportOverallResult.PENDING,
      fail_portions: report?.fail_portions ?? "",

      // for buyer req
      ds_wash_length: report?.ds_wash_length,
      ds_wash_width: report?.ds_wash_width,

      spirality_max: report?.spirality_max ?? undefined,
      pilling: report?.pilling ?? undefined,
      ph: report?.ph ? Number(report?.ph) : undefined,
      bursting_strength_kpa: report?.bursting_strength_kpa ?? undefined,
      gsm: report?.gsm ?? undefined,

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

      cf_dye_transfer: report?.cf_dye_transfer ?? undefined,
      cc_dye_transfer: report?.cc_dye_transfer ?? undefined,

      fabric_r_dia: report?.fabric_r_dia ?? undefined,
      fabric_f_dia: report?.fabric_f_dia ?? undefined,
      fabric_r_gsm: report?.fabric_r_gsm ?? undefined,
      fabric_f_gsm: report?.fabric_f_gsm ?? undefined,
    },
  });

  const buyerId = useWatch({ control: form.control, name: "buyerId" }) ?? "";
  const burstingRules = (buyer?.burstingRules ?? []).sort(
    (a, b) => a.gsm - b.gsm,
  );

  // console.log("buyer: ", buyerId, burstingRules);

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

  const [failPortions, setFailPortions] = useState<(keyof Report)[]>([]);

  const onPreviewSubmit = async (payload: ReportFormType) => {
    if (buyer) {
      const fails: (keyof Report)[] = [];

      // check ds_wash_length
      if (
        Number(payload.ds_wash_length) < Number(buyer?.ds_wash_length_min) ||
        Number(payload.ds_wash_length) > Number(buyer?.ds_wash_length_max)
      ) {
        fails.push("ds_wash_length");
      }

      // check ds_wash_width
      if (
        Number(payload.ds_wash_width) < Number(buyer?.ds_wash_width_min) ||
        Number(payload.ds_wash_width) > Number(buyer?.ds_wash_width_max)
      ) {
        fails.push("ds_wash_width");
      }

      // check spirality_max
      if (
        buyer?.spirality_max &&
        payload?.spirality_max &&
        Number(payload?.spirality_max) > Number(buyer?.spirality_max)
      ) {
        fails.push("spirality_max");
      }

      // check pilling
      const isPillingLess =
        buyer?.pilling_min &&
        payload?.pilling &&
        Number(payload?.pilling) < Number(buyer?.pilling_min);
      const isPillingMore =
        buyer?.pilling_max &&
        payload?.pilling &&
        Number(payload?.pilling) > Number(buyer?.pilling_max);
      if (isPillingLess || isPillingMore) {
        fails.push("pilling");
      }

      // check ph_min NOT-DONE
      const isPhLess =
        buyer?.ph_min &&
        payload?.ph &&
        Number(payload?.ph) < Number(buyer?.ph_min);
      const isPhMore =
        buyer?.ph_max &&
        payload?.ph &&
        Number(payload?.ph) > Number(buyer?.ph_max);
      if (isPhLess || isPhMore) {
        fails.push("ph");
      }

      // check cf_wash_cs
      if (
        buyer?.cf_wash_cs &&
        payload.cf_wash_cs &&
        Number(payload.cf_wash_cs) < Number(buyer?.cf_wash_cs)
      ) {
        fails.push("cf_wash_cs");
      }

      // check cf_wash_cc
      if (
        buyer?.cf_wash_cc &&
        payload.cf_wash_cc &&
        Number(payload.cf_wash_cc) < Number(buyer?.cf_wash_cc)
      ) {
        fails.push("cf_wash_cc");
      }

      // check cf_rub_dry
      if (
        buyer?.cf_rub_dry &&
        payload.cf_rub_dry &&
        Number(payload.cf_rub_dry) < Number(buyer?.cf_rub_dry)
      ) {
        fails.push("cf_rub_dry");
      }

      // check cf_rub_wet
      if (
        buyer?.cf_rub_wet &&
        payload.cf_rub_wet &&
        Number(payload.cf_rub_wet) < Number(buyer?.cf_rub_wet)
      ) {
        fails.push("cf_rub_wet");
      }

      // check cf_water_cs
      if (
        buyer?.cf_water_cs &&
        payload.cf_water_cs &&
        Number(payload.cf_water_cs) < Number(buyer?.cf_water_cs)
      ) {
        fails.push("cf_water_cs");
      }

      // check cf_water_cc
      if (
        buyer?.cf_water_cc &&
        payload.cf_water_cc &&
        Number(payload.cf_water_cc) < Number(buyer?.cf_water_cc)
      ) {
        fails.push("cf_water_cc");
      }

      // check cf_persp_cs_acd
      if (
        buyer?.cf_persp_cs_acd &&
        payload.cf_persp_cs_acd &&
        Number(payload.cf_persp_cs_acd) < Number(buyer?.cf_persp_cs_acd)
      ) {
        fails.push("cf_persp_cs_acd");
      }

      // check cf_persp_cc_acd
      if (
        buyer?.cf_persp_cc_acd &&
        payload.cf_persp_cc_acd &&
        Number(payload.cf_persp_cc_acd) < Number(buyer?.cf_persp_cc_acd)
      ) {
        fails.push("cf_persp_cc_acd");
      }

      // check cf_persp_cs_alk
      if (
        buyer?.cf_persp_cs_alk &&
        payload.cf_persp_cs_alk &&
        Number(payload.cf_persp_cs_alk) < Number(buyer?.cf_persp_cs_alk)
      ) {
        fails.push("cf_persp_cs_alk");
      }

      // check cf_persp_cc_alk
      if (
        buyer?.cf_persp_cc_alk &&
        payload.cf_persp_cc_alk &&
        Number(payload.cf_persp_cc_alk) < Number(buyer?.cf_persp_cc_alk)
      ) {
        fails.push("cf_persp_cc_alk");
      }

      // check cf_dye_transfer
      if (
        buyer?.cf_dye_transfer &&
        payload.cf_dye_transfer &&
        Number(payload.cf_dye_transfer) < Number(buyer?.cf_dye_transfer)
      ) {
        fails.push("cf_dye_transfer");
      }

      // check cc_dye_transfer
      if (
        buyer?.cc_dye_transfer &&
        payload.cc_dye_transfer &&
        Number(payload.cc_dye_transfer) < Number(buyer?.cc_dye_transfer)
      ) {
        fails.push("cc_dye_transfer");
      }

      // check bursting_strength_kpa
      if (payload.bursting_strength_kpa && burstingRules.length > 0) {
        const gsm = Number(payload?.gsm);
        const ruleIdx = burstingRules.findIndex((x) => x.gsm >= gsm);
        const reqStrength = burstingRules[ruleIdx]?.bursting_strength_kpa;

        // console.log(ruleIdx,burstingRules)

        if (payload.bursting_strength_kpa < reqStrength) {
          fails.push("bursting_strength_kpa");
        }
      }

      // check fabric_r_dia NOT-DONE
      // if (        buyer?.fabric_r_dia &&        payload.fabric_r_dia &&        Number(payload.fabric_r_dia) > Number(buyer?.fabric_r_dia)      ) {        fails.push("fabric_r_dia");      }

      // check fabric_f_dia NOT-DONE
      // if (        buyer?.fabric_f_dia &&        payload.fabric_f_dia &&        Number(payload.fabric_f_dia) > Number(buyer?.fabric_f_dia)      ) {        fails.push("fabric_f_dia");      }

      // check fabric_r_gsm NOT-DONE
      // if (       buyer?.fabric_r_gsm &&       payload.fabric_r_gsm &&       Number(payload.fabric_r_gsm) > Number(buyer?.fabric_r_gsm)     ) {       fails.push("fabric_r_gsm");     }

      // check fabric_f_gsm NOT-DONE
      // if (buyer?.fabric_f_gsm &&payload.fabric_f_gsm &&Number(payload.fabric_f_gsm) > Number(buyer?.fabric_f_gsm)) {fails.push("fabric_f_gsm");}

      // console.log(fails);
      setFailPortions(fails);
      setReportData(payload);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onPreviewSubmit)}
          className="space-y-4 mt-6 mx-auto max-w-5xl "
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
              name="ds_wash_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Length
                    {getBuyerValue("ds_wash_length", buyer)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter length"
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
              name="ds_wash_width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Width
                    {getBuyerValue("ds_wash_width", buyer)}
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
          </FromGroupWrapper>

          {/* spirality, bursting strength, cf to dye transfer */}
          <FromGroupWrapper noBg text="">
            {/* spirality */}
            <FormField
              control={form.control}
              name="spirality_max"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>
                    Spirality Maximum
                    {getBuyerValue("spirality_max", buyer)}
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

            {/* gsm */}
            <FormField
              control={form.control}
              name="gsm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSM</FormLabel>
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
                    Bursting Strength (kPA)
                    {/* {getBuyerValue("bursting_strength_kpa",buyer)} */}
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

            {/* cf_dye_transfer */}
            <FormField
              control={form.control}
              name="cf_dye_transfer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CF to Dye Transfer
                    {getBuyerValue("cf_dye_transfer", buyer)}
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

            {/* cc_dye_transfer */}
            <FormField
              control={form.control}
              name="cc_dye_transfer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CC to Dye Transfer
                    {getBuyerValue("cc_dye_transfer", buyer)}
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

            {/* pilling */}
            <FormField
              control={form.control}
              name="pilling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pilling
                    {getBuyerValue("pilling", buyer)}
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

            {/* ph */}
            <FormField
              control={form.control}
              name="ph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    pH Level
                    {getBuyerValue("ph", buyer)}
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
                    {getBuyerValue("cf_wash_cs", buyer)}
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
                    {getBuyerValue("cf_wash_cc", buyer)}
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
                    {getBuyerValue("cf_rub_dry", buyer)}
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
                    {getBuyerValue("cf_rub_wet", buyer)}
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
                    {getBuyerValue("cf_water_cs", buyer)}
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
                    {getBuyerValue("cf_water_cc", buyer)}
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
                    {getBuyerValue("cf_persp_cs_acd", buyer)}
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
                    {getBuyerValue("cf_persp_cc_acd", buyer)}
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
                    {getBuyerValue("cf_persp_cs_alk", buyer)}
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
                    {getBuyerValue("cf_persp_cc_alk", buyer)}
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
          <FromGroupWrapper text="Fabrics">
            <FormField
              control={form.control}
              name="fabric_r_dia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    R. Dia
                    {getBuyerValue("fabric_r_dia", buyer)}
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
                    {getBuyerValue("fabric_f_dia", buyer)}
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
              name="fabric_r_gsm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    R. GSM
                    {getBuyerValue("fabric_r_gsm", buyer)}
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
                    {getBuyerValue("fabric_f_gsm", buyer)}
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
