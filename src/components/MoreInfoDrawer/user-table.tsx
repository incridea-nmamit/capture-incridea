"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = {
  downloadUsers: {
    id?: number;
    username?: string;
    imageUrl?: string | null;
  }[];
  likeUsers: {
    id: string;
    username: string;
    imageUrl: string | null;
  }[];
};

export function CustomUsersTable({
  downloadUsers,
  likeUsers,
}: Props) {
  return (
    <Card className="flex flex-col bg-gradient-to-tl from-neutral-900 to-black">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-semibold">Users Information </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-[10px]">
          <div className="flex-1 bg-neutral-900 p-4 rounded-lg border border-neutral-600">
            <ScrollArea className="h-72 w-full rounded-md ">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Downloads</h4>
                {downloadUsers?.map((user) => (
                  <div key={user.id} className="flex items-center mt-2 space-x-4 text-sm bg-neutral-950 p-2 rounded-xl shadow-2xl">
                    <Avatar>
                      <AvatarImage
                        src={user.imageUrl || "https://github.com/shadcn.png"}
                        alt={user.username}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-md py-2 px-4">  {user.username}  </p>
                  </div>

                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 bg-neutral-900 p-4 rounded-lg border border-neutral-600">
            <ScrollArea className="h-72 w-full rounded-md ">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Likes</h4>
                {likeUsers?.map((user) => (
                  <div key={user.id} className="flex mt-2 items-center space-x-4 text-sm bg-neutral-950 p-2 rounded-xl shadow-2xl">
                    <Avatar>
                      <AvatarImage
                        src={user.imageUrl || "https://github.com/shadcn.png"}
                        alt={user.username}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-md py-2 px-4">  {user.username}  </p>
                  </div>

                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
