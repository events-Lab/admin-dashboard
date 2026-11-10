import { EditPersonView } from "./view";

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditPersonView id={id} />;
}
