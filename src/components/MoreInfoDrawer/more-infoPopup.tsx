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

/**
 * Props interface for MoreInfo component
 */
type Props = {
  isOpen: boolean;                              // Controls drawer visibility
  setOpen: (open: boolean) => void;            // Drawer state setter
  id: number;                                  // Item ID for data fetching
  apiTobeCalled: "capture" | "playbacks" | "stories"; // API endpoint selector
}

/**
 * MoreInfo Component
 * Displays detailed information about captures/playbacks/stories in a drawer
 */
export function MoreInfo({
  isOpen,
  setOpen,
  id,
  apiTobeCalled,
}: Props) {
  // API queries for different content types
  const { data: moreInforCapture, isLoading: isLoadingCapture } = api.moreInfo.moreInfoForCaptureById.useQuery(
    { id }, 
    { enabled: apiTobeCalled === "capture" }
  );
  const { data: moreInforPlaybacks, isLoading: isLoadingPlaybacks } = api.moreInfo.moreInfoForPlayBacksById.useQuery({ id }, { enabled: apiTobeCalled === "playbacks" });
  const { data: moreInforStories, isLoading: isLoadingStories } = api.moreInfo.moreInfoForStoreisById.useQuery({ id }, { enabled: apiTobeCalled === "stories" });

  // Combined loading state
  const isLoading = isLoadingCapture || isLoadingPlaybacks || isLoadingStories;

  // Select appropriate data based on API type
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
        {/* Scrollable content area */}
        <ScrollArea className="h-[600px] w-full md:h-full">
          <DrawerHeader>
            <DrawerTitle className="font-Teknaf tracking-wider">More Information</DrawerTitle>
            <DrawerDescription>Details regarding Likes and Downloads</DrawerDescription>
          </DrawerHeader>
          
          {/* Content grid */}
          <div className="flex md:flex-row flex-col gap-4 p-3">
            {/* Chart section */}
            <div className="md:w-5/12 w-full">
              <CustomPieChart
                totalDownloads={moreInfor?.totalDownloads!}
                totalLikes={moreInfor?.totalLikes!}
              />
            </div>
            
            {/* Users table section */}
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
