import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetFormWithSubmissionByUserDetails } from "@/actions/form";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface ViewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: number | null;
}

export function ViewFormBtn({ open, onOpenChange, id }: ViewFormDialogProps) {
  const [form, setForm] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        try {
          const fetchedForm = await GetFormWithSubmissionByUserDetails(id);
          console.log("fetched Form", fetchedForm);

          setForm(fetchedForm);
        } catch (error) {
          console.error("Failed to fetch form:", error);
          setForm(null);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const renderFields = (
    fields: any[],
    submissionContent: Record<string, string>
  ) => {
    return fields.map((field) => {
      const { id, type, extraAttributes } = field;
      const { title, label } = extraAttributes || {};
      const contentValue = submissionContent[id];

      switch (type) {
        case "TitleField":
          return (
            <div key={id}>
              <strong>Title:</strong> {title}
            </div>
          );
        case "SubTitleField":
          return (
            <div key={id}>
              <strong>Subtitle:</strong> {title}
            </div>
          );
        case "TextField":
          return (
            <div key={id}>
              <strong>Text:</strong> {contentValue || label}
            </div>
          );
        case "NumberField":
          return (
            <div key={id}>
              <strong>Number:</strong> {contentValue || label}
            </div>
          );
        case "TextAreaField":
          return (
            <div key={id}>
              <strong>Text Area:</strong> {contentValue || label}
            </div>
          );
        case "SelectField":
          return (
            <div key={id}>
              <strong>Select Dropdown:</strong> {contentValue || label}
            </div>
          );
        case "CheckboxField":
          return (
            <div key={id}>
              <strong>Checkbox:</strong> {contentValue || label}
            </div>
          );
        case "DateField":
          return (
            <div key={id}>
              <strong>Date:</strong> {contentValue || label}
            </div>
          );
        default:
          return null;
      }
    });
  };

  if (!id) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form Details</DialogTitle>
        </DialogHeader>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : form ? (
            <>
              <h1 className="text-xl font-bold mb-4">{form.title}</h1>
              <div className="space-y-4">
                <div>
                  <strong>Description:</strong> {form.description || "N/A"}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  <Badge variant="outline">
                    {format(new Date(form.createdAt), "dd/MM/yyyy")}
                  </Badge>
                </div>

                <div>
                  <strong>Submissions:</strong>{" "}
                  {form.FormSubmissions.map(
                    (submission: any, index: number) => {
                      const submissionContent = JSON.parse(submission.content);
                      return (
                        <div key={index} className="border p-2 rounded-md my-2">
                          <p>
                            <strong>Submitted At:</strong>{" "}
                            {formatDistance(
                              new Date(submission.createdAt),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </p>
                          <div>
                            <strong>Fields:</strong>
                            <div className="space-y-2">
                              {renderFields(
                                JSON.parse(form.content),
                                submissionContent
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Form not found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
