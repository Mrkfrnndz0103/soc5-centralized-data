import { createContext, useContext, useEffect, useState } from "react"
import { themePresets, type ThemePreset } from "@/theme/presets"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  themePreset: ThemePreset
  setThemePreset: (preset: ThemePreset) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themePreset: "default",
  setThemePreset: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [themePreset, setThemePresetState] = useState<ThemePreset>(
    () => (localStorage.getItem("theme-preset") as ThemePreset) || "default"
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    const activeTheme = theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme

    root.setAttribute("data-theme", activeTheme)

    const preset = themePresets[themePreset]
    const colors = preset[activeTheme as "light" | "dark"]

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [theme, themePreset])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    themePreset,
    setThemePreset: (preset: ThemePreset) => {
      localStorage.setItem("theme-preset", preset)
      setThemePresetState(preset)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
