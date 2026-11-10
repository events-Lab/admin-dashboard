"use client";

import { PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  EventForm,
  formValuesToEventPatch,
} from "@/components/forms";
import { eventsStore, newId, nowLabel, useCollection } from "@/lib/crm";

export default function NewEventPage() {
  const router = useRouter();
  const { create } = useCollection(eventsStore);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="New event"
        description="Create a padel event in draft, then publish when ready."
      />
      <EventForm
        submitLabel="Create event"
        onCancel={() => router.push("/events")}
        onSubmit={(values) => {
          const stamp = nowLabel();
          const created = create({
            id: newId("evt"),
            ...formValuesToEventPatch(values),
            attendees: [],
            createdAt: stamp,
            updatedAt: stamp,
          });
          toast({ title: "Event created", description: values.title });
          router.push(`/events/${created.id}`);
        }}
      />
    </div>
  );
}
