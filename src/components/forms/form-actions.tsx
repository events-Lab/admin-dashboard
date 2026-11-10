"use client";

import { Button } from "@events-lab/shared-components";

export type FormActionsProps = {
  submitLabel: string;
  onCancel: () => void;
  pending?: boolean;
  disableSubmit?: boolean;
};

export function FormActions({
  submitLabel,
  onCancel,
  pending = false,
  disableSubmit = false,
}: FormActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="submit" disabled={pending || disableSubmit}>
        {pending ? "Saving…" : submitLabel}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
        Cancel
      </Button>
    </div>
  );
}
