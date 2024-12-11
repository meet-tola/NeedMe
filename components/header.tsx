"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { NavItem } from "./header-item"
import { ThemeToggle } from "./ThemeToggle"
import Logo from "./Logo"
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "pricing", href: "/#pricing" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const { user, isSignedIn } = useUser();

  if (user) {
    return redirect("/onboarding");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavItem key={item.name} href={item.href}>
                {item.name}
              </NavItem>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
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
                    <Button variant="outline">
                    Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </div>
              </SignedOut>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavItem href={item.href} onClick={() => setIsOpen(false)}>
                    {item.name}
                  </NavItem>
                </motion.div>
              ))}
            </div>
            <div className="px-4 py-3 space-y-2">
              <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                Log in
              </Button>
              <Button className="w-full" onClick={() => setIsOpen(false)}>
                Sign up
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

