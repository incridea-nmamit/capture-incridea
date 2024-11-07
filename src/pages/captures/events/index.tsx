import Events from "~/components/EventPage/Events";
import FallingClipart from "~/components/FallingClipart";
import TitleDescription from "~/components/TitleDescription";

function EventsPage() {
  return (
    <div>
      <TitleDescription 
        title="Events" 
        description="Events Description here"
        imagePath="/images/event.jpg"
      />
      <FallingClipart />
      <Events />
    </div>
  );
}

export default EventsPage;
