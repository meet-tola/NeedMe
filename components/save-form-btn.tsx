import { Save } from "lucide-react";
import { Button } from "./ui/button";

export default function SaveFormBtn() {
  return (
      <Button variant={"outline"} className="gap-2">
        <Save />
        Save
      </Button>
  );
}
