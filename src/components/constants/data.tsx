import Image from "next/image";
import React from "react";
import {
  Aperture,
  Bell,
  BookCheck,
  CalendarCog,
  GalleryHorizontalEnd,
  ImageUp,
  PlayCircle,
  Settings,
  UserCog,
  Users,
  ListOrdered,
  Download,
} from "lucide-react";

import EventsAdmin from "~/components/EventsAdmin/EventsAdmin";
import CapturesAdmin from "~/components/CapturesAdmin/CapturesAdmin";
import TeamAdmin from "~/components/TeamAdmin/TeamAdmin";
import ManageRoles from "~/components/ManageRoles/ManageRoles";
import RemovalRequest from "~/components/RemovalRequestAdmin/RemovalRequest";
import ControlComponent from "~/components/ControlAdmin/ControlComponent";
import SMCUploads from "~/components/SMCUploads/SMCUploads";
import Stories from "~/components/Stories/Stories";
import ApproveCaptures from "~/components/ApproveCapture/ApproveCapture";

import { Role } from "@prisma/client";
import AdminPlayBacks from "../Playbacks";
import AuditLogs from "../AuditLogs";
import DownLodeLogs from "../downlodeLogs";

export const randomSliderImages = [
  { src: "/images/landing-images/img1.webp" },
  { src: "/images/landing-images/img2.webp" },
  { src: "/images/landing-images/img3.webp" },
  { src: "/images/landing-images/img4.webp" },
  { src: "/images/landing-images/img5.webp" },
  { src: "/images/landing-images/img5.webp" },
  { src: "/images/landing-images/img6.webp" },
  { src: "/images/landing-images/img7.webp" },
  { src: "/images/landing-images/img8.webp" },
  { src: "/images/landing-images/img9.webp" },
  { src: "/images/landing-images/img10.webp" },
  { src: "/images/landing-images/img11.webp" },
  { src: "/images/landing-images/img12.webp" },
]; // please use the images which are 600x600 cuz its not optimised for mobile view due to gsap

export const timeLineData = [
  {
    title: "2022",
    content: (
      <div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/images/2022/DSC08909.webp"
            alt="startup template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2022/IMG_0373.webp"
            alt="startup template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2022/IMG_2204.webp"
            alt="startup template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2022/IMG_9452.webp"
            alt="startup template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/images/2023/IMG_7455.webp"
            alt="hero template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2023/DSC_0300.webp"
            alt="feature template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2023/DSC_1080.webp"
            alt="bento template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2023/IMG_6193.webp"
            alt="cards template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2024",
    content: (
      <div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/images/2024/MVB03544.webp"
            alt="hero template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2024/IMG_0162.webp"
            alt="feature template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2024/DSC05653.webp"
            alt="bento template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2024/MVB04911.webp"
            alt="cards template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
];

export const tabs = [
  {
    name: "events",
    label: "Events",
    icon: CalendarCog,
    content: <EventsAdmin />,
    roles: [Role.admin, Role.manager],
  },
  {
    name: "captures",
    label: "Captures",
    icon: Aperture,
    content: <CapturesAdmin />,
    roles: [Role.admin, Role.manager, Role.editor],
  },
  {
    name: "team",
    label: "Teams",
    icon: Users,
    content: <TeamAdmin />,
    roles: [Role.admin, Role.manager],
  },
  {
    name: "roles",
    label: "User Roles",
    icon: UserCog,
    content: <ManageRoles />,
    roles: [Role.admin],
  },
  {
    name: "removalrequest",
    label: "Request",
    icon: Bell,
    content: <RemovalRequest />,
    roles: [Role.admin, Role.manager, Role.editor],
  },
  {
    name: "controls",
    label: "Settings",
    icon: Settings,
    content: <ControlComponent />,
    roles: [Role.admin],
  },
  {
    name: "smc",
    label: "SMC Uploads",
    icon: ImageUp,
    content: <SMCUploads />,
    roles: [Role.admin, Role.editor, Role.smc],
  },
  {
    name: "stories",
    label: "Capture Stories",
    icon: GalleryHorizontalEnd,
    content: <Stories />,
    roles: [Role.admin, Role.editor, Role.manager],
  },
  {
    name: "approvecap",
    label: "Approve Captures",
    icon: BookCheck,
    content: <ApproveCaptures />,
    roles: [Role.admin, Role.manager],
  },
  {
    name: "playbacks",
    label: "playBacks",
    icon: PlayCircle,
    content: <AdminPlayBacks />,
    roles: [Role.admin, Role.manager],
  },
  {
    name: "auditlogs",
    label: "Audit Logs",
    icon: ListOrdered,
    content: <AuditLogs />,
    roles: [Role.admin, Role.manager],
  },
  {
    name: "downlodelogs",
    label: "Downlode Logs",
    icon: Download,
    content: <DownLodeLogs />,
    roles: [Role.admin, Role.manager],
  },
];

export const carouselItems = [
  {
    imgSrc: "images/CapturePage/img1.webp",
    title: "PRONITE",
    route: "/pronite",
    description: `Brace yourselves for an electrifying night of live performances by some of the biggest stars in entertainment!",`,
  },
  {
    imgSrc: "images/CapturePage/img2.webp",
    title: "CULTURAL",
    route: "/cultural",
    description: `Feast your eyes to the glorious display of traditional brilliance paired alongside the glitzy, modern era`,
  },
  {
    imgSrc: "images/CapturePage/img3.webp",
    title: "PLAYBACKS",
    route: "/cultural-playbacks",
    description: `When your life needs some playbacks!`,
  },
  {
    imgSrc: "images/CapturePage/img4.webp",
    title: "EVENTS",
    route: "/events",
    description: `Dive into a thrilling world of exciting events and competitions, tailored for every interest, at Incridea!`,
  },

  {
    imgSrc: "images/CapturePage/img5.webp",
    title: "STORIES",
    route: "/stories",
    description: `Stories captured for you`,
  },
  {
    imgSrc: "images/CapturePage/img5.webp",
    title: "ABODE OF MEMORIES",
    route: "/your-snaps",
    description: `The memories all so sweet, with moments cherished for life. Here lies the moments cherished with ones we love to cross paths by`,
  },
  {
    imgSrc: "images/CapturePage/img3.webp",
    title: "Behind Incridea",
    route: "/behindincridea",
    description: `Explore the behind-the-scenes moments`,
  },
  {
    imgSrc: "images/CapturePage/img3.webp",
    title: "Accolades",
    route: "/accolades",
    description: `Accolades – More than just trophies. They’re the celebration of grit, passion, and those unforgettable moments when hard work meets success`,
  },
];
