import { GetFormStats, GetForms } from "@/actions/form";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ReactNode, Suspense, } from "react";
import { Separator } from "./ui/separator";
import CreatFormBtn from "./create-form-button";
import React from "react";
import FormCard from "./form-card";

export default function DashboardContent() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <h2 className="text-2xl font-bold col-span-2 mt-4">
        My Appointment Forms
      </h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CreatFormBtn />
        <Suspense fallback={<FormCardsSkeleton />}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}
function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;
  return (
    <div className="w-full pt-0 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Appointments"
        icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
        helperText="All scheduled appointments"
        value={data?.allScheduledAppointments.toLocaleString() || ""}
        loading={loading}
      />

      <StatsCard
        title="Pending Approvals"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        helperText="Appointments awaiting approval"
        value={data?.allPendingAppointments.toLocaleString() || ""}
        loading={loading}
      />

      <StatsCard
        title="Active Appointment Forms"
        icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        helperText="Forms currently in progress"
        value={data?.publishedFormsCount.toLocaleString() || ""}
        loading={loading}
      />
      <StatsCard
        title="Cancelled Appointments"
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        helperText="All cancelled appointments"
        value={data?.cancelledAppointments.toLocaleString() || ""}
        loading={loading}
      />
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
}: {
  title: string;
  value: string;
  helperText: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg dark:hover:shadow-primary/25 hover:shadow-primary/15 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

// Skeleton fallback for forms
function FormCardsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((el) => (
        <Skeleton
          key={el}
          className="border-2 border-primary/20 h-[190px] w-full"
        />
      ))}
    </>
  );
}

const FormCards = React.lazy(async () => {
  const forms = await GetForms();
  return {
    default: () => {
      if (forms.length === 0) {
        return (
          <>
            {[1, 2, 3].map((el) => (
              <Skeleton
                key={el}
                className="border-2 border-primary/20 h-[190px] w-full"
              />
            ))}
          </>
        );
      }

      return (
        <>
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </>
      );
    },
  };
});



