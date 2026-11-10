"use client";

import { Button, PageHeader, toast } from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import {
  formValuesToPersonPatch,
  PersonForm,
} from "@/components/forms";
import { peopleStore, useCollection } from "@/lib/crm";

export function EditPersonView({ id }: { id: string }) {
  const router = useRouter();
  const { get, update, ready } = useCollection(peopleStore);
  const person = get(id);

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!person) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="CRM"
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
        eyebrow="CRM"
        title={`Edit · ${person.name}`}
        description="Update profile fields and save changes."
      />
      <PersonForm
        initial={person}
        submitLabel="Save changes"
        onCancel={() => router.push(`/people/${person.id}`)}
        onSubmit={(values) => {
          update(person.id, formValuesToPersonPatch(values));
          toast({ title: "Person saved", description: values.name });
          router.push(`/people/${person.id}`);
        }}
      />
    </div>
  );
}
