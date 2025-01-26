import Events from "~/components/EventPage/Events";
import FallingClipart from "~/components/BackgroundFallAnimation/FallingClipart";
import TitleDescription from "~/components/TitleDescription";

function EventsPage() {
  return (
    <div className=" gradient-bg">
      <TitleDescription 
        title="Events" 
        description="Vibrant Events"
        imagePath="https://utfs.io/f/0yks13NtToBitJchJ4NSCB2X9TSlbJxWYgG6rpN3n8swf4Fz"
      />
      <FallingClipart />
      <Events />
    </div>
  );
}

export default EventsPage;
