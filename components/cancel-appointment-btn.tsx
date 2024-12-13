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
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

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
  const [loading, setLoading] = useState(false);
  const [additionalMessage, setAdditionalMessage] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    if (id === null) {
      console.error("ID cannot be null.");
      return;
    }
    try {
      await CancelAppointment(shareURL, id, additionalMessage);
      toast({
        title: "Appointment Canceled",
        description: "The Appointment has been successfully canceled.",
      });
      window.location.reload()
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to cancel the appointment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <Textarea
            placeholder="Add reason for cancelling appointment..."
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
          />
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
