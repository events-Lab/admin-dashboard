"use client";

import { Button, PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  CategoryForm,
  formValuesToCategoryPatch,
} from "@/components/forms";
import {
  categoriesStore,
  nowLabel,
  productsStore,
  useCollection,
} from "@/lib/crm";

export function EditCategoryView({ id }: { id: string }) {
  const router = useRouter();
  const { get, update, ready } = useCollection(categoriesStore);
  const products = useCollection(productsStore);
  const category = get(id);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!category) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="CRM"
          title="Category not found"
          description={`No category matches id “${id}”.`}
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/categories")}
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
        title={`Edit · ${category.name}`}
        description="Update the category. Renaming it updates products that use this name."
      />
      <CategoryForm
        initial={category}
        submitLabel="Save changes"
        onCancel={() => router.push(`/categories/${category.id}`)}
        onSubmit={(values) => {
          const patch = formValuesToCategoryPatch(values);
          const previousName = category.name;
          const stamp = nowLabel();
          update(category.id, { ...patch, updatedAt: stamp.slice(0, 10) });
          if (patch.name !== previousName) {
            for (const product of products.items) {
              if (product.category === previousName) {
                products.update(product.id, {
                  category: patch.name,
                  updatedAt: stamp,
                });
              }
            }
          }
          toast({ title: "Category saved", description: patch.name });
          router.push(`/categories/${category.id}`);
        }}
      />
    </div>
  );
}
