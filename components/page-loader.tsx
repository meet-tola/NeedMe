import { Loader2 } from "lucide-react";

export default function PageLoader() {
    return (
        <div className="flex items-center justify-center h-screen">
      <Loader2 className="dark:text-white animate-spin h-10 w-10" />
    </div>
    );
}