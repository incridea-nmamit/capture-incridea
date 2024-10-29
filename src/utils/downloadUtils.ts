import { saveAs } from "file-saver";

// Declare the downloadImage function
export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};

// Ensure you export the function
export default downloadImage;
