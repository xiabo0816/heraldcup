import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        /* MD3 Surface (Neutral) */
        surface: {
          DEFAULT: "var(--md-sys-color-surface)",
          dim: "var(--md-sys-color-surface-dim)",
          bright: "var(--md-sys-color-surface-bright)",
          "container-lowest": "var(--md-sys-color-surface-container-lowest)",
          "container-low": "var(--md-sys-color-surface-container-low)",
          container: "var(--md-sys-color-surface-container)",
          "container-high": "var(--md-sys-color-surface-container-high)",
          "container-highest": "var(--md-sys-color-surface-container-highest)",
        },
        "on-surface": {
          DEFAULT: "var(--md-sys-color-on-surface)",
          variant: "var(--md-sys-color-on-surface-variant)",
        },
        /* MD3 Outline */
        outline: {
          DEFAULT: "var(--md-sys-color-outline)",
          variant: "var(--md-sys-color-outline-variant)",
        },
        /* MD3 Primary (Gold) */
        primary: {
          DEFAULT: "var(--md-sys-color-primary)",
          container: "var(--md-sys-color-primary-container)",
        },
        "on-primary": {
          DEFAULT: "var(--md-sys-color-on-primary)",
          container: "var(--md-sys-color-on-primary-container)",
        },
        /* MD3 Secondary (Warm Grey) */
        secondary: {
          DEFAULT: "var(--md-sys-color-secondary)",
          container: "var(--md-sys-color-secondary-container)",
        },
        "on-secondary": {
          DEFAULT: "var(--md-sys-color-on-secondary)",
          container: "var(--md-sys-color-on-secondary-container)",
        },
        /* MD3 Tertiary (Cool Blue) */
        tertiary: {
          DEFAULT: "var(--md-sys-color-tertiary)",
          container: "var(--md-sys-color-tertiary-container)",
        },
        "on-tertiary": {
          DEFAULT: "var(--md-sys-color-on-tertiary)",
          container: "var(--md-sys-color-on-tertiary-container)",
        },
        /* MD3 Error */
        error: {
          DEFAULT: "var(--md-sys-color-error)",
          container: "var(--md-sys-color-error-container)",
        },
        "on-error": {
          DEFAULT: "var(--md-sys-color-on-error)",
          container: "var(--md-sys-color-on-error-container)",
        },
        /* Extended status */
        warning: {
          DEFAULT: "var(--md-sys-color-warning)",
          container: "var(--md-sys-color-warning-container)",
        },
        success: {
          DEFAULT: "var(--md-sys-color-success)",
          container: "var(--md-sys-color-success-container)",
        },
        info: {
          DEFAULT: "var(--md-sys-color-info)",
          container: "var(--md-sys-color-info-container)",
        },
        /* Scope (cup accent) */
        scope: {
          primary: "var(--md-sys-color-scope-primary)",
          "on-primary": "var(--md-sys-color-scope-on-primary)",
          "primary-container": "var(--md-sys-color-scope-primary-container)",
          "on-primary-container": "var(--md-sys-color-scope-on-primary-container)",
        },
        /* Inverse */
        "inverse-surface": "var(--md-sys-color-inverse-surface)",
        "inverse-on-surface": "var(--md-sys-color-inverse-on-surface)",
        scrim: "var(--md-sys-color-scrim)",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)",
        md: "0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)",
        lg: "0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)",
        xl: "0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)",
      },
    }
  },
  plugins: []
};

export default config;
