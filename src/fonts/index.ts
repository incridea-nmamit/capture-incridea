import { Lobster } from "next/font/google";

const lobster = Lobster({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--font-cursive",
});
const fonts = {
    lobster
};

export { fonts };