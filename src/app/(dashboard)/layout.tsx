import { AppShell } from "@events-lab/shared-components";
import type { ReactNode } from "react";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/events", label: "Events" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/people", label: "People" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell product="Events Lab" area="Admin" nav={nav}>
      {children}
    </AppShell>
  );
}
