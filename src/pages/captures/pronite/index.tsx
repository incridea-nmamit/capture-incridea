
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
const pronite = () => {


  const router = useRouter()
  return (

    <div className="flex flex-col md:flex-row h-screen w-screen mt-16">
       <div
        className="group flex-1 bg-cover bg-center border border-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/landing-images/Masala_Coffee.jpg')", backgroundPosition: "center", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-all duration-500 group-hover:bg-black/80"></div>
        <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110"></div>
        <div className="relative z-10 p-4 text-white flex flex-col h-full justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <h2 className="text-3xl font-bold font-Teknaf mb-2">Day 1</h2>
          <h2 className="text-5xl font-bold font-Teknaf mb-4">Masala Coffee</h2>
          <div className="flex items-center text-sm mb-4">
            <span className="material-icons mr-2 font-description">location_on</span>
            BC Alva
            <span className="material-icons ml-4 mr-2 font-description">schedule</span>
            28th Feb, 7:00 PM
          </div>
          <Button 
              className="bg-white text-black px-6 py-3 rounded text-xl shadow"
              onClick={() => router.push('/captures/pronite/day1')}
            >
              Enter
            </Button>        </div>
      </div>

      <div
        className="group flex-1 bg-cover bg-center border border-gray-500  relative overflow-hidden"
        style={{ backgroundImage: "url('/images/landing-images/shaan.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-all duration-500 group-hover:bg-black/80"></div>
        <div className="absolute inset-0 transition-all duration-500 group-hover:scale-110"></div>
        <div className="relative z-10 p-4 text-white flex flex-col h-full justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <h2 className="text-3xl font-bold font-Teknaf mb-2">Day 2</h2>
          <h2 className="text-5xl font-bold font-Teknaf mb-4">Shaan Live</h2>
          <div className="flex items-center text-sm mb-4">
            <span className="material-icons mr-2 font-description">location_on</span>
            BC Alva
            <span className="material-icons ml-4 mr-2 font-description">schedule</span>
            1st March, 7:00 PM
          </div>
          <Button 
              className="bg-white text-black px-6 py-3 rounded text-xl shadow"
              onClick={() => router.push('/captures/pronite/day2')}
            >
              Enter
            </Button>        </div>
      </div>
    </div>


  )

}

export default pronite
