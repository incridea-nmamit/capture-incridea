import type { NextApiRequest, NextApiResponse } from "next"; 
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
const f = createUploadthing(); 
const auth = (_req: NextApiRequest, _res: NextApiResponse) => ({ id: "fakeId" });
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const ourFileRouter = { 
  imageUploader: f({ image: { maxFileSize: "8MB" ,maxFileCount: 1} }) 
    .middleware(async ({ req, res }) => { 
      const user = auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id }; 
    }) 
    .onUploadComplete(async ({ metadata, file }) => { 
      console.log("Upload complete for userId:", metadata.userId); 
      console.log("file url", file.url); 
      return { uploadedBy: metadata.userId }; 
    }), 
} satisfies FileRouter; 

export type OurFileRouter = typeof ourFileRouter;
