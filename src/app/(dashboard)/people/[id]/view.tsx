"use client";

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DetailList,
  PageHeader,
  toast,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PersonRole } from "@/lib/data";
import { peopleStore, useCollection } from "@/lib/crm";

const roleTone: Record<PersonRole, "success" | "neutral" | "warning" | "info"> = {
  Owner: "success",
  Staff: "neutral",
  Contractor: "warning",
  Coach: "info",
};

const statusTone = {
  active: "success",
  invited: "warning",
  inactive: "danger",
} as const;

export function PersonDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { get, remove, ready } = useCollection(peopleStore);
  const person = get(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!person) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="People"
          title="Person not found"
          description={`No person matches id “${id}”.`}
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/people")}
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
        eyebrow="Person detail"
        title={person.name}
        description={person.email}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/people")}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/people/${person.id}/edit`)}
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
        <Badge tone={roleTone[person.role]}>{person.role}</Badge>
        <Badge tone={statusTone[person.status]}>{person.status}</Badge>
        <Badge tone="neutral">{person.id}</Badge>
      </div>

      <DetailList
        title="Profile"
        fields={[
          { label: "Email", value: person.email },
          { label: "Phone", value: person.phone },
          { label: "Role", value: person.role },
          { label: "Status", value: person.status },
          { label: "Venue access", value: person.venueAccess },
          { label: "Joined", value: person.joinedAt },
          { label: "Last active", value: person.lastActiveAt },
          {
            label: "Assignments",
            value:
              person.assignments.length > 0
                ? person.assignments.join(", ")
                : "None",
          },
        ]}
      />

      <Card title="Notes">
        <p className="m-0 text-sm leading-normal text-secondary-700">
          {person.notes}
        </p>
      </Card>

      <Card title="Assignments">
        {person.assignments.length === 0 ? (
          <p className="m-0 text-sm text-secondary-500">No active assignments.</p>
        ) : (
          <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-secondary-800">
            {person.assignments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete person?"
        description={`This will permanently remove “${person.name}”.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          toast({ title: "Person deleted", description: person.name });
          remove(person.id);
          router.push("/people");
        }}
      />
    </div>
  );
}
