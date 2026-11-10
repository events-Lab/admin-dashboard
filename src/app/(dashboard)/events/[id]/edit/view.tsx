"use client";

import { Button, PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  EventForm,
  formValuesToEventPatch,
} from "@/components/forms";
import { eventsStore, nowLabel, useCollection } from "@/lib/crm";

export function EditEventView({ id }: { id: string }) {
  const router = useRouter();
  const { get, update, ready } = useCollection(eventsStore);
  const event = get(id);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!event) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="CRM"
          title="Event not found"
          description={`No event matches id “${id}”.`}
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/events")}
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
        eyebrow="CRM"
        title={`Edit · ${event.title}`}
        description="Update event fields and save changes."
      />
      <EventForm
        initial={event}
        submitLabel="Save changes"
        onCancel={() => router.push(`/events/${event.id}`)}
        onSubmit={(values) => {
          update(event.id, {
            ...formValuesToEventPatch(values),
            updatedAt: nowLabel(),
          });
          toast({ title: "Event saved", description: values.title });
          router.push(`/events/${event.id}`);
        }}
      />
    </div>
  );
}
