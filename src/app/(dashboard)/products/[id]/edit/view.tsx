"use client";

import { Button, PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  formValuesToProductPatch,
  ProductForm,
} from "@/components/forms";
import { nowLabel, productsStore, useCollection } from "@/lib/crm";

export function EditProductView({ id }: { id: string }) {
  const router = useRouter();
  const { get, update, ready } = useCollection(productsStore);
  const product = get(id);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="CRM"
          title="Product not found"
          description={`No product matches id “${id}”.`}
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/products")}
            >
              Back to table
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title={`Edit · ${product.name}`}
        description="Update catalog fields and save changes."
      />
      <ProductForm
        initial={product}
        submitLabel="Save changes"
        onCancel={() => router.push(`/products/${product.id}`)}
        onSubmit={(values) => {
          update(product.id, {
            ...formValuesToProductPatch(values),
            updatedAt: nowLabel(),
          });
          toast({ title: "Product saved", description: values.name });
          router.push(`/products/${product.id}`);
        }}
      />
    </div>
  );
}
