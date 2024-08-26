import { nextui } from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|input|modal|ripple|spinner).js"
  ],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slide-in 0.5s ease-in-out',
        'slide-out': 'slide-out 0.5s ease-in-out',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: "0",
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: "1",
          },
        },
        'slide-out': {
          '0%': {
            transform: 'translateX(0)',
            opacity: "1",
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: "0",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [nextui()],
};
export default config;

