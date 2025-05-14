"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // During SSR and hydration, render a placeholder
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
        <span className="sr-only">Toggle theme</span>
        <Moon className="h-4 w-4" />
      </Button>
    )
  }

  function toggleTheme() {
    console.log("Current theme:", theme)
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-8 h-8">
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
