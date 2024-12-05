import { GetFormStats, GetForms } from "@/actions/form";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpLeftFromSquare,
  CalendarDays,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Edit2,
  FormInput,
  View,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Suspense } from "react";
import { Separator } from "./ui/separator";
import CreatFormBtn from "./create-form-button";
import { Form } from "@prisma/client";
import { Badge } from "./ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "./ui/button";
import Link from "next/link";
import React from "react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  data: Awaited<ReturnType<typeof GetFormStats>>;
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
        value={data?.totalAppointments.toLocaleString() || ""}
        loading={loading}
      />

      <StatsCard
        title="Pending Approvals"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        helperText="Appointments awaiting approval"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
      />

      <StatsCard
        title="Active Appointment Forms"
        icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        helperText="Forms currently in progress"
        value={data?.submissionsRate.toLocaleString() || ""}
        loading={loading}
      />
      <StatsCard
        title="Completed Appointments"
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        helperText="Successfully completed appointments"
        value={data?.bounceRate.toLocaleString() || ""}
        loading={loading}
      />
    </div>
  );
}

function StatsCard({
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
    <Card>
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
    default: () => (
      <>
        {forms.map((form) => (
          <FormCard key={form.id} form={form} />
        ))}
      </>
    ),
  };
});

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-item gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge className="rounded-full">Publish</Badge>}
          {!form.published && (
            <Badge variant={"destructive"} className="rounded-full">
              Draft
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {form.published && (
            <span className="flex items-center gap-2">
              <View /> <span>{form.totalAppointments.toLocaleString()}</span>
              <ClipboardCheck />{" "}
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 mt-3">
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              View booking <ArrowRight />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            variant={"outline"}
          >
            <Link href={`/builder/${form.id}`}>
              <Edit2 /> Edit form
            </Link>
          </Button>
        )}
        <Button variant="outline" size="sm">
          Share Link
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
