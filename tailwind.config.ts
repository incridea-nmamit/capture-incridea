// tailwind.config.ts
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "~/server/uploadthing";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-geist-sans)',
                    ...fontFamily.sans
                ],
  			silkscreen: [
  				'Silkscreen',
  				'cursive'
  			],
  			velocista: [
  				'Velocista',
  				'cursive'
  			],
  			Hunters: [
  				'Hunters',
  				'cursive'
  			],
  			BebasNeue: [
  				'BebasNeue',
  				'cursive'
  			],
  			ClubHouse: [
  				'ClubHouse',
  				'cursive'
  			],
  			'Trap-Regular': [
  				'Trap-Regular',
  				'cursive'
  			],
  			'Trap-Black': [
  				'Trap-Black',
  				'cursive'
  			],
  			'Teknaf': [
  				'Teknaf',
  				'cursive'
  			]
  		},
  		colors: {
  			gold: '#FFD700',
  			primary: {
  				'50': '#E0EEFF',
  				'100': '#C2DCFF',
  				'200': '#85BAFF',
  				'300': '#4797FF',
  				'400': '#0A74FF',
  				'500': '#005ACF',
  				'600': '#0047A3',
  				'700': '#00357A',
  				'800': '#002352',
  				'900': '#001229',
  				'950': '#000914',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#FBEEEA',
  				'100': '#F7E0D9',
  				'200': '#F0C1B2',
  				'300': '#E8A28C',
  				'400': '#E18266',
  				'500': '#D9633E',
  				'600': '#BB4825',
  				'700': '#8D361C',
  				'800': '#5E2412',
  				'900': '#2F1209',
  				'950': '#150804',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  keyframes: {
			neonBorder: {
			  "0%": { borderWidth: "2px", opacity: "0.8" },
			  "50%": { borderWidth: "4px", opacity: "1" },
			  "100%": { borderWidth: "2px", opacity: "0.8" },
			},
			fade: {
				"0%": { backgroundPosition: "0 0", opacity: "1" },
				"50%": { backgroundPosition: "2000% 2000%", opacity: "0.6" },
				"100%": { backgroundPosition: "-2000% -2000%", opacity: "0" },
			  },
			  rotate: {
				"0%": { transform: "translate(-50%, -50%) rotate3d(1,-1,0,40deg) scale(2)" },
				"50%": { transform: "translate(-50%, -50%) rotate3d(0,0,0,0deg) scale(1.1)" },
				"100%": { transform: "translate(-50%, -50%) rotate3d(0,0,0,0deg) scale(1)" },
			  },
			  logo: {
				"0%": { visibility: "visible", opacity: "1" },
				"100%": { visibility: "hidden", opacity: "0" },
			  },
		  },
		  animation: {
			"neon-border": "neonBorder 1.5s ease-in-out infinite",
			"fade-1": "fade 4s steps(30) forwards",
			"fade-2": "fade 4s steps(30) forwards",
			"rotate-1": "rotate 4s 2s forwards",
			"rotate-2": "rotate 4s 2s forwards",
		  },
		  perspective: {
			700: "700px",
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
