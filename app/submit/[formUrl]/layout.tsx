import { BusinessHeader } from "@/components/business-header";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div className="pattern-dots pattern-gray-100 pattern-bg-white dark:pattern-gray-900 dark:pattern-bg-black pattern-size-4 pattern-opacity-100">
        {children}
      </div>
      
    </div>
  );
}

export default Layout;
