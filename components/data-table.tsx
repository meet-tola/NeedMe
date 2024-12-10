"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ViewFormBtn } from "./view-form-btn";
import { ScheduleAppointmentBtn } from "./schedule-appointment-btn";
import { CancelAppointmentBtn } from "./cancel-appointment-btn";
import { MoreHorizontal } from "lucide-react";
import { GetUserDetails } from "@/actions/user";
import { Skeleton } from "./ui/skeleton";
import { DeleteAppointmentBtn } from "./delete-appointment-btn";

export function DataTable({ shareURL }: { shareURL: string }) {
  const [viewFormOpen, setViewFormOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetUserDetails(shareURL);
        setData(response);
      } catch (err) {
        setError("Failed to fetch user details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareURL]);

  const handleAction = async (action: string, id: number) => {
    setSelectedId(id);
    switch (action) {
      case "view":
        setViewFormOpen(true);
        break;
      case "schedule":
        setScheduleOpen(true);
        break;
      case "cancel":
        setCancelOpen(true);
        break;
      case "delete":
        setDeleteOpen(true);
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 rounded-full"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Canceled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <SkeletonLoader />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {row.status === "canceled" ? (
                        <Button
                          size="sm"
                          onClick={() => handleAction("schedule", row.id)}
                        >
                          Reschedule
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction("schedule", row.id)}
                          >
                            Schedule
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction("cancel", row.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction("view", row.id)}
                          >
                            View form details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("delete", row.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  rowSpan={5}
                  className="text-center text-gray-500"
                >
                  No data now
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteAppointmentBtn
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        id={selectedId}
        shareURL={shareURL}
        onDeleteSuccess={() => {
          setData((prevData) =>
            prevData.filter((row) => row.id !== selectedId)
          );
        }}
      />

      <ViewFormBtn
        open={viewFormOpen}
        onOpenChange={setViewFormOpen}
        id={selectedId}
      />
      <ScheduleAppointmentBtn
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        shareURL={shareURL}
        id={selectedId}
      />
      <CancelAppointmentBtn
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        id={selectedId}
        shareURL={shareURL}
      />
    </>
  );
}

function SkeletonLoader() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[60px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-[200px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
