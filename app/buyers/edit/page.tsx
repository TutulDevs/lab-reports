import { redirect, RedirectType } from "next/navigation";

export default async function BuyersPage() {
  redirect("/buyers", RedirectType.push);

  return <></>;
}
