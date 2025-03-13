import { useState } from 'react';
import { UploadButton } from "@uploadthing/react";
import Head from 'next/head';
import { OurFileRouter } from '~/server/uploadthing';

type UploadSlot = {
  id: string;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  url: string | null;
};

export default function PlaybackUploadPage() {
  // Define distinct color schemes for each upload slot
  const [uploadSlots, setUploadSlots] = useState<UploadSlot[]>([
    {
      id: "slot1",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
      label: "Blue Upload",
      url: null
    },
    {
      id: "slot2",
      color: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
      label: "Green Upload",
      url: null
    },
    {
      id: "slot3",
      color: "text-purple-700",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-300",
      label: "Purple Upload",
      url: null
    },
    {
      id: "slot4",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-300",
      label: "Amber Upload",
      url: null
    }
  ]);

  const updateSlotUrl = (slotId: string, url: string) => {
    setUploadSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, url } : slot
    ));
  };

  return (
    <>
      <Head>
        <title>Playback Upload</title>
        <meta name="description" content="Upload and manage playback videos" />
      </Head>
      
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Playback Video Upload</h1>
        
        <div className="grid gap-8">
          {/* Upload Components Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadSlots.map((slot) => (
              <div 
                key={slot.id} 
                className={`border rounded-lg p-6 shadow-md ${slot.bgColor} ${slot.borderColor}`}
              >
                <h2 className={`text-xl font-semibold mb-4 ${slot.color}`}>{slot.label}</h2>
                <p className={`mb-4 ${slot.color}`}>Upload a video (max 16GB)</p>
                
                <UploadButton<OurFileRouter, "playbackUploader">
                  endpoint="playbackUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateSlotUrl(slot.id, res[0].url);
                      alert(`Upload completed successfully in ${slot.label}!`);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR in ${slot.label}! ${error.message}`);
                  }}
                  appearance={{
                    button: {
                      backgroundColor: slot.color.includes('blue') ? '#1d4ed8' : 
                                      slot.color.includes('green') ? '#15803d' : 
                                      slot.color.includes('purple') ? '#7e22ce' : 
                                      '#b45309'
                    }
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Results Section */}
          <div className="border rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6">Upload Results</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {uploadSlots.map((slot) => (
                <div 
                  key={slot.id} 
                  className={`border rounded-lg p-4 ${slot.bgColor} ${slot.borderColor}`}
                >
                  <h3 className={`font-medium mb-2 ${slot.color}`}>{slot.label} Result</h3>
                  
                  {slot.url ? (
                    <div className="space-y-2">
                      <div className="flex">
                        <input 
                          type="text" 
                          value={slot.url} 
                          readOnly 
                          className="flex-1 p-2 border rounded-l text-sm bg-white"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(slot.url || "");
                            alert("URL copied to clipboard!");
                          }}
                          className={`text-white px-4 py-2 rounded-r ${
                            slot.color.includes('blue') ? 'bg-blue-600 hover:bg-blue-700' :
                            slot.color.includes('green') ? 'bg-green-600 hover:bg-green-700' :
                            slot.color.includes('purple') ? 'bg-purple-600 hover:bg-purple-700' :
                            'bg-amber-600 hover:bg-amber-700'
                          }`}
                        >
                          Copy
                        </button>
                      </div>
                      
                      <video 
                        controls 
                        src={slot.url} 
                        className="w-full h-40 rounded border object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No video uploaded yet.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
