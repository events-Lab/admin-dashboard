import { Card, PageHeader } from "@events-lab/shared-components";
import { WorkspaceForm } from "@/components/settings/workspace-form";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function SettingsPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Name and contact details shown to staff."
      />
      <Card title="General">
        <WorkspaceForm />
      </Card>
    </div>
  );
}
