import { EditCategoryView } from "./view";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditCategoryView id={id} />;
}
