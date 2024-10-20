import { type Config } from "tailwindcss"; // Importing the Config type from Tailwind CSS
import { fontFamily } from "tailwindcss/defaultTheme"; // Importing default font families
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"; // Importing Uploadthing components
import type { OurFileRouter } from "~/server/uploadthing"; // Importing custom file router type

// Tailwind CSS configuration
export default {
  content: ["./src/**/*.tsx"], // Specify where to look for class names
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        allura: ['Allura', 'cursive'],
        islandmoments: ['IslandMoments', 'cursive'], 
        silkscreen: ['Silkscreen', 'cursive'],// Extending the sans font family
      },
    },
  },
  plugins: [], // No additional plugins specified
} satisfies Config; // Ensuring it matches the Config type

// Uploadthing button and dropzone components
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
