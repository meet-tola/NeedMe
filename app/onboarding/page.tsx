"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useTheme } from "next-themes";
import PageLoader from "@/components/page-loader";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function OnboardingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState("/onboarding.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImageSrc(theme === "dark" ? "/onboarding.png" : "/onboarding2.png");
  }, [theme]);

  useEffect(() => {
    async function checkBusiness() {
      try {
        const businessId = await GetBusinessId();
        if (businessId) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.log("No business details found for user:", error);
      } finally {
        setLoading(false);
      }
    }
    checkBusiness();
  }, [router]);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phoneNumber: "",
      address: "",
      operatingHours: "",
    },
  });

  const onSubmit = async (data: BusinessFormData) => {
    try {
      await CreateBusiness(data);
      toast({
        description: "Business profile created successfully",
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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Content */}
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          {/* SaaS Logo and Sign Out */}
          <div className="mb-8 flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <SignedIn>
                <SignOutButton>
                  <Button variant="outline">
                    <LogOut />
                  </Button>
                </SignOutButton>
              </SignedIn>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6">
            Welcome! Let&apos;s set up your business
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
              <div className="flex flex-col md:flex-row gap-6 md:gap-4 w-full">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
          src={imageSrc}
          alt="Onboarding Banner"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
