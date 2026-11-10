"use client";

import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  PageHeader,
  toast,
  type DataTableColumn,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IconButton,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icon-button";
import type { PersonRecord, PersonRole } from "@/lib/data";
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

export default function PeoplePage() {
  const router = useRouter();
  const { items: people, remove } = useCollection(peopleStore);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: DataTableColumn<PersonRecord>[] = [
    {
      key: "name",
      header: "Person",
      cell: (row) => (
        <div>
          <p className="m-0 font-semibold text-secondary-900">{row.name}</p>
          <p className="m-0 mt-0.5 text-xs text-secondary-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => <Badge tone={roleTone[row.role]}>{row.role}</Badge>,
    },
    {
      key: "access",
      header: "Venue access",
      cell: (row) => row.venueAccess,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
    },
    {
      key: "lastActive",
      header: "Last active",
      cell: (row) => row.lastActiveAt,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      className: "whitespace-nowrap",
      cell: (row) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            label={`Edit ${row.name}`}
            onClick={() => router.push(`/people/${row.id}/edit`)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            label={`Delete ${row.name}`}
            tone="danger"
            onClick={() => setDeleteId(row.id)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const pendingDelete = people.find((person) => person.id === deleteId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="People"
        description="Create, edit, and delete staff, coaches, and contractors."
        actions={
          <Button
            type="button"
            className="gap-1.5"
            onClick={() => router.push("/people/new")}
          >
            <PlusIcon />
            New person
          </Button>
        }
      />
      <DataTable
        columns={columns}
        rows={people}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/people/${row.id}`)}
        emptyTitle="No people"
        emptyDescription="Add staff to assign them to venues and events."
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete person?"
        description={
          pendingDelete
            ? `This will permanently remove “${pendingDelete.name}”.`
            : undefined
        }
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id);
            toast({ title: "Person deleted", description: pendingDelete.name });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
