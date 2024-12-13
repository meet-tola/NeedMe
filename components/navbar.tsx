"use client";

import Link from "next/link";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";
import { NotificationDropdown } from "./notification-dropdown";

export function Navbar() {
  return (
    <nav className="bg-background/80 dark:bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden text-gray-500 dark:text-gray-400"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <MobileMenu />
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo />
            </Link>
          </div>
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <Link
              href="/dashboard"
              className="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Appointment
            </Link>
            <Link
              href="#"
              className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Notification
            </Link>
            <Link
              href="#"
              className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function MobileMenu() {
  return (
    <div className="py-6 px-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Menu
      </h2>
      <nav className="space-y-4">
        <Link
          href="#"
          className="block py-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
        >
          Dashboard
        </Link>
        <Link
          href="#"
          className="block py-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
        >
          Team
        </Link>
        <Link
          href="#"
          className="block py-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
        >
          Projects
        </Link>
      </nav>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start mb-2 text-gray-700 dark:text-gray-300"
        >
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-700 dark:text-gray-300"
        >
          <User className="h-5 w-5 mr-2" />
          Profile
        </Button>
      </div>
    </div>
  );
}

// export function NotificationDropdown() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="relative text-gray-500 dark:text-gray-400"
//         >
//           <Bell className="h-5 w-5" />
//           <span className="sr-only">View notifications</span>
//           <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></div>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80">
//         <DropdownMenuItem>
//           <div className="flex items-start space-x-2">
//             <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//             <div className="flex flex-col">
//               <span className="font-medium dark:text-white">
//                 New Appointment
//               </span>
//               <span className="text-sm text-gray-500 dark:text-gray-400">
//                 You have a new appointment scheduled for tomorrow at 2 PM.
//               </span>
//             </div>
//           </div>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <div className="flex items-start space-x-2">
//             <div className="w-2 h-2 bg-transparent rounded-full mt-2"></div>
//             <div className="flex flex-col">
//               <span className="font-medium dark:text-white">
//                 Approve Appointment
//               </span>
//               <span className="text-sm text-gray-500 dark:text-gray-400">
//                 John Doe requested an appointment for next week. Please approve.
//               </span>
//             </div>
//           </div>
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <Button variant="ghost" className="w-full justify-center">
//             View all notifications
//           </Button>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
