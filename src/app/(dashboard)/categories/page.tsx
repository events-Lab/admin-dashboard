"use client";

import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  PageHeader,
  toast,
  type DataTableColumn,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  IconButton,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icon-button";
import type { CategoryRecord, CategoryStatus } from "@/lib/data/categories";
import { categoriesStore, productsStore, useCollection } from "@/lib/crm";

const statusTone: Record<CategoryStatus, "success" | "neutral"> = {
  active: "success",
  archived: "neutral",
};

export default function CategoriesPage() {
  const router = useRouter();
  const { items: categories, remove } = useCollection(categoriesStore);
  const { items: products } = useCollection(productsStore);
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | "all">(
    "all",
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const productCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      if (!product.category) continue;
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const rows = useMemo(() => {
    if (statusFilter === "all") return categories;
    return categories.filter((category) => category.status === statusFilter);
  }, [categories, statusFilter]);

  const columns: DataTableColumn<CategoryRecord>[] = [
    {
      key: "name",
      header: "Category",
      cell: (row) => (
        <div>
          <p className="m-0 font-semibold text-secondary-900">{row.name}</p>
          <p className="m-0 mt-0.5 text-xs text-secondary-500">{row.id}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => row.description || "—",
    },
    {
      key: "products",
      header: "Products",
      cell: (row) => String(productCount.get(row.name) ?? 0),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      className: "whitespace-nowrap",
      cell: (row) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            label={`Edit ${row.name}`}
            onClick={() => router.push(`/categories/${row.id}/edit`)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            label={`Delete ${row.name}`}
            tone="danger"
            onClick={() => setDeleteId(row.id)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const filters: Array<CategoryStatus | "all"> = ["all", "active", "archived"];
  const pendingDelete = categories.find((category) => category.id === deleteId);
  const pendingCount = pendingDelete
    ? (productCount.get(pendingDelete.name) ?? 0)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Categories"
        description="Create, edit, and delete marketplace categories used on products."
        actions={
          <Button
            type="button"
            className="gap-1.5"
            onClick={() => router.push("/categories/new")}
          >
            <PlusIcon />
            New category
          </Button>
        }
      />
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            type="button"
            variant={statusFilter === filter ? "primary" : "secondary"}
            onClick={() => setStatusFilter(filter)}
          >
            {filter === "all" ? "All" : filter}
          </Button>
        ))}
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/categories/${row.id}`)}
        emptyTitle="No categories"
        emptyDescription="Create a category before assigning products to it."
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete category?"
        description={
          pendingDelete
            ? pendingCount > 0
              ? `This removes “${pendingDelete.name}”. ${pendingCount} product${pendingCount === 1 ? "" : "s"} will keep that name until you reassign them.`
              : `This will permanently remove “${pendingDelete.name}”.`
            : undefined
        }
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id);
            toast({ title: "Category deleted", description: pendingDelete.name });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
