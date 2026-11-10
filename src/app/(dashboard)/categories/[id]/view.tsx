"use client";

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  DetailList,
  ImageGallery,
  mediaUrls,
  PageHeader,
  toEgpLabel,
  toast,
  type DataTableColumn,
  type ProductItem,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryStatus } from "@/lib/data/categories";
import { categoriesStore, productsStore, useCollection } from "@/lib/crm";

const statusTone: Record<CategoryStatus, "success" | "neutral"> = {
  active: "success",
  archived: "neutral",
};

export function CategoryDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { get, remove, ready } = useCollection(categoriesStore);
  const { items: products } = useCollection(productsStore);
  const category = get(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!category) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Categories"
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

  const assigned = products.filter(
    (product) => product.category === category.name,
  );

  const columns: DataTableColumn<ProductItem>[] = [
    {
      key: "name",
      header: "Product",
      cell: (row) => row.name,
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => toEgpLabel(row.priceLabel),
    },
    {
      key: "stock",
      header: "Available items",
      cell: (row) => String(row.stock ?? 0),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Category detail"
        title={category.name}
        description={category.description || "No description."}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/categories")}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/categories/${category.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={statusTone[category.status]}>{category.status}</Badge>
        <Badge tone="neutral">{assigned.length} products</Badge>
        <Badge tone="info">{category.id}</Badge>
      </div>

      <ImageGallery
        images={mediaUrls(category)}
        alt={category.name}
        emptyLabel="No images"
        aspectClassName="aspect-[16/9] max-h-72"
      />

      <DetailList
        title="Category"
        fields={[
          { label: "Name", value: category.name },
          { label: "Status", value: category.status },
          { label: "Products", value: String(assigned.length) },
          { label: "Images", value: String(mediaUrls(category).length) },
          { label: "Created", value: category.createdAt },
          { label: "Updated", value: category.updatedAt },
        ]}
      />

      <Card title="Products in this category">
        <DataTable
          columns={columns}
          rows={assigned}
          rowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/products/${row.id}`)}
          emptyTitle="No products"
          emptyDescription="Assign this category from a product to see it here."
        />
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete category?"
        description={
          assigned.length > 0
            ? `This removes “${category.name}”. ${assigned.length} product${assigned.length === 1 ? "" : "s"} will keep that name until you reassign them.`
            : `This will permanently remove “${category.name}”.`
        }
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          toast({ title: "Category deleted", description: category.name });
          remove(category.id);
          router.push("/categories");
        }}
      />
    </div>
  );
}
