"use client";

import {
  Card,
  SelectField,
  TextArea,
  TextField,
} from "@events-lab/shared-components";
import { useState, type FormEvent } from "react";
import type { PersonRecord, PersonRole } from "@/lib/data/people";
import { FormActions } from "./form-actions";

export type PersonFormValues = {
  name: string;
  email: string;
  phone: string;
  role: PersonRole;
  venueAccess: string;
  status: PersonRecord["status"];
  joinedAt: string;
  lastActiveAt: string;
  assignments: string;
  notes: string;
};

const emptyValues: PersonFormValues = {
  name: "",
  email: "",
  phone: "",
  role: "Staff",
  venueAccess: "",
  status: "invited",
  joinedAt: "",
  lastActiveAt: "—",
  assignments: "",
  notes: "",
};

export function personToFormValues(person: PersonRecord): PersonFormValues {
  return {
    name: person.name,
    email: person.email,
    phone: person.phone,
    role: person.role,
    venueAccess: person.venueAccess,
    status: person.status,
    joinedAt: person.joinedAt,
    lastActiveAt: person.lastActiveAt,
    assignments: person.assignments.join("\n"),
    notes: person.notes,
  };
}

export function formValuesToPersonPatch(
  values: PersonFormValues,
): Omit<PersonRecord, "id"> {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    role: values.role,
    venueAccess: values.venueAccess.trim(),
    status: values.status,
    joinedAt: values.joinedAt.trim(),
    lastActiveAt: values.lastActiveAt.trim() || "—",
    assignments: values.assignments
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    notes: values.notes.trim(),
  };
}

export type PersonFormProps = {
  initial?: PersonRecord;
  submitLabel: string;
  onSubmit: (values: PersonFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export function PersonForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: PersonFormProps) {
  const [values, setValues] = useState<PersonFormValues>(
    initial ? personToFormValues(initial) : emptyValues,
  );
  const [pending, setPending] = useState(false);

  function set<K extends keyof PersonFormValues>(
    key: K,
    value: PersonFormValues[K],
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
      <Card title="Person details">
        <div className="grid grid-cols-2 gap-3.5 max-[800px]:grid-cols-1">
          <TextField
            label="Name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <TextField
            label="Phone"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <SelectField
            label="Role"
            value={values.role}
            onChange={(e) => set("role", e.target.value as PersonRole)}
            options={[
              { value: "Owner", label: "Owner" },
              { value: "Staff", label: "Staff" },
              { value: "Coach", label: "Coach" },
              { value: "Contractor", label: "Contractor" },
            ]}
          />
          <SelectField
            label="Status"
            value={values.status}
            onChange={(e) =>
              set("status", e.target.value as PersonRecord["status"])
            }
            options={[
              { value: "active", label: "Active" },
              { value: "invited", label: "Invited" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <TextField
            label="Venue access"
            value={values.venueAccess}
            onChange={(e) => set("venueAccess", e.target.value)}
          />
          <TextField
            label="Joined"
            value={values.joinedAt}
            onChange={(e) => set("joinedAt", e.target.value)}
            placeholder="2026-11-10"
          />
          <TextField
            label="Last active"
            value={values.lastActiveAt}
            onChange={(e) => set("lastActiveAt", e.target.value)}
          />
        </div>
        <div className="mt-3.5 flex flex-col gap-3.5">
          <TextArea
            label="Assignments"
            hint="One assignment per line"
            value={values.assignments}
            onChange={(e) => set("assignments", e.target.value)}
          />
          <TextArea
            label="Notes"
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </Card>
      <FormActions
        submitLabel={submitLabel}
        onCancel={onCancel}
        pending={pending}
        disableSubmit={
          values.name.trim().length === 0 || values.email.trim().length === 0
        }
      />
    </form>
  );
}
