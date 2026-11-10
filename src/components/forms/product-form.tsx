"use client";

import {
  Card,
  mediaUrls,
  SelectField,
  TextArea,
  TextField,
  formatEgp,
  parseMoney,
  type ProductItem,
  type ProductStatus,
} from "@events-lab/shared-components";
import { useMemo, useState, type FormEvent } from "react";
import { categoriesStore, useCollection } from "@/lib/crm";
import { FormActions } from "./form-actions";
import { ImageUploader } from "./image-uploader";

export type ProductFormValues = {
  name: string;
  blurb: string;
  description: string;
  priceLabel: string;
  stockHint: string;
  sku: string;
  category: string;
  brand: string;
  stock: string;
  status: ProductStatus;
  rating: string;
  reviewCount: string;
  imageLabel: string;
  images: string[];
  notes: string;
};

const emptyValues: ProductFormValues = {
  name: "",
  blurb: "",
  description: "",
  priceLabel: "0",
  stockHint: "",
  sku: "",
  category: "",
  brand: "",
  stock: "0",
  status: "draft",
  rating: "0",
  reviewCount: "0",
  imageLabel: "",
  images: [],
  notes: "",
};

export function productToFormValues(product: ProductItem): ProductFormValues {
  return {
    name: product.name,
    blurb: product.blurb,
    description: product.description ?? "",
    priceLabel: String(parseMoney(product.priceLabel)),
    stockHint: product.stockHint ?? "",
    sku: product.sku ?? "",
    category: product.category ?? "Rackets",
    brand: product.brand ?? "",
    stock: String(product.stock ?? 0),
    status: product.status ?? "draft",
    rating: String(product.rating ?? 0),
    reviewCount: String(product.reviewCount ?? 0),
    imageLabel: product.imageLabel ?? "",
    images: mediaUrls(product),
    notes: product.notes ?? "",
  };
}

export function formValuesToProductPatch(
  values: ProductFormValues,
): Omit<ProductItem, "id" | "createdAt" | "updatedAt"> {
  const stock = Math.max(Math.floor(Number(values.stock) || 0), 0);
  const availabilityNote =
    stock <= 0
      ? "Out of stock"
      : `${stock} item${stock === 1 ? "" : "s"} available`;

  return {
    name: values.name.trim(),
    blurb: values.blurb.trim(),
    description: values.description.trim() || undefined,
    priceLabel: formatEgp(Number(values.priceLabel) || 0),
    stockHint: values.stockHint.trim() || availabilityNote,
    sku: values.sku.trim() || undefined,
    category: values.category.trim() || undefined,
    brand: values.brand.trim() || undefined,
    stock,
    status: values.status,
    rating: Number(values.rating) || 0,
    reviewCount: Number(values.reviewCount) || 0,
    imageLabel: values.imageLabel.trim() || undefined,
    images: values.images.length > 0 ? values.images : undefined,
    imageUrl: values.images[0],
    notes: values.notes.trim() || undefined,
  };
}

export type ProductFormProps = {
  initial?: ProductItem;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(
    initial ? productToFormValues(initial) : emptyValues,
  );
  const [pending, setPending] = useState(false);
  const { items: categories } = useCollection(categoriesStore);

  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    const options = categories
      .filter(
        (category) =>
          category.status === "active" || category.name === values.category,
      )
      .map((category) => {
        names.add(category.name);
        return { value: category.name, label: category.name };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    if (values.category && !names.has(values.category)) {
      options.unshift({
        value: values.category,
        label: values.category,
      });
    }
    return [{ value: "", label: "Select a category" }, ...options];
  }, [categories, values.category]);

  function set<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      await onSubmit(values);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Card title="Product details">
        <div className="grid grid-cols-2 gap-3.5 max-[800px]:grid-cols-1">
          <TextField
            label="Name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <TextField
            label="SKU"
            value={values.sku}
            onChange={(e) => set("sku", e.target.value)}
          />
          <TextField
            label="Brand"
            value={values.brand}
            onChange={(e) => set("brand", e.target.value)}
          />
          <SelectField
            label="Category"
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            options={categoryOptions}
            hint={
              categoryOptions.length <= 1
                ? "Create a category before assigning one."
                : "Choose from Categories."
            }
          />
          <TextField
            label="Price (EGP)"
            type="number"
            min={0}
            step="1"
            required
            value={values.priceLabel}
            onChange={(e) => set("priceLabel", e.target.value)}
            hint="Amount in Egyptian pounds."
          />
          <TextField
            label="Available items"
            type="number"
            min={0}
            step="1"
            required
            value={values.stock}
            onChange={(e) => set("stock", e.target.value)}
            hint="How many units can be sold right now."
          />
          <TextField
            label="Availability note"
            value={values.stockHint}
            onChange={(e) => set("stockHint", e.target.value)}
            placeholder="Optional. Defaults to the item count."
          />
          <SelectField
            label="Status"
            value={values.status}
            onChange={(e) => set("status", e.target.value as ProductStatus)}
            options={[
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "out_of_stock", label: "Out of stock" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <TextField
            label="Rating"
            type="number"
            min={0}
            max={5}
            step="0.1"
            value={values.rating}
            onChange={(e) => set("rating", e.target.value)}
          />
          <TextField
            label="Review count"
            type="number"
            min={0}
            value={values.reviewCount}
            onChange={(e) => set("reviewCount", e.target.value)}
          />
          <TextField
            label="Image label"
            value={values.imageLabel}
            onChange={(e) => set("imageLabel", e.target.value)}
          />
        </div>
        <div className="mt-3.5 flex flex-col gap-3.5">
          <TextField
            label="Short blurb"
            required
            value={values.blurb}
            onChange={(e) => set("blurb", e.target.value)}
          />
          <TextArea
            label="Description"
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <ImageUploader
            images={values.images}
            onChange={(images) => set("images", images)}
          />
          <TextArea
            label="Internal notes"
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </Card>
      <FormActions
        submitLabel={submitLabel}
        onCancel={onCancel}
        pending={pending}
        disableSubmit={values.name.trim().length === 0}
      />
    </form>
  );
}
