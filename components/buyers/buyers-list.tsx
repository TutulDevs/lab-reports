import { buttonVariants } from "@/components/ui/button";
import { getServerBuyersAll } from "@/lib/fetcher";
import { cn, dateFormatter } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeaderSection } from "@/components/page-header";

export const BuyersList = async () => {
  const buyers = await getServerBuyersAll();

  return (
    <>
      <PageHeaderSection
        title={"List of Buyers"}
        subtitle={`Total: ${buyers?.length ?? 0}`}
      >
        <Link href={"/buyers/create"} className={cn(buttonVariants())}>
          Create Buyer
        </Link>
      </PageHeaderSection>

      <Table className="max-w-7xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Modified by</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {buyers?.map((buyer) => {
            return (
              <TableRow key={buyer.id}>
                <TableCell className="font-medium">{buyer.title}</TableCell>
                <TableCell>
                  {dateFormatter(buyer.createdAt, "dd MMM yyyy")}
                </TableCell>
                <TableCell className="font-medium">
                  {buyer.lastUpdatedBy.username}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link
                    href={"/buyers/" + buyer.id}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Details
                  </Link>

                  <Link
                    href={"/buyers/edit/" + buyer.id}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
