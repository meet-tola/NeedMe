"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-6 w-auto">
      {theme === "dark" ? (
        <img src="/logo-dark.svg" alt="NeedMe Logo" className="h-full w-auto" />
      ) : (
        <img src="/logo.svg" alt="NeedMe Logo" className="h-full w-auto" />
      )}
    </div>
  );
}
