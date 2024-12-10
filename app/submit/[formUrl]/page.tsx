import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/builders/form-element";
import PreStepForm from "@/components/pre-step-form";

async function SubmitPage({
  params,
}: {
  params: Promise<{ formUrl: string }>;
}) {
  const resolvedParams = await params;
  const { formUrl } = resolvedParams;
  const form = await GetFormContentByUrl(formUrl);

  if (!form) {
    throw new Error("Form not found");
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <PreStepForm formUrl={formUrl} content={formContent} />;
}

export default SubmitPage;
