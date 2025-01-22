import Link from "next/link";
import { Button } from "../ui/button";

export const LandingButtons = () => {

    return (
        <div className="absolute bottom-0 left-0 flex h-full w-screen flex-col items-center justify-center overflow-x-hidden">
            <div className="absolute bottom-10 my-16 w-fit flex-col items-center gap-10 md:flex-row md:gap-10 lg:flex">
                <Link href="/captures">
                    <Button
                        className=" hover:bg-pink-500 text-2xl h-16 w-64 px-6 py-4 sm:px-16 sm:py-6 ml-2 border-[#081025] border-2 bg-[#bc1b74] shadow-2xl text-white rounded-bl-2xl  font-bold"
                    >
                        Capture
                    </Button>
                </Link>
            </div>
        </div>

    );
};