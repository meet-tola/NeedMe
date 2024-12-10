import { DeleteUserDetails } from "@/actions/user";
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

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: number | null;
  shareURL: string;
  onDeleteSuccess?: () => void; 
}

export function DeleteAppointmentBtn({
  open,
  onOpenChange,
  id,
  shareURL,
  onDeleteSuccess,
}: DeleteAlertDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    if (id === null) {
      console.error("ID cannot be null.");
      return;
    }
    try {
      await DeleteUserDetails(shareURL, id);
      if (onDeleteSuccess) onDeleteSuccess(); 
      toast({
        title: "Deleted",
        description: "The appointment has been successfully deleted.",
      });

      // window.location.reload();
    } catch (error) {
      console.error("Failed to delete the record:", error);
      toast({
        title: "Error",
        description: "Failed to delete the appointment. Please try again later.",
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
          <AlertDialogTitle>
            Are you sure you want to delete this record?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The record will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, go back</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </div>
            ) : (
              "Yes, delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
