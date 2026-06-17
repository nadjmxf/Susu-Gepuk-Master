/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-error": "#ffffff",
        "tertiary-container": "#c7a927",
        "tertiary-fixed": "#ffe16e",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "secondary": "#495f84",
        "on-error-container": "#93000a",
        "on-secondary-container": "#445a7f",
        "inverse-primary": "#adc7ff",
        "surface-tint": "#005bc0",
        "on-surface-variant": "#414754",
        "tertiary": "#705d00",
        "primary-fixed-dim": "#adc7ff",
        "primary": "#005bbf",
        "tertiary-fixed-dim": "#e4c542",
        "outline-variant": "#c1c6d6",
        "surface-variant": "#e2e2e2",
        "on-surface": "#1a1c1c",
        "on-primary-container": "#ffffff",
        "secondary-container": "#bcd2fe",
        "surface-container": "#eeeeee",
        "primary-container": "#1a73e8",
        "surface-container-low": "#f3f3f4",
        "on-primary-fixed-variant": "#004493",
        "on-primary-fixed": "#001a41",
        "secondary-fixed": "#d6e3ff",
        "inverse-surface": "#2f3131",
        "surface-container-high": "#e8e8e8",
        "surface-dim": "#dadada",
        "on-tertiary-fixed-variant": "#544600",
        "outline": "#727785",
        "inverse-on-surface": "#f0f1f1",
        "error-container": "#ffdad6",
        "surface-container-highest": "#e2e2e2",
        "on-secondary-fixed": "#001b3d",
        "on-background": "#1a1c1c",
        "surface": "#f9f9f9",
        "background": "#f9f9f9",
        "on-secondary-fixed-variant": "#31476b",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "primary-fixed": "#d8e2ff",
        "surface-bright": "#f9f9f9",
        "secondary-fixed-dim": "#b1c7f2",
        "on-tertiary-container": "#4c3f00",
        "error": "#ba1a1a",
        "on-tertiary-fixed": "#221b00"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "sm": "8px",
        "gutter": "16px",
        "margin": "20px",
        "xs": "4px",
        "unit": "4px",
        "md": "16px",
        "lg": "24px",
        "xl": "40px"
      },
      "fontFamily": {
        "body-lg": ["Space Grotesk"],
        "label-bold": ["Space Grotesk"],
        "body-md": ["Space Grotesk"],
        "sticker-sm": ["Plus Jakarta Sans"],
        "headline-md": ["Plus Jakarta Sans"],
        "display-xl": ["Plus Jakarta Sans"],
        "display-lg": ["Plus Jakarta Sans"]
      },
      "fontSize": {
        "body-lg": ["18px", { "lineHeight": "1.5", "fontWeight": "500" }],
        "label-bold": ["14px", { "lineHeight": "1.2", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "sticker-sm": ["12px", { "lineHeight": "1.0", "fontWeight": "800" }],
        "headline-md": ["32px", { "lineHeight": "1.2", "fontWeight": "700" }],
        "display-xl": ["64px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "800" }],
        "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800" }]
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
