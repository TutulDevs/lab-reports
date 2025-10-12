import { CreateOrEditBuyerForm } from "@/components/buyers/create-or-edit-buyer-form";
import { PageHeaderSection } from "@/components/page-header";

export default async function CreateBuyerPage() {
  return (
    <div className="p-6 md:p-10">
      <PageHeaderSection
        title={"Create A Buyer"}
        subtitle={"Fill the form to create a buyer with the requirements."}
      />

      <CreateOrEditBuyerForm />
    </div>
  );
}
