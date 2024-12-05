import { EyeClosed, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

export default function PreviewDialogBtn() {
  return (
      <Button variant={"outline"} className="gap-2">
        <EyeClosed />
        Preview
      </Button>
  );
}
