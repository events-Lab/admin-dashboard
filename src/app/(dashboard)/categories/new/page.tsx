"use client";

import { PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  CategoryForm,
  formValuesToCategoryPatch,
} from "@/components/forms";
import { categoriesStore, newId, nowLabel, useCollection } from "@/lib/crm";

export default function NewCategoryPage() {
  const router = useRouter();
  const { create } = useCollection(categoriesStore);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="New category"
        description="Add a marketplace category that products can be assigned to."
      />
      <CategoryForm
        submitLabel="Create category"
        onCancel={() => router.push("/categories")}
        onSubmit={(values) => {
          const stamp = nowLabel().slice(0, 10);
          const created = create({
            id: newId("cat"),
            ...formValuesToCategoryPatch(values),
            createdAt: stamp,
            updatedAt: stamp,
          });
          toast({ title: "Category created", description: values.name });
          router.push(`/categories/${created.id}`);
        }}
      />
    </div>
  );
}
