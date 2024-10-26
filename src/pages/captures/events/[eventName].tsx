// pages/event-captures.tsx
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import CaptureCard from "~/components/CaptureCard";

const EventCaptures = () => {
  const router = useRouter();
  const { eventName } = router.query;
  const safeEventName = Array.isArray(eventName) ? eventName[0] : eventName || "Event";
  const formattedEventName = (safeEventName || "").replace(/-/g, ' ');

  const { data: images, isLoading, error } = api.gallery.getAllGallery.useQuery();

  console.log("Images data:", images);
  console.log("Event Name from URL:", formattedEventName);

  const filteredImages = images?.filter((image) => image.event_name === formattedEventName) || [];
  console.log("Filtered Images Count:", filteredImages.length);

  if (isLoading) return <p className="text-white text-center">Loading images...</p>;
  if (error) return <p className="text-white text-center">Error loading images.</p>;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-4xl font-bold text-white text-center">{formattedEventName} Captures</h1>

      {filteredImages.length === 0 ? (
        <p className="text-white text-center mt-8">No images available for this event.</p>
      ) : (
        <div
          className="grid gap-4 mt-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {filteredImages.map((image) => (
            <CaptureCard
              key={image.id}
              imagePath={image.image_path}
              altText={formattedEventName ?? "Event image"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCaptures;
