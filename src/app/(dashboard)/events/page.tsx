"use client";

import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  EventStatusBadge,
  PageHeader,
  toEgpLabel,
  toast,
  type DataTableColumn,
  type EventItem,
  type EventLifecycleStatus,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  IconButton,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icon-button";
import { eventsStore, nowLabel, useCollection } from "@/lib/crm";

const nextStatus: Partial<Record<EventLifecycleStatus, EventLifecycleStatus>> = {
  draft: "published",
  published: "live",
  live: "completed",
};

const advanceLabel: Partial<Record<EventLifecycleStatus, string>> = {
  draft: "Publish",
  published: "Go live",
  live: "Complete",
};

export default function EventsPage() {
  const router = useRouter();
  const { items: events, update, remove } = useCollection(eventsStore);
  const [statusFilter, setStatusFilter] = useState<EventLifecycleStatus | "all">(
    "all",
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (statusFilter === "all") return events;
    return events.filter((event) => event.status === statusFilter);
  }, [events, statusFilter]);

  function advance(event: EventItem) {
    const next = event.status ? nextStatus[event.status] : undefined;
    if (!next) return;
    update(event.id, { status: next, updatedAt: nowLabel() });
  }

  const columns: DataTableColumn<EventItem>[] = [
    {
      key: "title",
      header: "Event",
      cell: (row) => (
        <div>
          <p className="m-0 font-semibold text-secondary-900">{row.title}</p>
          <p className="m-0 mt-0.5 text-xs text-secondary-500">{row.id}</p>
        </div>
      ),
    },
    {
      key: "when",
      header: "When",
      cell: (row) => row.dateLabel,
    },
    {
      key: "venue",
      header: "Venue",
      cell: (row) => (
        <span>
          {row.venue}
          {row.court ? ` · ${row.court}` : ""}
        </span>
      ),
    },
    {
      key: "pricing",
      header: "Pricing",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <Badge tone={row.pricing === "free" ? "info" : "success"}>
            {row.pricing === "free" ? "Free" : "Paid"}
          </Badge>
          <span className="text-xs text-secondary-500">
            {row.pricing === "free" ? "—" : toEgpLabel(row.priceLabel)}
          </span>
        </div>
      ),
    },
    {
      key: "seats",
      header: "Seats left",
      cell: (row) => {
        const available = Math.max(row.capacity - (row.booked ?? 0), 0);
        return (
          <div>
            <p className="m-0 font-semibold">{available}</p>
            <p className="m-0 text-xs text-secondary-500">
              {row.booked ?? 0}/{row.capacity} booked
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) =>
        row.status ? <EventStatusBadge status={row.status} /> : "—",
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
          {row.status && nextStatus[row.status] ? (
            <Button type="button" onClick={() => advance(row)}>
              {advanceLabel[row.status]}
            </Button>
          ) : null}
          <IconButton
            label={`Edit ${row.title}`}
            onClick={() => router.push(`/events/${row.id}/edit`)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            label={`Delete ${row.title}`}
            tone="danger"
            onClick={() => setDeleteId(row.id)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const filters: Array<EventLifecycleStatus | "all"> = [
    "all",
    "draft",
    "published",
    "live",
    "completed",
  ];

  const pendingDelete = events.find((event) => event.id === deleteId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="CRM"
        title="Events"
        description="Create, edit, advance, and delete padel events."
        actions={
          <Button
            type="button"
            className="gap-1.5"
            onClick={() => router.push("/events/new")}
          >
            <PlusIcon />
            New event
          </Button>
        }
      />
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            type="button"
            variant={statusFilter === filter ? "primary" : "secondary"}
            onClick={() => setStatusFilter(filter)}
          >
            {filter === "all" ? "All" : filter}
          </Button>
        ))}
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/events/${row.id}`)}
        emptyTitle="No events"
        emptyDescription="Create an event to start the CRM cycle."
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete event?"
        description={
          pendingDelete
            ? `This will permanently remove “${pendingDelete.title}” from the admin CRM.`
            : undefined
        }
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove(pendingDelete.id);
            toast({ title: "Event deleted", description: pendingDelete.title });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
