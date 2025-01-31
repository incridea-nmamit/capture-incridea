import { Lobster, Space_Grotesk } from "next/font/google";

const grotesk = Space_Grotesk({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const lobster = Lobster({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-lobster",
});
const fonts = {
  lobster,
  grotesk,
};

export { fonts };
