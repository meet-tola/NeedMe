import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleAppointment } from "@/actions/user";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareURL: string;
  id: number | null;
}

export function ScheduleAppointmentBtn({
  open,
  onOpenChange,
  shareURL,
  id,
}: ScheduleDialogProps) {
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleProceed = async () => {
    setLoading(false);
    if (id === null) {
      console.error("ID cannot be null.");
      return;
    }
    try {
      await ScheduleAppointment(shareURL, id);
      window.location.reload()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(true);
      console.log("Additional message:", additionalMessage);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            User will recieve a notification for the approval of the appointment
          </p>
          <Textarea
            placeholder="Add additional message..."
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleProceed} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
              </div>
            ) : (
              "Proceed"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
