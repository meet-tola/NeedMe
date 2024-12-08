import { CancelAppointment } from "@/actions/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CancelAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: number | null;
  shareURL: string;
}

export function CancelAppointmentBtn({
  open,
  onOpenChange,
  id,
  shareURL,
}: CancelAlertDialogProps) {
  const [loading, setLoading] = useState(true);

  const handleCancel = async () => {
    setLoading(false);
    if (id === null) {
      console.error("ID cannot be null.");
      return;
    }
    try {
      await CancelAppointment(shareURL, id);
      window.location.reload()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(true);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel the
            appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, go back</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>
          {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Canceling...
              </div>
            ) : (
              "Yes, cancel"
            )}
            
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
