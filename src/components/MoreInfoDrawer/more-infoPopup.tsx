"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer"
import { api } from "~/utils/api"
import { CustomPieChart } from "./pie-chart"
import { CustomUsersTable } from "./user-table"
import { ScrollArea } from "../ui/scroll-area"
import { SkeletonLoader } from "./skeleton-loader"

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  id: number;
  apiTobeCalled: "capture" | "playbacks" | "stories";
}

export function MoreInfo({
  isOpen,
  setOpen,
  id,
  apiTobeCalled,
}: Props) {
  const { data: moreInforCapture, isLoading: isLoadingCapture } = api.moreInfo.moreInfoForCaptureById.useQuery({ id }, { enabled: apiTobeCalled === "capture" });
  const { data: moreInforPlaybacks, isLoading: isLoadingPlaybacks } = api.moreInfo.moreInfoForPlayBacksById.useQuery({ id }, { enabled: apiTobeCalled === "playbacks" });
  const { data: moreInforStories, isLoading: isLoadingStories } = api.moreInfo.moreInfoForStoreisById.useQuery({ id }, { enabled: apiTobeCalled === "stories" });
  const isLoading = isLoadingCapture || isLoadingPlaybacks || isLoadingStories;

  let moreInfor;
  if (apiTobeCalled === "capture") {
    moreInfor = moreInforCapture;
  } else if (apiTobeCalled === "playbacks") {
    moreInfor = moreInforPlaybacks;
  } else if (apiTobeCalled === "stories") {
    moreInfor = moreInforStories;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent>
        <ScrollArea className="h-[600px] w-full md:h-full">
          <DrawerHeader>
            <DrawerTitle className="font-Teknaf tracking-wider">More Information</DrawerTitle>
            <DrawerDescription>Details regarding Likes and Downloads</DrawerDescription>
          </DrawerHeader>
          <div className="flex md:flex-row flex-col gap-4 p-3">
            <div className="md:w-5/12 w-full">
              <CustomPieChart
                totalDownloads={moreInfor?.totalDownloads!}
                totalLikes={moreInfor?.totalLikes!}
              />
            </div>
            <div className="md:w-7/12 w-full">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <CustomUsersTable
                  downloadUsers={moreInfor?.downloadUsers!}
                  likeUsers={moreInfor?.likeUsers!}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
