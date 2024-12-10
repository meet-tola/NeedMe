import { GetFormById, GetFormStats } from "@/actions/form";
import FormLinkShare from "@/components/form-link-share";
import LinkBtn from "@/components/link-btn";
import React from "react";

import { StatsCard } from "@/components/dashboard-content";
import { AlertCircle, CalendarDays, CheckCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/data-table";

interface FormDetailPageProps {
  params: {
    id: string;
  };
}

async function FormDetailPage({ params }: FormDetailPageProps) {
  const { id } = params;
  const form = await GetFormById(Number(id));
  const stats = await GetFormStats(Number(id));
  if (!form) {
    throw new Error("form not found");
  }
  return (
    <>
      <div className="py-10 border-b border-muted">
        <h1 className="text-4xl font-bold truncate">{form.name}</h1>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
          <LinkBtn shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Pending Approvals"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          helperText="Appointment awaiting approval"
          value={stats.pendingAppointments.toLocaleString() || ""}
          loading={false}
        />

        <StatsCard
          title="Scheduled Appointment"
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          helperText="All scheduled appointment"
          value={stats.scheduledAppointments.toLocaleString() || ""}
          loading={false}
        />

        <StatsCard
          title="Total Appointment Visit"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          helperText="Visits that result in appointment submission"
          value={stats.formVisitCount.toLocaleString() || ""}
          loading={false}
        />

        <StatsCard
          title="Cancelled Appointments"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          helperText="All cancelled appointments"
          value={stats.cancelledAppointments.toLocaleString() || ""}
          loading={false}
        />
      </div>

      <div className="container pt-10">
        <DataTable shareURL={form.shareURL} />
      </div>
    </>
  );
}

export default FormDetailPage;
