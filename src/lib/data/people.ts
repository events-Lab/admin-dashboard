export type PersonRole = "Owner" | "Staff" | "Contractor" | "Coach";

export type PersonRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PersonRole;
  venueAccess: string;
  status: "active" | "invited" | "inactive";
  joinedAt: string;
  lastActiveAt: string;
  assignments: string[];
  notes: string;
};

export const mockPeople: PersonRecord[] = [
  {
    id: "ppl-1",
    name: "Maya Chen",
    email: "maya@eventslab.com",
    phone: "+1 555 0101",
    role: "Owner",
    venueAccess: "All venues",
    status: "active",
    joinedAt: "2025-01-12",
    lastActiveAt: "2026-11-10 13:20",
    assignments: ["Women's Intermediate Match", "Settings / billing"],
    notes: "Primary account owner. Approves publish on paid events.",
  },
  {
    id: "ppl-2",
    name: "Omar Farouk",
    email: "omar@eventslab.com",
    phone: "+1 555 0102",
    role: "Staff",
    venueAccess: "Downtown Padel · Marina Club",
    status: "active",
    joinedAt: "2025-06-03",
    lastActiveAt: "2026-11-10 08:05",
    assignments: ["Beginner Padel Clinic", "Thursday Rehearsal Tournament"],
    notes: "Front desk lead. Handles check-in for live events.",
  },
  {
    id: "ppl-3",
    name: "Lina Costa",
    email: "lina@contractors.example",
    phone: "+1 555 0199",
    role: "Contractor",
    venueAccess: "Downtown Padel",
    status: "active",
    joinedAt: "2026-10-01",
    lastActiveAt: "2026-11-09 19:40",
    assignments: ["Friday Night Doubles"],
    notes: "Lighting and AV. Contract ends Friday.",
  },
  {
    id: "ppl-4",
    name: "Sofia Reyes",
    email: "sofia@eventslab.com",
    phone: "+1 555 0144",
    role: "Coach",
    venueAccess: "Riverside · Marina Club",
    status: "invited",
    joinedAt: "2026-11-08",
    lastActiveAt: "—",
    assignments: [],
    notes: "Invite sent. Pending first login.",
  },
];

export function getPerson(id: string): PersonRecord | undefined {
  return mockPeople.find((person) => person.id === id);
}
