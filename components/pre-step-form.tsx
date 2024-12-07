"use client";
import React from "react";
import { z } from "zod";
import FormSubmitComponent from "@/components/form-submit-component";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FormElementInstance } from "./builders/form-element";
import { UserSchemaType, userSchema } from "@/schema/users";
import { CreateForm } from "@/actions/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function PreStepForm({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementInstance[];
}) {
  const [preStepCompleted, setPreStepCompleted] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue, // To set the default formUrl value
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      formId: "", 
    },
  });

  React.useEffect(() => {
    setValue("formId", formUrl);
  }, [formUrl, setValue]);

  const onSubmit = async (values: UserSchemaType) => {
    try {
      const formId = await CreateForm(values);

      toast({
        title: "Success",
        description: "Form created successfully",
      });

      setPreStepCompleted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  };

  if (preStepCompleted) {
    return <FormSubmitComponent formUrl={formUrl} content={content} />;
  }

  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
        <h1 className="text-2xl font-bold">Welcome to the Form</h1>
        <p className="text-muted-foreground">
          Please fill out the information below to continue.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="block w-full mt-1 p-2 border rounded"
              placeholder="Enter your name"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="block w-full mt-1 p-2 border rounded"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Phone Number
            </label>
            <input
              type="text"
              {...register("phone")}
              className="block w-full mt-1 p-2 border rounded"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
          </div>
          <Button className="mt-4" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default PreStepForm;
