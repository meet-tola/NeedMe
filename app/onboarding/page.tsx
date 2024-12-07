"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { businessSchema, BusinessFormData } from "@/schema/business";
import { LogoUpload } from "@/components/logo-upload";
import { CreateBusiness, GetBusinessId } from "@/actions/business";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

export default function OnboardingPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkBusiness() {
      try {
        const businessId = await GetBusinessId();
        if (businessId) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.log("No business details found for user:", error);
      }
    }
    checkBusiness();
  }, [router]);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      contactInfo: "",
      address: "",
      operatingHours: "",
    },
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoUrl(result);
        form.setValue("logoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    try {
      const businessId = await CreateBusiness(data);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating business:", error);
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Content */}
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          {/* SaaS Logo */}
          <div className="mb-8">
            <Logo />
          </div>

          <h1 className="text-3xl font-bold mb-6">
            Welcome! Let's set up your business
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Upload */}
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Logo</FormLabel>
                    <FormControl>
                      <LogoUpload
                        onLogoChange={(logo) => {
                          field.onChange(logo);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your business name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Info */}
              <FormField
                control={form.control}
                name="contactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone, email, website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your business address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Operating Hours */}
              <FormField
                control={form.control}
                name="operatingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Hours</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-3PM"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {!form.formState.isSubmitting && (
                  <span>Save Business Details</span>
                )}
                {form.formState.isSubmitting && (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Banner Image */}
      <div className="hidden lg:block lg:w-[28%] relative">
        <Image
          src="https://via.placeholder.com/500"
          alt="Onboarding Banner"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
