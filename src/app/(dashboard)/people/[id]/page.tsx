import { PersonDetailView } from "./view";

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PersonDetailView id={id} />;
}
