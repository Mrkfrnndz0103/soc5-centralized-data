"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        defaultTheme="light"
        storageKey="outbound-theme"
        themePresetKey="outbound-theme-preset"
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}
