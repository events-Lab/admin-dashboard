"use client";

import { PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  formValuesToProductPatch,
  ProductForm,
} from "@/components/forms";
import { newId, nowLabel, productsStore, useCollection } from "@/lib/crm";

export default function NewProductPage() {
  const router = useRouter();
  const { create } = useCollection(productsStore);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="New product"
        description="Add a padel marketplace product to the catalog."
      />
      <ProductForm
        submitLabel="Create product"
        onCancel={() => router.push("/products")}
        onSubmit={(values) => {
          const stamp = nowLabel();
          const created = create({
            id: newId("prd"),
            ...formValuesToProductPatch(values),
            createdAt: stamp,
            updatedAt: stamp,
          });
          toast({ title: "Product created", description: values.name });
          router.push(`/products/${created.id}`);
        }}
      />
    </div>
  );
}
