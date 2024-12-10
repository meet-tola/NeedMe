"use client";
import { DeleteFormById } from "@/actions/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Edit2, MoreHorizontal } from "lucide-react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Form } from "@prisma/client";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

export default function FormCard({ form }: { form: Form }) {
  const handleDelete = async () => {
    try {
      await DeleteFormById(form.id);
      toast({
        title: "Deleted",
        description: "The form has been successfully deleted.",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: "Failed to delete the form. Please try again later.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Share Link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription className="h-[20px] truncate text-sm text-muted-foreground">
          {form.description || "No description"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center text-muted-foreground text-sm gap-2">
        {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
        {form.published ? (
          <Badge className="rounded-full">Publish</Badge>
        ) : (
          <Badge variant={"destructive"} className="rounded-full">
            Draft
          </Badge>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        {form.published ? (
          <Button asChild className="w-full">
            <Link href={`/appointment/${form.id}`}>
              View Appointment <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button asChild variant={"outline"} className="w-full">
            <Link href={`/builder/${form.id}`}>
              <Edit2 /> Edit form
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
