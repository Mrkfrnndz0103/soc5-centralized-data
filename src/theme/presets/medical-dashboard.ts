export const medicalDashboardTheme = {
  name: "Medical Dashboard",
  light: {
    background: "0 0% 96%", // Light grey/off-white background (#F5F6FA)
    foreground: "0 0% 20%", // Dark grey/black text
    card: "0 0% 100%", // White cards
    "card-foreground": "0 0% 20%", // Dark text on cards
    primary: "215 60% 25%", // Navy blue for sidebar (#1A2B42)
    "primary-foreground": "0 0% 100%", // White text on navy
    secondary: "0 0% 92%", // Light grey for search bar
    "secondary-foreground": "0 0% 40%", // Dark grey placeholder text
    muted: "0 0% 94%", // Muted backgrounds
    "muted-foreground": "0 0% 45%", // Muted text
    accent: "25 95% 53%", // Blue accent for selected dates
    "accent-foreground": "0 0% 100%", // White text on accent
    border: "0 0% 88%", // Light borders
    // Additional colors for the dashboard cards
    "chart-1": "270 76% 53%", // Purple gradient for Active Patients
    "chart-2": "0 84% 60%", // Red gradient for Alerts Today
    "chart-3": "25 95% 53%", // Orange gradient for Escalations
    "chart-4": "0 0% 40%", // Dark grey for Unread Chats
    "chart-5": "215 60% 25%", // Navy for consistency
    // Status colors
    "success": "142 76% 36%", // Green for "On Going" status
    "warning": "38 92% 50%", // Orange for warning labels
    "destructive": "0 84% 60%", // Red for critical labels
  },
  dark: {
    background: "215 60% 8%", // Dark version of navy background
    foreground: "0 0% 95%", // Light text
    card: "215 60% 12%", // Dark cards
    "card-foreground": "0 0% 95%", // Light text on cards
    primary: "215 60% 25%", // Navy blue (consistent)
    "primary-foreground": "0 0% 100%", // White text
    secondary: "215 60% 18%", // Dark secondary
    "secondary-foreground": "0 0% 80%", // Light secondary text
    muted: "215 60% 18%", // Dark muted
    "muted-foreground": "0 0% 65%", // Muted text
    accent: "25 95% 53%", // Blue accent (consistent)
    "accent-foreground": "0 0% 100%", // White text
    border: "215 60% 22%", // Dark borders
    // Additional colors for the dashboard cards
    "chart-1": "270 76% 53%", // Purple gradient
    "chart-2": "0 84% 60%", // Red gradient
    "chart-3": "38 92% 50%", // Orange gradient
    "chart-4": "0 0% 80%", // Light grey for contrast
    "chart-5": "215 60% 25%", // Navy
    // Status colors
    "success": "142 76% 36%", // Green
    "warning": "38 92% 50%", // Orange
    "destructive": "0 84% 60%", // Red
  },
};
