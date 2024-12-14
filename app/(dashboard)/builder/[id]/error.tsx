"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full px-6 py-8 bg-card rounded-lg shadow-lg text-center">
        <AlertOctagon className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Oops! Something went wrong
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We're sorry, but we encountered an unexpected error. Our team has been
          notified and is working to fix it.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
          <Button variant="outline" onClick={() => reset()}>
            Try again
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-muted rounded-md text-left">
            <h2 className="text-sm font-semibold text-foreground">
              Error details:
            </h2>
            <p className="mt-2 text-xs text-muted-foreground break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
