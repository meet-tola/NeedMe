"use client";

import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon, Calendar, Clock, CheckIcon, UserPlus, PenTool, Send } from 'lucide-react';
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import DotPattern from "@/components/dot-pattern";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ReactNode, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  backgroundColor: string;
  index: number;
}

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  backgroundColor: string;
  highlighted?: boolean;
  index: number;
}

interface RoadmapStepProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

export default function Home() {
  const { user, isSignedIn } = useUser();
  const { theme } = useTheme();

  if (user) {
    return redirect("/onboarding");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mt-12 md:mt-0">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="justify-center flex">
                <div className="flex flex-row items-center justify-center gap-2 md:gap-5 px-2 p-1 md:p-2 text-sm backdrop-blur-sm rounded-full bg-background/80 dark:bg-background/20 border border-border z-10">
                  <Badge
                    variant="secondary"
                    className="font-semibold rounded-full px-3 py-1"
                  >
                    New
                  </Badge>
                  <h5 className="text-foreground/80">
                    Easy Scheduling, Exceptional Service
                  </h5>
                  <Link
                    href="/"
                    className="hidden md:flex flex-row items-center text-primary hover:underline"
                  >
                    View all features
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Schedule your Appointment
                  </span>
                </h1>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mt-2">
                  <span className="bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent">
                    with Talktrack
                  </span>
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                  Expert consultations tailored to your needs. Choose a time
                  that works for you and let&apos;s start your journey to
                  success.
                </p>
              </div>
              <div className="flex flex-row gap-4 mt-8">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      View My Appointments
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                )}
                <Link href={"#how-it-works"}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    How it works
                  </Button>
                </Link>
              </div>
            </div>
            <motion.div 
              className="mt-16 relative mx-auto max-w-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >

              <Image
          src={theme === "dark" ? "/dashboard-dark.png" : "/dashboard.png"}
          alt="Talktrack Dashboard Preview"
                width={1920}
                height={1080}
                className="rounded-lg shadow-2xl"
              />
              <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                  "absolute -bottom-12 -left-12 -z-10 fill-primary/20 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
                )}
              />
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" id="features">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Talktrack?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Clock className="h-8 w-8" />}
                title="Flexible Scheduling"
                description="Book appointments at your convenience, 24/7."
                backgroundColor="from-blue-600/20 to-purple-600/20"
                index={0}
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8" />}
                title="Expert Consultation"
                description="Benefit from years of industry experience and knowledge."
                backgroundColor="from-green-600/20 to-teal-600/20"
                index={1}
              />
              <FeatureCard
                icon={<CheckIcon className="h-8 w-8" />}
                title="Satisfaction Guaranteed"
                description="Your success is our priority. We ensure top-quality service."
                backgroundColor="from-orange-600/20 to-red-600/20"
                index={2}
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32" id="how-it-works">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <RoadmapStep
                icon={<UserPlus className="h-8 w-8" />}
                title="Sign Up"
                description="Create your account in minutes."
                index={0}
              />
              <RoadmapStep
                icon={<Clock className="h-8 w-8" />}
                title="Onboarding"
                description="Set your preferences and availability."
                index={1}
              />
              <RoadmapStep
                icon={<PenTool className="h-8 w-8" />}
                title="Create Forms"
                description="Design custom forms for your clients."
                index={2}
              />
              <RoadmapStep
                icon={<Send className="h-8 w-8" />}
                title="Collect Appointments"
                description="Share forms and start booking!"
                index={3}
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32" id="pricing">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price={0}
                description="Ideal for individuals"
                features={[
                  "1 user",
                  "5 appointments per month",
                  "Basic analytics",
                  "Email support",
                ]}
                backgroundColor="from-blue-600/20 to-purple-600/20"
                index={0}
              />
              <PricingCard
                title="Pro"
                price={29}
                description="Perfect for small teams"
                features={[
                  "Up to 5 users",
                  "Unlimited appointments",
                  "Advanced analytics",
                  "Priority support",
                ]}
                backgroundColor="from-green-600/20 to-teal-600/20"
                highlighted={true}
                index={1}
              />
              <PricingCard
                title="Enterprise"
                price={99}
                description="For large organizations"
                features={[
                  "Unlimited users",
                  "Unlimited appointments",
                  "Custom analytics",
                  "24/7 phone support",
                ]}
                backgroundColor="from-orange-600/20 to-red-600/20"
                index={2}
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground dark:bg-gradient-to-r dark:from-purple-700 dark:to-blue-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="text-xl max-w-[600px]">
                Join Talktrack today and transform the way you manage appointments.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/sign-up">Start Your Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-6 md:py-0">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:h-16 px-8">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Talktrack. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  backgroundColor,
  index,
}: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "gradient-border relative flex flex-col gap-5 rounded-lg bg-gradient-to-b via-transparent p-6 text-center before:bg-gradient-to-b before:to-transparent md:bg-gradient-to-br md:text-left md:before:bg-gradient-to-br",
        backgroundColor
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <span
        className={cn(
          "gradient-border relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b to-transparent before:bg-gradient-to-b before:via-transparent before:to-transparent md:ml-0 md:bg-gradient-to-br md:before:bg-gradient-to-br",
          backgroundColor
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-3">
        <h3 className="scroll-m-20 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
          {title}
        </h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  backgroundColor,
  highlighted = false,
  index,
}: PricingCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "gradient-border relative flex flex-col gap-6 rounded-lg bg-gradient-to-b via-transparent p-8 text-left before:bg-gradient-to-b before:to-transparent md:bg-gradient-to-br md:before:bg-gradient-to-br",
        backgroundColor,
        highlighted && "ring-2 ring-primary shadow-lg"
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex flex-col gap-3 text-left">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={highlighted ? "default" : "outline"}>
        Get started
      </Button>
    </motion.div>
  );
}

function RoadmapStep({ icon, title, description, index }: RoadmapStepProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      className="flex flex-col items-center text-center space-y-2"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="bg-primary/10 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

