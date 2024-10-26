// utils/downloadUtils.ts
import { saveAs } from "file-saver";

export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};
