import { EditEventView } from "./view";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditEventView id={id} />;
}
