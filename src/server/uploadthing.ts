import type { NextApiRequest, NextApiResponse } from "next"; 
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing(); 

const auth = (_req: NextApiRequest, _res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function 
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const ourFileRouter = { 
  imageUploader: f({ image: { maxFileSize: "8MB" ,maxFileCount: 1} }) 
    .middleware(async ({ req, res }) => { 
      // This code runs on your server before upload 
      const user = auth(req, res); // No need to await as auth returns a synchronous result 

      // If you throw, the user will not be able to upload 
      if (!user) throw new Error("Unauthorized"); // Throw a proper error object 

      // Whatever is returned here is accessible in onUploadComplete as `metadata` 
      return { userId: user.id }; 
    }) 
    .onUploadComplete(async ({ metadata, file }) => { 
      // This code RUNS ON YOUR SERVER after upload 
      console.log("Upload complete for userId:", metadata.userId); 
      console.log("file url", file.url); 

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback 
      return { uploadedBy: metadata.userId }; 
    }), 
} satisfies FileRouter; 

export type OurFileRouter = typeof ourFileRouter;
