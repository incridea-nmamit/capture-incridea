import Events from "~/components/EventPage/Events";
import TitleDescription from "~/components/TitleDescription";

function EventsPage() {
  return (
    <div className=" gradient-bg">
      <TitleDescription 
        title="Events" 
        description="Vibrant Events"
        imagePath="/images/CapturePage/events.webp"
      />
      <Events />
    </div>
  );
}

export default EventsPage;
