import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  token: "eyJhcGlLZXkiOiJza19saXZlXzYzMDJhYjM3OGVjMzYxZDhjMzNhYTY4YmI3OWE4NzNkOTExNDdjYjIxYTExMzcxYzNhYjJlMDNmNmY1MWUxOGEiLCJhcHBJZCI6Ijk2aXZ2ODhiZzkiLCJyZWdpb25zIjpbInNlYTEiXX0="
});

const url = "https://utfs.io/f/0yks13NtToBidr5AWIhfcvGemo1qIhyiPK56u3ZrnLzJUQRW";

// Extract file key using regex
const regex = /\/f\/([a-zA-Z0-9]+)/;
const match = url.match(regex);

if (match && match[1]) {
  const fileKey = match[1];
  console.log("Extracted file key:", fileKey);

  try {
    // Delete the file using the extracted key
    const deleteDetails = await utapi.deleteFiles(fileKey);
    console.log("File delete details:", deleteDetails);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
} else {
  console.error("No valid file key found in the URL.");
}
