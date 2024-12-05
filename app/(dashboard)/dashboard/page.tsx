import { BusinessDetails } from "@/components/business-details";
import DashboardContent from "@/components/dashboard-content";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Overviews</h1>
          <div className="flex items-center gap-2">
            <BusinessDetails />
            <Button className="flex gap-2 items-center">
              <Plus />
              {/* Create Appointment  */}
            </Button>
          </div>
        </div>

        <DashboardContent />
      </div>
    </>
  );
}
