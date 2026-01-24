import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.zinc.800"),
            a: {
              color: theme("colors.zinc.900"),
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationThickness: "1px",
            },
            "a:hover": {
              color: theme("colors.zinc.950"),
            },
            h1: { letterSpacing: "-0.02em" },
            h2: { letterSpacing: "-0.02em" },
            h3: { letterSpacing: "-0.01em" },
            code: {
              color: theme("colors.zinc.900"),
              backgroundColor: theme("colors.zinc.100"),
              padding: "0.15em 0.35em",
              borderRadius: "0.4rem",
              fontWeight: "500",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            pre: {
              backgroundColor: theme("colors.zinc.950"),
              color: theme("colors.zinc.50"),
              borderRadius: "1rem",
            },
            blockquote: {
              borderLeftColor: theme("colors.zinc.200"),
              color: theme("colors.zinc.700"),
            },
            hr: { borderColor: theme("colors.zinc.200") },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
export default config;

