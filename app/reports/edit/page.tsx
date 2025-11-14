import { redirect, RedirectType } from "next/navigation";

export default async function ReportsPage() {
  redirect("/reports", RedirectType.push);

  return <></>;
}
