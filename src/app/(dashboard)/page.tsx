"use client";

import {
  Card,
  NoteForm,
  Stat,
  StatGrid,
  formatEgp,
  parseMoney,
} from "@events-lab/shared-components";
import { useMemo } from "react";
import {
  ColumnChart,
  MeterList,
  StatusDonut,
} from "@/components/overview/charts";
import { eventsStore, peopleStore, productsStore, useCollection } from "@/lib/crm";
import { mockAdminEvents } from "@/lib/data/events";
import { mockPeople } from "@/lib/data/people";
import { mockAdminProducts } from "@/lib/data/products";

const statusMeta = [
  { key: "live", label: "Live", color: "#55c7f3" },
  { key: "published", label: "Published", color: "#1677ff" },
  { key: "draft", label: "Draft", color: "#93dff7" },
  { key: "completed", label: "Completed", color: "#64748b" },
] as const;

function countBy<T extends string>(values: T[], key: T) {
  return values.filter((value) => value === key).length;
}

export default function OverviewPage() {
  const eventsQuery = useCollection(eventsStore);
  const productsQuery = useCollection(productsStore);
  const peopleQuery = useCollection(peopleStore);

  const events = eventsQuery.ready ? eventsQuery.items : mockAdminEvents;
  const products = productsQuery.ready ? productsQuery.items : mockAdminProducts;
  const people = peopleQuery.ready ? peopleQuery.items : mockPeople;

  const snapshot = useMemo(() => {
    const statuses = events.map((event) => event.status ?? "draft");
    const booked = events.reduce((sum, event) => sum + (event.booked ?? 0), 0);
    const capacity = events.reduce((sum, event) => sum + event.capacity, 0);
    const revenue = events.reduce(
      (sum, event) => sum + parseMoney(event.revenueLabel),
      0,
    );
    const live = countBy(statuses, "live");
    const draft = countBy(statuses, "draft");
    const activeProducts = products.filter(
      (product) => product.status === "active",
    ).length;
    const outOfStock = products.filter(
      (product) => product.status === "out_of_stock",
    ).length;
    const activePeople = people.filter((person) => person.status === "active").length;
    const invited = people.filter((person) => person.status === "invited").length;
    const fill = capacity === 0 ? 0 : Math.round((booked / capacity) * 100);

    const revenuePoints = [...events]
      .map((event) => ({
        id: event.id,
        label: event.title,
        value: parseMoney(event.revenueLabel),
      }))
      .sort((a, b) => b.value - a.value);

    const fillRows = [...events]
      .map((event) => {
        const taken = event.booked ?? 0;
        const rate =
          event.capacity === 0 ? 0 : Math.round((taken / event.capacity) * 100);
        return {
          id: event.id,
          label: event.title,
          value: rate,
          detail: `${taken} / ${event.capacity}`,
        };
      })
      .sort((a, b) => b.value - a.value);

    const stockMap = new Map<string, number>();
    for (const product of products) {
      const category = product.category ?? "Other";
      stockMap.set(category, (stockMap.get(category) ?? 0) + (product.stock ?? 0));
    }
    const stockRows = [...stockMap.entries()]
      .map(([category, units]) => ({
        id: category,
        label: category,
        value: units,
        detail: `${units} units`,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      booked,
      capacity,
      revenue,
      live,
      draft,
      activeProducts,
      outOfStock,
      activePeople,
      invited,
      fill,
      openSeats: Math.max(capacity - booked, 0),
      revenuePoints,
      fillRows,
      stockRows,
      slices: statusMeta.map((status) => ({
        label: status.label,
        color: status.color,
        value: countBy(statuses, status.key),
      })),
    };
  }, [events, people, products]);

  return (
    <div className="page-enter flex flex-col gap-6">
      <section className="hero-glow relative overflow-hidden rounded-[28px] px-6 py-7 text-white shadow-[0_20px_50px_rgba(16,42,67,0.28)]">
        <div className="float-orb pointer-events-none absolute -top-8 -right-6 size-36 rounded-full bg-accent/45 blur-2xl" />
        <p className="relative m-0 text-xs font-semibold tracking-[0.08em] text-accent-100 uppercase">
          Today
        </p>
        <h1 className="relative m-0 mt-2 text-[34px] leading-none font-semibold tracking-tight">
          Overview
        </h1>
        <p className="relative m-0 mt-2 max-w-[36rem] text-[15px] text-white/85">
          Padel events, bookings, and revenue across the club.
        </p>
      </section>

      <StatGrid className="stagger">
        <Stat
          label="Events"
          value={String(events.length)}
          detail={`${snapshot.live} live · ${snapshot.draft} draft`}
        />
        <Stat
          label="Bookings"
          value={String(snapshot.booked)}
          detail={`${snapshot.openSeats} seats still open`}
        />
        <Stat
          label="Fill rate"
          value={`${snapshot.fill}%`}
          detail={`${snapshot.booked} of ${snapshot.capacity} seats`}
        />
        <Stat
          label="Revenue"
          value={formatEgp(snapshot.revenue)}
          detail="Ticket sales across events"
        />
        <Stat
          label="Products"
          value={String(products.length)}
          detail={`${snapshot.activeProducts} active · ${snapshot.outOfStock} out of stock`}
        />
        <Stat
          label="People"
          value={String(people.length)}
          detail={`${snapshot.activePeople} active · ${snapshot.invited} invited`}
        />
      </StatGrid>

      <div className="grid grid-cols-2 gap-4 max-[960px]:grid-cols-1">
        <Card title="Ticket revenue">
          <p className="m-0 mb-4 text-sm text-secondary-500">
            Recorded ticket totals for each event.
          </p>
          <ColumnChart
            points={snapshot.revenuePoints}
            format={formatEgp}
            label="Ticket revenue by event"
          />
        </Card>
        <Card title="Event status">
          <p className="m-0 mb-4 text-sm text-secondary-500">
            Where sessions sit in the club calendar.
          </p>
          <StatusDonut slices={snapshot.slices} centerLabel="Events by status" />
        </Card>
        <Card title="Court fill">
          <p className="m-0 mb-4 text-sm text-secondary-500">
            Booked seats against each event capacity.
          </p>
          <MeterList
            rows={snapshot.fillRows}
            label="Court fill by event"
            scale="percent"
          />
        </Card>
        <Card title="Stock by category">
          <p className="m-0 mb-4 text-sm text-secondary-500">
            Units on hand across the marketplace.
          </p>
          <MeterList rows={snapshot.stockRows} label="Stock by category" />
        </Card>
      </div>

      <Card title="Internal note">
        <NoteForm
          label="Note"
          placeholder="Court maintenance, coach swap, or a handoff."
          submitLabel="Save note"
        />
      </Card>
    </div>
  );
}
