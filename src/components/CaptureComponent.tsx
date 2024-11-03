import Link from "next/link"; // Import Link from Next.js
interface IPResponse {
  ip: string;
}

const CapturesComponent = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-8"
      style={{ backgroundImage: "url('')" }}
    >
      <h1 className="text-7xl text-white font-Hunters mb-12 p-8">Captures</h1>

      <div className="flex flex-col md:flex-row gap-12 flex-wrap justify-center">
        {/* Events Card with Link */}
        <Link href="/captures/events" passHref>
          <div className="relative group w-80 h-80 rounded-3xl overflow-hidden cursor-pointer">
            {/* Shadow behind the card */}
            <div className="absolute inset-0 -z-10 bg-black rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition" />

            {/* Card content */}
            <div
              className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
              style={{ backgroundImage: "url('/images/event-bg1.jpg')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center h-full text-white text-3xl font-bold">
                Events
              </div>
            </div>
          </div>
        </Link>

        {/* Your Snaps Card with Link */}
        <Link href="/captures/your-snaps" passHref>
          <div className="relative group w-80 h-80 rounded-3xl overflow-hidden cursor-pointer">
            {/* Shadow behind the card */}
            <div className="absolute inset-0 -z-10 bg-black rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition" />

            {/* Card content */}
            <div
              className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
              style={{ backgroundImage: "url('/images/event-bg2.png')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center h-full text-white text-3xl font-bold">
                Your Snaps
              </div>
            </div>
          </div>
        </Link>

        {/* BehindINC Card with Link */}
        <Link href="/captures/behindincridea" passHref>
          <div className="relative group w-80 h-80 rounded-3xl overflow-hidden cursor-pointer">
            {/* Shadow behind the card */}
            <div className="absolute inset-0 -z-10 bg-black rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition" />

            {/* Card content */}
            <div
              className="relative w-full h-full bg-cover bg-center rounded-3xl shadow-2xl"
              style={{ backgroundImage: "url('/images/event-bg2.png')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center h-full text-white text-3xl font-bold">
                Behind Incridea
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

// Type guard function
const isIPResponse = (data: unknown): data is IPResponse => {
  return typeof data === 'object' && data !== null && 'ip' in data;
};

export default CapturesComponent;
