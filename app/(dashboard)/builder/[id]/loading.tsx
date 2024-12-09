import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="dark:text-white animate-spin h-12 w-12" />
    </div>
  );
}
