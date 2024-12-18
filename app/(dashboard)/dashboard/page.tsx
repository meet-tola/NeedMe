import { BusinessDetails } from "@/components/business-details";
import DashboardContent from "@/components/dashboard-content";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:px-6 lg:px-8 px-4 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overviews</h1>
        <div className="flex items-center gap-2">
          <BusinessDetails />
        </div>
      </div>

      <DashboardContent />
    </div>
  );
}
