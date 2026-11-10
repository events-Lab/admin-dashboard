"use client";

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  DetailList,
  EventStatusBadge,
  ImageGallery,
  mediaUrls,
  PageHeader,
  toEgpLabel,
  toast,
  type DataTableColumn,
  type EventAttendee,
  type EventLifecycleStatus,
} from "@events-lab/shared-components";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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

export function EventDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { get, update, remove, ready } = useCollection(eventsStore);
  const event = get(id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const attendees = event?.attendees ?? [];

  const attendeeColumns: DataTableColumn<EventAttendee>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Attendee",
        cell: (row) => (
          <div>
            <p className="m-0 font-semibold">{row.name}</p>
            <p className="m-0 mt-0.5 text-xs text-secondary-500">{row.email}</p>
          </div>
        ),
      },
      {
        key: "ticket",
        header: "Ticket",
        cell: (row) => (
          <Badge
            tone={
              row.ticketStatus === "confirmed"
                ? "success"
                : row.ticketStatus === "pending"
                  ? "warning"
                  : "danger"
            }
          >
            {row.ticketStatus}
          </Badge>
        ),
      },
      {
        key: "paid",
        header: "Paid",
        align: "right",
        cell: (row) => (row.paidAmount ? toEgpLabel(row.paidAmount) : "—"),
      },
    ],
    [],
  );

  if (!ready) {
    return <p className="m-0 text-sm text-secondary-500">Loading…</p>;
  }

  if (!event) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Events"
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

  function advance() {
    if (!event?.status) return;
    const next = nextStatus[event.status];
    if (!next) return;
    update(event.id, { status: next, updatedAt: nowLabel() });
  }

  const available = Math.max(event.capacity - (event.booked ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Event detail"
        title={event.title}
        description={event.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/events")}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/events/${event.id}/edit`)}
            >
              Edit
            </Button>
            {event.status && nextStatus[event.status] ? (
              <Button type="button" onClick={advance}>
                {advanceLabel[event.status]}
              </Button>
            ) : null}
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
        {event.status ? <EventStatusBadge status={event.status} /> : null}
        <Badge tone={event.pricing === "free" ? "info" : "success"}>
          {event.pricing === "free" ? "Free" : "Paid"}
        </Badge>
        <Badge tone={available > 0 ? "success" : "danger"}>
          {available > 0 ? `${available} seats left` : "Sold out"}
        </Badge>
        <Badge tone="neutral">{event.id}</Badge>
      </div>

      <ImageGallery
        images={mediaUrls(event)}
        alt={event.title}
        emptyLabel="No images"
        aspectClassName="aspect-[16/9] max-h-[420px]"
      />

      <DetailList
        title="Overview"
        fields={[
          { label: "When", value: event.dateLabel },
          { label: "Duration", value: event.duration ?? "—" },
          { label: "Venue", value: event.venue },
          { label: "Court", value: event.court ?? "—" },
          { label: "Coach", value: event.coach ?? "—" },
          { label: "Skill level", value: event.skillLevel ?? "—" },
          {
            label: "Seats",
            value: `${available} available · ${event.booked ?? 0}/${event.capacity} booked`,
          },
          {
            label: "Price",
            value:
              event.pricing === "free" ? "Free" : toEgpLabel(event.priceLabel),
          },
          {
            label: "Revenue",
            value: event.revenueLabel ? toEgpLabel(event.revenueLabel) : "—",
          },
          { label: "Created", value: event.createdAt ?? "—" },
          { label: "Updated", value: event.updatedAt ?? "—" },
          { label: "Attendees listed", value: String(attendees.length) },
        ]}
      />

      <Card title="Internal notes">
        <p className="m-0 text-sm leading-normal text-secondary-700">
          {event.notes ?? "No notes."}
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="m-0 text-base font-semibold tracking-tight">
          Attendees
        </h2>
        <DataTable
          columns={attendeeColumns}
          rows={attendees}
          rowKey={(row) => row.id}
          emptyTitle="No attendees yet"
          emptyDescription="Bookings will appear here once players join or buy tickets."
        />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete event?"
        description={`This will permanently remove “${event.title}”.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          toast({ title: "Event deleted", description: event.title });
          remove(event.id);
          router.push("/events");
        }}
      />
    </div>
  );
}
