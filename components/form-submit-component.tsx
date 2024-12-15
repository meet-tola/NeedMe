"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FormElementInstance, FormElements } from "./builders/form-element";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { SubmitForm } from "@/actions/form";
import { CheckCircle, Loader2, MousePointerClick } from "lucide-react";
import { BusinessFooter } from "./business-footer";
import { motion } from "framer-motion";
import Link from "next/link";

function FormSubmitComponent({
  formUrl,
  content,
  userDetailsId,
}: {
  content: FormElementInstance[];
  formUrl: string;
  userDetailsId: number;
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);

      // Pass userId to SubmitForm
      await SubmitForm(formUrl, jsonContent, userDetailsId);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-500 dark:shadow-blue-900 rounded-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Form Submitted Successfully
          </h1>
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-20 h-20 text-purple-700" />
            </motion.div>
            {showContent && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-foreground text-lg"
              >
                Thank you for your appointment booking. We have received your
                information and will process it shortly.{" "}
                <span className="text-purple-700 hover:underline">
                  <Link href={"/"}>Visit Talktrack to learn more</Link>
                </span>
              </motion.p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 justify-center w-full h-full items-center pt-8">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-500 dark:shadow-blue-900 rounded-md"
      >
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={() => {
            startTransition(submitForm);
          }}
          disabled={pending}
        >
          {!pending && (
            <>
              <MousePointerClick className="mr-2" />
              Submit
            </>
          )}
          {pending && <Loader2 className="animate-spin" />}
        </Button>
      </div>
      {/* <BusinessFooter /> */}
    </div>
  );
}

export default FormSubmitComponent;
