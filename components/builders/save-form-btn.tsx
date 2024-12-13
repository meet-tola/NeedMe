import React, { useTransition } from "react";
import { Button } from "../ui/button";
import useDesigner from "@/hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      console.log("Content details", jsonElements);
      
      await UpdateFormContent(id, jsonElements);
      toast({
        description: "Your form has been saved",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <Save className="h-4 w-4" />
      Save
      {loading && <Loader2 className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;