# Admin dashboard

Operations app for Events Lab. Staff review events, products, categories, and people, and edit workspace settings. UI comes from [`@events-lab/shared-components`](https://github.com/events-Lab/shared-compoenents).

Runs at [http://localhost:3000](http://localhost:3000).

## Routes

| Path | What it does |
| --- | --- |
| `/` | Overview: bookings, revenue, status charts, internal notes |
| `/events` | Event list, detail, create, edit |
| `/products` | Product list, detail, create, edit |
| `/categories` | Category list, detail, create, edit |
| `/people` | People list, detail, create, edit |
| `/settings` | Workspace name and contact details |

Records are stored in the browser. `src/lib/crm` seeds `localStorage` (`admin-crm-events`, `admin-crm-products`, `admin-crm-people`, `admin-crm-categories`) and the screens read and write that store. Refresh keeps edits; clearing site data restores the mock seed in `src/lib/data`.

The shell is `AppShell` from the shared package (`src/app/(dashboard)/layout.tsx`).

## Events Lab layout

This app is one of three repositories in the [events-Lab](https://github.com/events-Lab) organization:

| Repository | Local folder | Role |
| --- | --- | --- |
| [shared-compoenents](https://github.com/events-Lab/shared-compoenents) | `shared-compoenents` | `@events-lab/shared-components` |
| [admin-dashboard](https://github.com/events-Lab/admin-dashboard) | `admin-dashboard` | this app, port 3000 |
| [client-dashboard](https://github.com/events-Lab/client-dashboard) | `client-dashboard` | storefront, port 3001 |

The parent `events-lab` folder is a local npm workspace. It is not a fourth GitHub repo. Clone the three repositories as siblings. The shared folder must stay spelled `shared-compoenents`; `package.json` points at `file:../shared-compoenents`.

```bash
mkdir events-lab && cd events-lab
git clone https://github.com/events-Lab/shared-compoenents.git
git clone https://github.com/events-Lab/admin-dashboard.git
git clone https://github.com/events-Lab/client-dashboard.git
```

Put this `package.json` in `events-lab`, then install from there so React is hoisted once and the shared package is linked:

```json
{
  "name": "events-lab",
  "private": true,
  "workspaces": [
    "shared-compoenents",
    "admin-dashboard",
    "client-dashboard"
  ],
  "scripts": {
    "dev:admin": "npm run dev -w admin-dashboard",
    "dev:client": "npm run dev -w client-dashboard",
    "build": "npm run build -w admin-dashboard && npm run build -w client-dashboard",
    "typecheck": "npm run typecheck -w @events-lab/shared-components"
  }
}
```

```bash
npm install
npm run dev:admin
```

From this repo alone, after the sibling shared package is present: `npm run dev`, `npm run build`, `npm run lint`.

Next.js compiles the shared package via `transpilePackages` in `next.config.ts`. Theme tokens load from `@events-lab/shared-components/theme.css` in `src/app/globals.css`. Stack: Next.js 16, React 19, Tailwind CSS 4.
