import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { IoLocation } from "react-icons/io5";
import { IoIosTime } from "react-icons/io";
import { FaCalendarDay } from "react-icons/fa";

const pronite = () => {
  const router = useRouter();

  const handleDivClick = (path: string) => {
    // Only redirect if screen width is >= 768px (md breakpoint)
    if (window.innerWidth >= 768) {
      router.push(path);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
       <div
        onClick={() => handleDivClick('/captures/pronite/masala-coffee')}
        className="group flex-[1.2] md:flex-1 bg-cover bg-center relative overflow-hidden md:cursor-pointer"
        style={{ backgroundImage: "url('/images/landing-images/Masala_Coffee.webp')", backgroundPosition: "center", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-gradient-to-t md:from-black/50 md:to-transparent transition-all duration-500 md:group-hover:bg-black/40 md:group-hover:backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110"></div>
        <div className="relative z-10 p-4 text-white flex flex-col h-full justify-center items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
        <h2 className="text-base md:text-lg font-bold font-Trap-Regular mb-2">Day 1</h2>
          <h2 className="text-3xl md:text-5xl font-bold font-Teknaf mb-4">Masala Coffee</h2>
          <div className="flex items-center text-xs md:text-sm mb-4">
            <span className="material-icons mr-2 font-description"><IoLocation /></span>
            BC Alva
            <span className="material-icons ml-4 mr-2 font-description"><FaCalendarDay /></span>
            28th Feb, 7:00 PM
          </div>
          <Button 
              className="bg-white text-black px-4 py-2 rounded text-lg shadow md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                router.push('/captures/pronite/masala-coffee');
              }}
            >
              Enter
          </Button>
        </div>
      </div>

      <div
        onClick={() => handleDivClick('/captures/pronite/shaan')}
        className="group flex-1 bg-cover bg-center relative overflow-hidden md:cursor-pointer"
        style={{ backgroundImage: "url('/images/landing-images/shaan.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-gradient-to-t md:from-black/50 md:to-transparent transition-all duration-500 md:group-hover:bg-black/40 md:group-hover:backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110"></div>
        <div className="relative z-10 p-4 text-white flex flex-col h-full justify-center items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
        <h2 className="text-base md:text-lg font-bold font-Trap-Regular mb-2">Day 2</h2>
          <h2 className="text-3xl md:text-5xl font-bold font-Teknaf mb-4">Shaan Live</h2>
          <div className="flex items-center text-xs md:text-sm mb-4">
            <span className="material-icons mr-2 font-description"><IoLocation /></span>
            BC Alva
            <span className="material-icons ml-4 mr-2 font-description"><FaCalendarDay /></span>
            1st March, 7:00 PM
          </div>
          <Button 
              className="bg-white text-black px-4 py-2 rounded text-lg shadow md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                router.push('/captures/pronite/shaan');
              }}
            >
              Enter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default pronite;
