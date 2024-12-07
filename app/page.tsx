"use client";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, isSignedIn } = useUser();

  if (user) {
    return redirect("/onboarding");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background h-[10vh] flex items-center">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-x-3">
            <ThemeToggle />

            {isSignedIn ? (
              <SignedIn>
                <SignOutButton>
                  <Button>Logout</Button>
                </SignOutButton>
              </SignedIn>
            ) : (
              <SignedOut>
                <div className="flex items-center gap-x-2">
                  <Link href="/signin">
                    <Button variant="ghost" className="text-base font-medium">
                      Client Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="text-base font-medium">Register</Button>
                  </Link>
                </div>
              </SignedOut>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="mx-auto mb-5 mt-[8rem] lg:mt-0 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full backdrop-blur-sm bg-blue-400/30 px-7 py-2 text-black dark:text-white">
                <Calendar className="h-5 w-5" />
                <p className="text-sm font-semibold">
                  Easy Scheduling, Exceptional Service
                </p>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Book Your Appointment with NeedMe
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Expert consultations tailored to your needs. Choose a time
                  that works for you and let&apos;s start your journey to
                  success.
                </p>
              </div>
              <div className="space-x-4">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button className="text-base font-medium">
                      View My Appointments
                    </Button>
                  </Link>
                ) : (
                  <Link href="/book">
                    <Button className="text-base font-medium">Book Now</Button>
                  </Link>
                )}
                <Link href="/services">
                  <Button variant="outline" className="text-base font-medium">
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              Why Choose Jane Doe?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Clock className="h-8 w-8 text-blue-500" />}
                title="Flexible Scheduling"
                description="Book appointments at your convenience, 24/7."
              />
              <FeatureCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                }
                title="Expert Consultation"
                description="Benefit from years of industry experience and knowledge."
              />
              <FeatureCard
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                title="Satisfaction Guaranteed"
                description="Your success is our priority. We ensure top-quality service."
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background h-[10vh] flex items-center">
        <div className="container flex justify-between items-center">
          <p>&copy; 2024 NeedMe. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { ReactNode } from "react";
import Logo from "@/components/Logo";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
      {icon}
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
