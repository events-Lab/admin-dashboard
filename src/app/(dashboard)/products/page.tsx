"use client";

import {
  AvailabilityBadge,
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  PageHeader,
  getProductAvailability,
  toast,
  toEgpLabel,
  type DataTableColumn,
  type ProductItem,
  type ProductStatus,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  IconButton,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icon-button";
import { productsStore, useCollection } from "@/lib/crm";

const statusTone: Record<
  ProductStatus,
  "success" | "neutral" | "warning" | "danger"
> = {
  active: "success",
  draft: "neutral",
  out_of_stock: "warning",
  archived: "danger",
};

export default function ProductsPage() {
  const router = useRouter();
  const { items: products, remove } = useCollection(productsStore);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (statusFilter === "all") return products;
    return products.filter((product) => product.status === statusFilter);
  }, [products, statusFilter]);

  const columns: DataTableColumn<ProductItem>[] = [
    {
      key: "name",
      header: "Product",
      cell: (row) => (
        <div>
          <p className="m-0 font-semibold text-secondary-900">{row.name}</p>
          <p className="m-0 mt-0.5 text-xs text-secondary-500">
            {row.sku ?? row.id}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => row.category ?? "—",
    },
    {
      key: "brand",
      header: "Brand",
      cell: (row) => row.brand ?? "—",
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => toEgpLabel(row.priceLabel),
    },
    {
      key: "stock",
      header: "Availability",
      cell: (row) => {
        const stock = getProductAvailability(row);
        return (
          <AvailabilityBadge
            available={stock.available}
            soldOut={stock.soldOut}
            kind="items"
          />
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) =>
        row.status ? (
          <Badge tone={statusTone[row.status]}>
            {row.status.replaceAll("_", " ")}
          </Badge>
        ) : (
          "—"
        ),
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
            onClick={() => router.push(`/products/${row.id}/edit`)}
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

  const filters: Array<ProductStatus | "all"> = [
    "all",
    "active",
    "draft",
    "out_of_stock",
    "archived",
  ];

  const pendingDelete = products.find((product) => product.id === deleteId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Products"
        description="Create, edit, and delete marketplace catalog items."
        actions={
          <Button
            type="button"
            className="gap-1.5"
            onClick={() => router.push("/products/new")}
          >
            <PlusIcon />
            New product
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
            {filter === "all" ? "All" : filter.replaceAll("_", " ")}
          </Button>
        ))}
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/products/${row.id}`)}
        emptyTitle="No products"
        emptyDescription="Create a product to sell in the marketplace."
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete product?"
        description={
          pendingDelete
            ? `This will permanently remove “${pendingDelete.name}” from the catalog.`
            : undefined
        }
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id);
            toast({ title: "Product deleted", description: pendingDelete.name });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
