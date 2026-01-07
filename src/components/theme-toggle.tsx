"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-11 w-11 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:rotate-90 dark:scale-0 [data-theme='dark']_&:rotate-90 [data-theme='dark']_&:scale-0 group-hover:scale-110 group-hover:rotate-180" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 [data-theme='dark']_&:rotate-0 [data-theme='dark']_&:scale-100 group-hover:scale-110 group-hover:-rotate-12" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
