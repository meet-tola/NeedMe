import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
}

export function NavItem({ href, children, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        "block px-3 py-2 rounded-md text-base font-medium",
        "md:inline-block md:px-0 md:py-0"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

