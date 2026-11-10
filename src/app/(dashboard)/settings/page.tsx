import { Card, PageHeader } from "@events-lab/shared-components";
import { WorkspaceForm } from "@/components/settings/workspace-form";

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
