import { CreateOrEditBuyerForm } from "@/components/buyers/create-or-edit-buyer-form";
import { PageHeaderSection } from "@/components/page-header";

export default async function CreateBuyerPage() {
  return (
    <>
      <PageHeaderSection
        title={"Create A Buyer"}
        subtitle={"Fill the form to create a buyer with the requirements."}
      />

      <CreateOrEditBuyerForm />
    </>
  );
}
