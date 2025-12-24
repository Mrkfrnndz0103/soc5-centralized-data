import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { themePresets } from "@/theme/presets"

export function ThemePresetSelector() {
  const { themePreset, setThemePreset } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-accent transition-all duration-200"
          aria-label="Select theme preset"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Theme Preset</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(themePresets).map(([key, preset]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setThemePreset(key as any)}
            className={themePreset === key ? "bg-accent" : ""}
          >
            {preset.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
