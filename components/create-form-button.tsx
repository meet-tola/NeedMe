"use client";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Loader2, PlusSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formSchema, formSchemaType } from "@/schema/form";
import { CreateForm } from "@/actions/form";
import { useRouter } from "next/navigation";

export default function CreatFormBtn() {
    const router = useRouter();
    const form = useForm<formSchemaType>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",        
        description: "",  
      },
    });
    

  async function onSubmit(values: formSchemaType) {
    try {
      const formId = await CreateForm(values);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      router.push(`/builder/${formId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
          >
            <PlusSquare className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
            <p className="font-bold text-xl text-muted-foreground group-hover:text-primary"></p>
            Create new form
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Appointment Form</DialogTitle>
            <DialogDescription>
              Create a new form to start collecting responses.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full mt-4"
            >
              {!form.formState.isSubmitting && <span>Save</span>}
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
