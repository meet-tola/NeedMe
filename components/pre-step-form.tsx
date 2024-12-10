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
import { BusinessHeader } from "./business-header";

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
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }

  if (preStepCompleted && userId !== null) {
    return (
      <FormSubmitComponent
        formUrl={formUrl}
        content={content}
        userDetailsId={userId}
      />
    );
  }

  return (
    <div className="flex flex-col gap-10 justify-center w-full h-full items-center pt-8">
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-500 dark:shadow-blue-900 rounded-md">
        <h1 className="text-2xl font-bold text-center ">
          Welcome to Talktrack Form
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please fill out the information below to continue.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              type="text"
              {...form.register("name")}
              placeholder="Enter your name"
              className="w-full mt-1"
            />
            {form.formState.errors.name && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              {...form.register("email")}
              placeholder="Enter your email"
              className="w-full mt-1"
            />
            {form.formState.errors.email && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              type="text"
              {...form.register("phone")}
              placeholder="Enter your phone number"
              className="w-full mt-1"
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
            className="w-full flex items-center justify-center gap-2"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </form>
      </div>
      <BusinessHeader />

    </div>
  );
}
