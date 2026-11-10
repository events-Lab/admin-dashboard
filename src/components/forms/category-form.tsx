"use client";

import {
  Card,
  mediaUrls,
  SelectField,
  TextArea,
  TextField,
} from "@events-lab/shared-components";
import { useState, type FormEvent } from "react";
import type { CategoryRecord, CategoryStatus } from "@/lib/data/categories";
import { FormActions } from "./form-actions";
import { ImageUploader } from "./image-uploader";

export type CategoryFormValues = {
  name: string;
  description: string;
  images: string[];
  status: CategoryStatus;
};

const emptyValues: CategoryFormValues = {
  name: "",
  description: "",
  images: [],
  status: "active",
};

export function categoryToFormValues(
  category: CategoryRecord,
): CategoryFormValues {
  return {
    name: category.name,
    description: category.description,
    images: mediaUrls(category),
    status: category.status,
  };
}

export function formValuesToCategoryPatch(
  values: CategoryFormValues,
): Omit<CategoryRecord, "id" | "createdAt" | "updatedAt"> {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    images: values.images.length > 0 ? values.images : undefined,
    imageUrl: values.images[0] ?? "",
    status: values.status,
  };
}

export type CategoryFormProps = {
  initial?: CategoryRecord;
  submitLabel: string;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function CategoryForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(
    initial ? categoryToFormValues(initial) : emptyValues,
  );
  const [pending, setPending] = useState(false);

  function set<K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K],
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
      <Card title="Category details">
        <div className="grid grid-cols-2 gap-3.5 max-[800px]:grid-cols-1">
          <TextField
            label="Name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <SelectField
            label="Status"
            value={values.status}
            onChange={(e) => set("status", e.target.value as CategoryStatus)}
            options={[
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>
        <div className="mt-3.5 flex flex-col gap-3.5">
          <ImageUploader
            images={values.images}
            onChange={(images) => set("images", images)}
          />
          <TextArea
            label="Description"
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
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
