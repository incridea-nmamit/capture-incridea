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
  content: ["./src/**/*.tsx"], // Specify where to look for class names
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans], // Extending the default sans font family
        allura: ['Allura', 'cursive'],
        islandmoments: ['IslandMoments', 'cursive'], 
        silkscreen: ['Silkscreen', 'cursive'],
        velocista: ['Velocista', 'cursive'],
        brigends:['brigends','cursive'],
        Hunters:['Hunters','cursive'],
        Trends:['Trends','cursive'],
        Azonix:['Azonix','cursive'],
        Radwave:['Radwave','cursive'],
        Finish:['Finish','cursive'],
        Cyberion:['Cyberion','cursive'],      
        BebasNeue:['BebasNeue','cursive'],
      },
    },
  },
  plugins: [], // No additional plugins specified
};

export default config;

// Uploadthing button and dropzone components
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
