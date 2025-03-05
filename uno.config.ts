import { defineConfig } from "unocss";
import { presetWind3 } from "unocss/preset-wind3";
import { presetTypography } from "unocss/preset-typography";

export const config = defineConfig({
  theme: {
    colors: {
      background: "var(--color-background)",
      "on-background": "var(--color-on-background)",
      primary: "var(--color-primary)",
      "on-primary": "var(--color-on-primary)",
    },
  },
  presets: [presetWind3(), presetTypography()],
});
