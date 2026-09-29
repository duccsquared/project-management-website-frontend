/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

module.exports = {
  darkMode: "class", // toggled via `.dark` on <html> or a parent element
  content: [
    "./app/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
          4: "var(--surface-4)",
          5: "var(--surface-5)",
          disabled: "var(--surface-disabled)",
        },

        text: {
          strong: "var(--text-strong)",
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
          disabled: "var(--text-disabled)",
        },

        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          disabled: "var(--border-disabled)",
        },

        // Semantic roles: subtle (bg tint) / muted (hover-on-bg) /
        // DEFAULT (solid: buttons, icons, links) / hover (on DEFAULT) /
        // text (colored text sitting on a subtle/muted background)
        primary: {
          ...colors.blue,
          subtle: "var(--primary-subtle)",
          muted: "var(--primary-muted)",
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          text: "var(--primary-text)",
        },
        secondary: {
          ...colors.teal,
          subtle: "var(--secondary-subtle)",
          muted: "var(--secondary-muted)",
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          text: "var(--secondary-text)",
        },
        danger: {
          ...colors.red,
          subtle: "var(--danger-subtle)",
          muted: "var(--danger-muted)",
          DEFAULT: "var(--danger)",
          hover: "var(--danger-hover)",
          text: "var(--danger-text)",
        },
        success: {
          ...colors.green,
          subtle: "var(--success-subtle)",
          muted: "var(--success-muted)",
          DEFAULT: "var(--success)",
          hover: "var(--success-hover)",
          text: "var(--success-text)",
        },

        ring: {
          DEFAULT: "var(--ring-color)",
        },
      },

      // Type scale — use as e.g. `text-page-title` (size+leading paired,
      // apply font-weight via the matching fontWeight key below)
      fontSize: {
        "page-title": ["var(--fs-page-title)", { lineHeight: "var(--lh-page-title)" }],
        "section-title": ["var(--fs-section-title)", { lineHeight: "var(--lh-section-title)" }],
        "card-title": ["var(--fs-card-title)", { lineHeight: "var(--lh-card-title)" }],
        heading: ["var(--fs-heading)", { lineHeight: "var(--lh-heading)" }],
        body: ["var(--fs-body)", { lineHeight: "var(--lh-body)" }],
        secondary: ["var(--fs-secondary)", { lineHeight: "var(--lh-secondary)" }],
        caption: ["var(--fs-caption)", { lineHeight: "var(--lh-caption)" }],
      },

      fontWeight: {
        "page-title": "700",
        "section-title": "600",
        "card-title": "600",
        heading: "500",
        body: "400",
        secondary: "400",
        caption: "500",
      },

      // Border radius — named to match component role
      borderRadius: {
        control: "0.375rem", // rounded-md
        input: "0.5rem",     // rounded-lg
        card: "0.75rem",     // rounded-xl
        modal: "1rem",       // rounded-2xl
        pill: "9999px",      // rounded-full
      },

      // Shadow / elevation
      boxShadow: {
        flat: "none",
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",             // shadow-sm
        dropdown: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", // shadow-lg
        modal: "0 25px 50px -12px rgb(0 0 0 / 0.25)",      // shadow-2xl
      },

      // Motion — all ease-out; use as `duration-hover`, `duration-modal`, etc.
      transitionDuration: {
        hover: "150ms",
        press: "100ms",
        modal: "200ms",
        sidebar: "250ms",
        toast: "250ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0, 0, 0.2, 1)", // ease-out
      },

      // Icon sizing (use on width/height, e.g. `w-icon-normal h-icon-normal`)
      spacing: {
        "icon-small": "1rem",    // 16px
        "icon-normal": "1.25rem",// 20px
        "icon-large": "1.5rem",  // 24px
        "icon-hero": "2rem",     // 32px
      },

      // Max widths per layout context
      maxWidth: {
        dashboard: "80rem",  // max-w-7xl
        forms: "36rem",      // max-w-xl
        settings: "48rem",   // max-w-3xl
        reading: "65ch",     // max-w-prose
      },

      ringColor: {
        DEFAULT: "var(--ring-color)",
      },
      ringOffsetWidth: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};
