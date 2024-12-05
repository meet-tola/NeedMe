import { Share } from "lucide-react";
import { Button } from "./ui/button";

export default function PublishFormBtn() {
  return (
    <Button className="gap-2">
      <Share />
      Publish
    </Button>
  );
}
