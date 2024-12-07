import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/form-link-share";
import LinkBtn from "@/components/link-btn";
import React, { ReactNode } from "react";
import {
  ElementsType,
  FormElementInstance,
} from "@/components/builders/form-element";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StatsCard } from "@/components/dashboard-content";
import { AlertCircle, CalendarDays, CheckCircle, Clock } from "lucide-react";

async function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const form = await GetFormById(Number(id));
  if (!form) {
    throw new Error("form not found");
  }

  const { totalAppointments, submissions } = form;

  let submissionRate = 0;

  if (totalAppointments > 0) {
    submissionRate = (submissions / totalAppointments) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <LinkBtn shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Pending Approvals"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          helperText="Appointment awaiting approval"
          value={totalAppointments.toLocaleString() || ""}
          loading={false}
        />

        <StatsCard
          title="Total Appointment"
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          helperText="All scheduled appointment"
          value={submissions.toLocaleString() || ""}
          loading={false}
        />

        <StatsCard
          title="Total Appointment Visit"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          helperText="Visits that result in appointment submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
        />

        <StatsCard
          title="Cancelled Appointments"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          helperText="All cancelled appointments"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
        />
      </div>

      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("form not found");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
