"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page() {
  const { theme } = useTheme();

  const signInAppearance = {
    baseTheme: theme === "dark" ? dark : undefined
  };

  return (
    <div className="flex min-h-screen">
      {/* Centered SignIn Component */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <SignIn appearance={signInAppearance} />
        </div>
      </div>

      {/* Banner Image */}
      <div className="hidden lg:block lg:w-[28%] relative">
        <Image
          src={theme === "dark" ? "/onboarding.png" : "/onboarding2.png"}
          alt="Onboarding Banner"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
