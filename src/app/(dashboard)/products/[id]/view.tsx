"use client";

import {
  AvailabilityBadge,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DetailList,
  ImageGallery,
  mediaUrls,
  PageHeader,
  getProductAvailability,
  toast,
  toEgpLabel,
  type ProductStatus,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export function ProductDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { get, remove, ready } = useCollection(productsStore);
  const product = get(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Products"
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

  const stock = getProductAvailability(product);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Product detail"
        title={product.name}
        description={product.blurb}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/products")}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/products/${product.id}/edit`)}
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
        {product.status ? (
          <Badge tone={statusTone[product.status]}>
            {product.status.replaceAll("_", " ")}
          </Badge>
        ) : null}
        {product.category ? (
          <Badge tone="neutral">{product.category}</Badge>
        ) : null}
        <AvailabilityBadge
          available={stock.available}
          soldOut={stock.soldOut}
          kind="items"
        />
        <Badge tone="info">{product.sku ?? product.id}</Badge>
      </div>

      <ImageGallery
        images={mediaUrls(product)}
        alt={product.name}
        emptyLabel={product.imageLabel ?? product.category ?? "No images"}
        aspectClassName="aspect-[4/5] max-h-[420px]"
      />

      <DetailList
        title="Catalog details"
        fields={[
          { label: "SKU", value: product.sku ?? "—" },
          { label: "Brand", value: product.brand ?? "—" },
          { label: "Category", value: product.category ?? "—" },
          { label: "Price", value: toEgpLabel(product.priceLabel) },
          {
            label: "Available items",
            value: String(stock.available),
          },
          { label: "Availability note", value: product.stockHint ?? "—" },
          {
            label: "Rating",
            value:
              product.rating != null
                ? `${product.rating.toFixed(1)} (${product.reviewCount ?? 0} reviews)`
                : "—",
          },
          { label: "Created", value: product.createdAt ?? "—" },
          { label: "Updated", value: product.updatedAt ?? "—" },
          {
            label: "Status",
            value: product.status?.replaceAll("_", " ") ?? "—",
          },
        ]}
      />

      <Card title="Description">
        <p className="m-0 text-sm leading-normal text-secondary-700">
          {product.description ?? product.blurb}
        </p>
      </Card>

      <Card title="Internal notes">
        <p className="m-0 text-sm leading-normal text-secondary-700">
          {product.notes?.trim() ? product.notes : "No notes."}
        </p>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete product?"
        description={`This will permanently remove “${product.name}”.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          toast({ title: "Product deleted", description: product.name });
          remove(product.id);
          router.push("/products");
        }}
      />
    </div>
  );
}
