"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { themePresets, ThemePreset } from "@/theme/presets"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  defaultThemePreset?: ThemePreset
  themePresetKey?: string
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
  defaultThemePreset = "default",
  themePresetKey = "vite-ui-theme-preset",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [themePreset, setThemePreset] = useState<ThemePreset>(defaultThemePreset)

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    const storedPreset = localStorage.getItem(themePresetKey) as ThemePreset | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
    if (storedPreset) {
      setThemePreset(storedPreset)
    }
  }, [storageKey, themePresetKey])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme-related classes
    root.classList.remove("light", "dark")
    Object.keys(themePresets).forEach(preset => {
      root.classList.remove(`theme-${preset}`)
    })

    // Apply the current theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      root.setAttribute("data-theme", systemTheme)
    } else {
      root.classList.add(theme)
      root.setAttribute("data-theme", theme)
    }

    // Apply the current theme preset
    if (themePreset) {
      root.classList.add(`theme-${themePreset}`)
      // Apply preset-specific styles
      const preset = themePresets[themePreset]
      if (preset && preset.properties) {
        Object.entries(preset.properties).forEach(([property, value]) => {
          root.style.setProperty(property, value)
        })
      }
    }
  }, [theme, themePreset])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    themePreset,
    setThemePreset: (preset: ThemePreset) => {
      localStorage.setItem(themePresetKey, preset)
      setThemePreset(preset)
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
