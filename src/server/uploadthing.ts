import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";


const f = createUploadthing();

const auth = (_req: NextApiRequest, _res: NextApiResponse) => ({ id: "fakeId" });

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      const user = auth(req, res);
      if (!user) throw new Error("Unauthorized");
      console.log("Middleware is running for god sake")
      return { userId: user.id };
    }).onUploadError(async (e) => {
      console.log("Am here for god sake", e)
    })

    .onUploadComplete(async ({ metadata, file }) => {
      console.log("but uploadcomplete is not running for god sake")
      return { uploadedBy: metadata.userId };
    }),

  imageUploaderCompressed: f({ image: { maxFileSize: "8MB", maxFileCount: 2 } })
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


  storiesUploader: f({ video: { maxFileSize: "512MB", maxFileCount: 1 }, image: { maxFileSize: "8MB", maxFileCount: 2 } })
    .middleware(async ({ req, res }) => {
      const user = auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),

  playbackUploader: f({ video: { maxFileSize: "1024MB", maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      const user = auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
