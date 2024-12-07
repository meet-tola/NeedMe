import { Loader2 } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="animate-spin h-12 w-12" />
    </div>
  );
}

export default Loading;