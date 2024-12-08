import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/builders/form-element";
import PreStepForm from "@/components/pre-step-form";

async function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  const form = await GetFormContentByUrl(params.formUrl);

  if (!form) {
    throw new Error("Form not found");
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <PreStepForm formUrl={params.formUrl} content={formContent} />;
}

export default SubmitPage;
