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
          console.log("Data", fetchedForm);
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

  const renderFields = (fields: any[]) => {
    return fields.map((field) => {
      const { type, extraAttributes } = field;
      const { title, label, options } = extraAttributes || {};

      switch (type) {
        case "TitleField":
          return (
            <div key={field.id}>
              <strong>Title:</strong> {title}
            </div>
          );
        case "SubTitleField":
          return (
            <div key={field.id}>
              <strong>Subtitle:</strong> {title}
            </div>
          );
        case "TextField":
          return (
            <div key={field.id}>
              <strong>Text (label):</strong> {label}
            </div>
          );
        case "SelectField":
          return (
            <div key={field.id}>
              <strong>Select Dropdown (label):</strong> {label}
            </div>
          );
        case "CheckboxField":
          return (
            <div key={field.id}>
              <strong>Checkbox (label):</strong> {label}
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
                    (submission: any, index: number) => (
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
                            {renderFields(JSON.parse(form.content))}
                          </div>
                        </div>
                      </div>
                    )
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
