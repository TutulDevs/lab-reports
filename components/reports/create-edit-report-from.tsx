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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  commonValuesList,
  reportSampleList,
  reportSampleStageList,
  reportStatusList,
} from "@/lib/corearrays";
import { createReportSchema, updateReportSchema } from "@/lib/schemas";
import {
  BuyersForReport,
  ReportSampleStage,
  ReportSampleType,
  ReportStatus,
} from "@/lib/coreconstants";
import { FromGroupWrapper } from "../form-group-wrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { dateFormatter } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type CreateSchemaType = z.infer<typeof createReportSchema>;
type UpdateSchemaType = z.infer<typeof updateReportSchema>;

type FormType = CreateSchemaType | UpdateSchemaType;

export const CreateOrEditReportForm: React.FC<{
  report?: Report;
  buyers: BuyersForReport[];
}> = ({ report, buyers }) => {
  const router = useRouter();

  const [buyer, setBuyer] = useState<null | Buyer>(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<null | FormType>(null);

  const btnText = {
    default: report ? "Update" : "Create",
    loading: report ? "Updating..." : "Creating...",
  };

  const schema = report ? updateReportSchema : createReportSchema;

  const form = useForm<FormType>({
    // @ts-expect-error itzok
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      id: report?.id ?? "",
      buyerId: report?.buyerId ?? "",

      // report related
      sample_receive_date: report?.sample_receive_date ?? new Date(),
      report_id:
        report?.report_id ?? `TIL-${dateFormatter(new Date(), "yyyyMMdd")}-`,
      status: report?.status ?? ReportStatus.IN_PROGRESS,
      sample_type: report?.sample_type ?? ReportSampleType.FABRIC,
      sample_stage: report?.sample_stage ?? ReportSampleStage.A_STENTER,
      order_number: report?.order_number,
      batch_number: report?.batch_number,
      color: report?.color ?? "",
      fabric_type: report?.fabric_type ?? "",
      roll_number: report?.roll_number,
      remarks: report?.remarks ?? "",

      // for buyer req
      ds_wash_length_min: report?.ds_wash_length_min,
      ds_wash_length_max: report?.ds_wash_length_max,
      ds_wash_width_min: report?.ds_wash_length_min,
      ds_wash_width_max: report?.ds_wash_length_max,

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

      piling_min: report?.piling_min ?? undefined,
      piling_max: report?.piling_max ?? undefined,

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

  const buyerId = useWatch({ control: form.control, name: "buyerId" });

  useEffect(() => {
    const getBuyer = async () => {
      const res = await fetch(`/api/buyer/${buyerId ?? ""}`);

      if (res.ok) {
        const data = await res.json();
        setBuyer(data ?? null);
      }
    };

    getBuyer();
  }, [buyerId]);

  const onPreviewSubmit = async (payload: FormType) => {
    setReportData(payload);
  };

  const onSubmit = async (payload: FormType) => {
    try {
      setLoading(true);
      console.table(payload);

      // const res = await fetch("/api/buyer", {
      //   method: buyer ? "PUT" : "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // const status = res.status;
      // const data = await res.json();
      // const buyerData: Buyer = data.buyer;

      // // console.log("res:", status, res);
      // // console.log("data:", data);

      // if (data?.success) {
      //   toast.success(
      //     data?.message || `Successfully ${buyer ? "updated" : "created"}`,
      //   );

      //   router.push(`/buyers/${buyerData.id}`);
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
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a buyer" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {buyers.map((x) => (
                      <SelectItem key={x.id} value={x.id}>
                        {x.title}
                      </SelectItem>
                    ))}
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
                    {buyer && ` (${buyer.ds_wash_length_min})`}
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
                    {buyer && ` (${buyer.ds_wash_length_max})`}
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
                    {buyer && ` (${buyer.ds_wash_width_min})`}
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
                    {buyer && ` (${buyer.ds_wash_length_max})`}
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

          {/* submit */}
          <div className="flex justify-center">
            <Button type="submit" className="w-full max-w-md">
              Preview
            </Button>
          </div>
        </form>
      </Form>

      {/* show errors */}
      <div className="border p-2 mt-4">
        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
      </div>

      {/* show details */}
      <Dialog open={!!reportData} onOpenChange={() => setReportData(null)}>
        <DialogContent
          className="!max-w-6xl-"
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>

          <DialogDescription className="mt-4">
            {reportData &&
              Object.keys(reportData).map((x) => (
                <p key={x} className="pb- font-medium">
                  {/* @ts-expect-error obj */}
                  {x + ": " + (reportData[x] ?? "")}
                </p>
              ))}
          </DialogDescription>

          <DialogFooter>
            <Button
              className="w-full max-w-md mx-auto"
              disabled={loading}
              onClick={() => {
                reportData && onSubmit(reportData);
              }}
            >
              {loading ? btnText.loading : btnText.default}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
