"use client";

import { PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  formValuesToPersonPatch,
  PersonForm,
} from "@/components/forms";
import { newId, nowLabel, peopleStore, useCollection } from "@/lib/crm";

export default function NewPersonPage() {
  const router = useRouter();
  const { create } = useCollection(peopleStore);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="New person"
        description="Invite staff, coaches, or contractors into the admin CRM."
      />
      <PersonForm
        submitLabel="Create person"
        onCancel={() => router.push("/people")}
        onSubmit={(values) => {
          const created = create({
            id: newId("ppl"),
            ...formValuesToPersonPatch(values),
            joinedAt: values.joinedAt.trim() || nowLabel().slice(0, 10),
          });
          toast({ title: "Person created", description: values.name });
          router.push(`/people/${created.id}`);
        }}
      />
    </div>
  );
}
