import { CategoryDetailView } from "./view";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryDetailView id={id} />;
}
