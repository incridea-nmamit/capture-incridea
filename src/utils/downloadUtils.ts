import { saveAs } from "file-saver";

export const downloadImage = async (
  imageUrl: string, 
  filename: string,
  onProgress?: (progress: number) => void
) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const reader = response.body?.getReader();
    const contentLength = Number(response.headers.get('Content-Length')) || 0;
    
    if (!reader) throw new Error("Failed to get reader");

    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    while(true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (onProgress) {
        const progress = (receivedLength / contentLength) * 100;
        onProgress(Math.round(progress));
      }
    }

    const blob = new Blob(chunks);
    saveAs(blob, filename);
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};

export default downloadImage;
