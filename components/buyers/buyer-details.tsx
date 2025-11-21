import { PageHeaderSection } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getServerBuyerDetails } from "@/lib/fetcher";
import { cn, dateFormatter } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListItem, ListItemProps } from "../list-item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reportBuyerCommonFieldsText } from "@/lib/corearrays";
import { BuyerDeleteAction } from "./buyer-actions";

export const BuyerDetails: React.FC<{ buyerId: string }> = async ({
  buyerId,
}) => {
  const buyer = await getServerBuyerDetails(buyerId);

  if (!buyer) {
    notFound();
  }

  const {
    id,
    title,
    createdAt,
    updatedAt,
    userId,
    lastUpdatedBy,
    burstingRules,
    ...restBuyer
  } = buyer;

  const listItemsData: ListItemProps[] = [
    { title: "ID", children: id },
    { title: "Created At", children: dateFormatter(createdAt) },
    { title: "Updated At", children: dateFormatter(updatedAt) },
    { title: "Last Modified By", children: lastUpdatedBy.username },
  ];

  return (
    <>
      <PageHeaderSection title={title}>
        <div className="space-x-2">
          <Link href={"/buyers/edit/" + id} className={cn(buttonVariants())}>
            Edit
          </Link>

          <BuyerDeleteAction buyer={buyer} />
        </div>
      </PageHeaderSection>

      <div className="max-w-2xl mx-auto">
        {/* info */}
        <div className="">
          {listItemsData.map((item, index) => (
            <ListItem
              key={item.title?.toString() || index}
              hideColon={true}
              className={"border-b flex justify-between flex-wrap py-1"}
              {...item}
            />
          ))}
        </div>

        {/* requirements */}
        <div className="text-center text-2xl font-semibold mt-8 mb-2">
          Requirements
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead className="text-end">Requirement</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(restBuyer)?.map((x) => {
              return (
                <TableRow key={x}>
                  <TableCell className="py-1">
                    {reportBuyerCommonFieldsText[x] ?? x}
                  </TableCell>
                  <TableCell className="py-1 text-end">
                    {/* @ts-expect-errors typecasting */}
                    {String(restBuyer[x] ?? "")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {burstingRules?.length == 0 ? null : (
          <>
            <div className="text-center text-2xl font-semibold mt-8 mb-2">
              Bursting Rules
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GSM</TableHead>
                  <TableHead className="text-end">
                    Bursting Strength (KPA)
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {burstingRules?.map((x, idx, arr) => {
                  return (
                    <TableRow key={x.gsm}>
                      <TableCell className="py-1">
                        {idx == 0
                          ? `0 - ${x.gsm}`
                          : `${arr[idx - 1].gsm} - ${x.gsm}`}
                      </TableCell>
                      <TableCell className="py-1 text-end">
                        {String(x.bursting_strength_kpa ?? "")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </>
  );
};
