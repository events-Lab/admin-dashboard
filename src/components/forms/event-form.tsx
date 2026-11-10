"use client";

import {
  Card,
  mediaUrls,
  SelectField,
  TextArea,
  TextField,
  formatEgp,
  parseMoney,
  type EventItem,
  type EventLifecycleStatus,
} from "@events-lab/shared-components";
import { useState, type FormEvent } from "react";
import { FormActions } from "./form-actions";
import { ImageUploader } from "./image-uploader";

export type EventFormValues = {
  title: string;
  dateLabel: string;
  venue: string;
  court: string;
  capacity: string;
  booked: string;
  pricing: "free" | "paid";
  priceLabel: string;
  status: EventLifecycleStatus;
  description: string;
  coach: string;
  skillLevel: string;
  duration: string;
  revenueLabel: string;
  images: string[];
  notes: string;
};

const emptyValues: EventFormValues = {
  title: "",
  dateLabel: "",
  venue: "",
  court: "",
  capacity: "8",
  booked: "0",
  pricing: "paid",
  priceLabel: "25",
  status: "draft",
  description: "",
  coach: "",
  skillLevel: "",
  duration: "90 min",
  revenueLabel: "0",
  images: [],
  notes: "",
};

export function eventToFormValues(event: EventItem): EventFormValues {
  return {
    title: event.title,
    dateLabel: event.dateLabel,
    venue: event.venue,
    court: event.court ?? "",
    capacity: String(event.capacity),
    booked: String(event.booked ?? 0),
    pricing: event.pricing,
    priceLabel: event.priceLabel ? String(parseMoney(event.priceLabel)) : "",
    status: event.status ?? "draft",
    description: event.description ?? "",
    coach: event.coach ?? "",
    skillLevel: event.skillLevel ?? "",
    duration: event.duration ?? "",
    revenueLabel: String(parseMoney(event.revenueLabel)),
    images: mediaUrls(event),
    notes: event.notes ?? "",
  };
}

export function formValuesToEventPatch(
  values: EventFormValues,
): Omit<EventItem, "id" | "attendees" | "createdAt" | "updatedAt"> {
  return {
    title: values.title.trim(),
    dateLabel: values.dateLabel.trim(),
    venue: values.venue.trim(),
    court: values.court.trim() || undefined,
    capacity: Number(values.capacity) || 0,
    booked: Number(values.booked) || 0,
    pricing: values.pricing,
    priceLabel:
      values.pricing === "free"
        ? undefined
        : formatEgp(Number(values.priceLabel) || 0),
    status: values.status,
    description: values.description.trim() || undefined,
    coach: values.coach.trim() || undefined,
    skillLevel: values.skillLevel.trim() || undefined,
    duration: values.duration.trim() || undefined,
    revenueLabel: formatEgp(Number(values.revenueLabel) || 0),
    images: values.images.length > 0 ? values.images : undefined,
    imageUrl: values.images[0],
    notes: values.notes.trim() || undefined,
  };
}

export type EventFormProps = {
  initial?: EventItem;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function EventForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(
    initial ? eventToFormValues(initial) : emptyValues,
  );
  const [pending, setPending] = useState(false);

  function set<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
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
      <Card title="Event details">
        <div className="grid grid-cols-2 gap-3.5 max-[800px]:grid-cols-1">
          <TextField
            label="Title"
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <TextField
            label="When"
            required
            value={values.dateLabel}
            onChange={(e) => set("dateLabel", e.target.value)}
            placeholder="Fri 13 Nov · 19:30"
          />
          <TextField
            label="Venue"
            required
            value={values.venue}
            onChange={(e) => set("venue", e.target.value)}
          />
          <TextField
            label="Court"
            value={values.court}
            onChange={(e) => set("court", e.target.value)}
          />
          <TextField
            label="Capacity"
            type="number"
            min={0}
            required
            value={values.capacity}
            onChange={(e) => set("capacity", e.target.value)}
          />
          <TextField
            label="Booked"
            type="number"
            min={0}
            value={values.booked}
            onChange={(e) => set("booked", e.target.value)}
          />
          <SelectField
            label="Pricing"
            value={values.pricing}
            onChange={(e) => set("pricing", e.target.value as "free" | "paid")}
            options={[
              { value: "free", label: "Free" },
              { value: "paid", label: "Paid" },
            ]}
          />
          <TextField
            label="Price (EGP)"
            type="number"
            min={0}
            step="1"
            value={values.priceLabel}
            onChange={(e) => set("priceLabel", e.target.value)}
            disabled={values.pricing === "free"}
            hint="Ticket price in Egyptian pounds."
          />
          <SelectField
            label="Status"
            value={values.status}
            onChange={(e) =>
              set("status", e.target.value as EventLifecycleStatus)
            }
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "live", label: "Live" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <TextField
            label="Coach"
            value={values.coach}
            onChange={(e) => set("coach", e.target.value)}
          />
          <TextField
            label="Skill level"
            value={values.skillLevel}
            onChange={(e) => set("skillLevel", e.target.value)}
          />
          <TextField
            label="Duration"
            value={values.duration}
            onChange={(e) => set("duration", e.target.value)}
          />
          <TextField
            label="Revenue (EGP)"
            type="number"
            min={0}
            step="1"
            value={values.revenueLabel}
            onChange={(e) => set("revenueLabel", e.target.value)}
            hint="Ticket sales recorded so far."
          />
        </div>
        <div className="mt-3.5 flex flex-col gap-3.5">
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
        disableSubmit={values.title.trim().length === 0}
      />
    </form>
  );
}
