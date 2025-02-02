"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { api } from "~/utils/api"

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  id: number
}

export function MoreInfo({
  isOpen,
  setOpen,
  id
}: Props) {

  const { data: moreInfor, isLoading } = api.moreInfo.moreInfoForCaptureById.useQuery({ id: id });

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{id}</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <pre>{JSON.stringify(moreInfor, null, 2)}</pre>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
