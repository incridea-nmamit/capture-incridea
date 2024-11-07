import Events from "~/components/EventPage/Events";
import TitleDescription from "~/components/TitleDescription";

function EventsPage() {
  return (
    <div>
      <TitleDescription 
        title="Events" 
        description="Events Description here"
        imagePath="/images/event.jpg"
      />
      <Events />
    </div>
  );
}

export default EventsPage;
