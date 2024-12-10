import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/builders/form-builder";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const form = await GetFormById(Number(id));

  if (!form) {
    throw new Error("forms not found");
  }
  return <FormBuilder form={form} />;
}
