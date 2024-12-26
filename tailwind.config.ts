// tailwind.config.ts
import { type Config } from "tailwindcss"; // Importing the Config type from Tailwind CSS
import { fontFamily } from "tailwindcss/defaultTheme"; // Importing default font families
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"; // Importing Uploadthing components
import type { OurFileRouter } from "~/server/uploadthing"; // Importing custom file router type

// Tailwind CSS configuration
const config: Config = {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"], // Specify where to look for class names
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-geist-sans)',
                    ...fontFamily.sans
                ],
  			allura: [
  				'Allura',
  				'cursive'
  			],
  			islandmoments: [
  				'IslandMoments',
  				'cursive'
  			],
  			silkscreen: [
  				'Silkscreen',
  				'cursive'
  			],
  			velocista: [
  				'Velocista',
  				'cursive'
  			],
  			brigends: [
  				'brigends',
  				'cursive'
  			],
  			Hunters: [
  				'Hunters',
  				'cursive'
  			],
  			Trends: [
  				'Trends',
  				'cursive'
  			],
  			Azonix: [
  				'Azonix',
  				'cursive'
  			],
  			Radwave: [
  				'Radwave',
  				'cursive'
  			],
  			Finish: [
  				'Finish',
  				'cursive'
  			],
  			Cyberion: [
  				'Cyberion',
  				'cursive'
  			],
  			BebasNeue: [
  				'BebasNeue',
  				'cursive'
  			],
  			CreamCake: [
  				'CreamCake',
  				'cursive'
  			],
  			ClubHouse: [
  				'ClubHouse',
  				'cursive'
  			],
  			Romance: [
  				'Romance',
  				'cursive'
  			],
  			Garet: [
  				'Garet',
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")], // No additional plugins specified
};

export default config;

// Uploadthing button and dropzone components
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
