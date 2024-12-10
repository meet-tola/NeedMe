"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { UserSchemaType, userSchema } from "@/schema/users";
import { CreateUserDetails } from "@/actions/user";
import FormSubmitComponent from "@/components/form-submit-component";
import { FormElementInstance } from "./builders/form-element";

export default function PreStepForm({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementInstance[];
}) {
  const [preStepCompleted, setPreStepCompleted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null); 

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      formShareURL: "",
    },
  });

  useEffect(() => {
    form.setValue("formShareURL", formUrl);
  }, [formUrl, form]);

  async function onSubmit(values: UserSchemaType) {
    try {
      const userDetails = await CreateUserDetails(values); 
      setUserId(userDetails.id);
      toast({
        title: "Success",
        description: "Form submitted successfully",
      });

      setPreStepCompleted(true); 
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }

  if (preStepCompleted) {
    return (
      <FormSubmitComponent
        formUrl={formUrl}
        content={content}
        userDetailsId={userId} 
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Welcome to the Form</h1>
      <p className="text-muted-foreground mb-6">
        Please fill out the information below to continue.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Name
          </label>
          <Input
            type="text"
            {...form.register("name")}
            placeholder="Enter your name"
            className="w-full"
          />
          {form.formState.errors.name && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Email
          </label>
          <Input
            type="email"
            {...form.register("email")}
            placeholder="Enter your email"
            className="w-full"
          />
          {form.formState.errors.email && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.email.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Phone Number
          </label>
          <Input
            type="text"
            {...form.register("phone")}
            placeholder="Enter your phone number"
            className="w-full"
          />
          {form.formState.errors.phone && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.phone.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-4"
        >
          {!form.formState.isSubmitting && <span>Submit</span>}
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </div>
  );
}
