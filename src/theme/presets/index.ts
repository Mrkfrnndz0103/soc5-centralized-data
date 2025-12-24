import { defaultTheme } from "./default";
import { oceanTheme } from "./ocean";
import { forestTheme } from "./forest";
import { sunsetTheme } from "./sunset";
import { purpleTheme } from "./purple";
import { roseTheme } from "./rose";

export const themePresets = {
  default: defaultTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  purple: purpleTheme,
  rose: roseTheme,
};

export type ThemePreset = keyof typeof themePresets;
