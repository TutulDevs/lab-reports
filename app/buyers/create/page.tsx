import { CreateOrEditBuyerForm } from "@/components/buyers/create-or-edit-buyer-form";

export default async function CreateBuyerPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <h1 className="text-lg md:text-3xl mb-2">Create A Buyer</h1>
          <p>Fill the form to create a buyer with the requirements.</p>
        </div>
      </div>

      <hr className="my-4" />

      <CreateOrEditBuyerForm />
    </div>
  );
}
