import Events from "~/components/EventPage/Events";
import FallingClipart from "~/components/BackgroundFallAnimation/FallingClipart";
import TitleDescription from "~/components/TitleDescription";

function EventsPage() {
  return (
    <div>
      <TitleDescription 
        title="Events" 
        description="Vibrant Events"
        imagePath="/images/event.jpg"
      />
      <FallingClipart />
      <Events />
    </div>
  );
}

export default EventsPage;
