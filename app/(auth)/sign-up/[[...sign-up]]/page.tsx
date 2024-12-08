import { SignUp } from '@clerk/nextjs'
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen">
    <div className="flex-1 p-8 lg:p-12 items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <SignUp />
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
  </div>)
}