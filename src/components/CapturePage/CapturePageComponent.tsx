import FallingClipart from "../FallingClipart";
import CapturePageCard from "./CapturePageCard";

const CapturesComponent = () => {
  return (
    <div>
      {/* FallingClipart component is now wrapped in a single parent div */}
      <FallingClipart />

      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-8"
        style={{ backgroundImage: "url('')" }}
      >
        <h1 className="text-7xl text-white font-Hunters mb-12 p-8 z-40">Captures</h1>

        <div className="flex flex-col md:flex-row gap-12 flex-wrap justify-center z-50">
          {/* Events Card */}
          <CapturePageCard 
            title="Events" 
            description="Discover memories from our amazing events." 
            imagePath="/images/event-bg1.jpg" 
            link="/captures/events"
          />

          {/* Your Snaps Card */}
          <CapturePageCard 
            title="Your Snaps" 
            description="Find your favorite snaps captured just for you." 
            imagePath="/images/event-bg2.png" 
            link="/captures/your-snaps"
          />

          {/* Behind Incridea Card */}
          <CapturePageCard 
            title="Behind Incridea" 
            description="Explore the behind-the-scenes moments." 
            imagePath="/images/admin-bg.png" 
            link="/captures/behindincridea"
          />
        </div>
      </div>
    </div> // All JSX now wrapped in a single div element
  );
};

export default CapturesComponent;
