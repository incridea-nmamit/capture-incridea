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
  MailCheck,
  MessageSquare
} from "lucide-react";

import EventsAdmin from "~/components/EventsAdmin/EventsAdmin";
import CapturesAdmin from "~/components/CapturesAdmin/CapturesAdmin";
import TeamAdmin from "~/components/TeamAdmin/TeamAdmin";
import ManageRoles from "~/components/ManageRoles/ManageRoles";
import RemovalRequest from "~/components/RemovalRequestAdmin/RemovalRequest";
import ControlComponent from "~/components/ControlAdmin/ControlComponent";
import ApproveCaptures from "~/components/ApproveCapture/ApproveCapture";

import { Role } from "@prisma/client";
import AdminPlayBacks from "../Playbacks";
import AuditLogs from "../AuditLogs";
import DownloadLogs from "../downlodeLogs";
import EmailVerifications from "../Verifications";
import FeedbackAdmin from "../FeedbackAdmin/";


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
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2022/IMG_0373.webp"
            alt="startup template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2022/IMG_2204.webp"
            alt="startup template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2022/IMG_9452.webp"
            alt="startup template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
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
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2023/DSC_0300.webp"
            alt="feature template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2023/DSC_1080.webp"
            alt="bento template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2023/IMG_6193.webp"
            alt="cards template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
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
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2024/IMG_0162.webp"
            alt="feature template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2024/DSC05653.webp"
            alt="bento template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="/images/2024/MVB04911.webp"
            alt="cards template"
            width={500}
            height={500}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
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
    roles: [Role.admin, Role.editor],
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
    roles: [Role.admin, Role.editor],
  },
  {
    name: "controls",
    label: "Settings",
    icon: Settings,
    content: <ControlComponent />,
    roles: [Role.admin],
  },
  {
    name: "approvecap",
    label: "Approve Captures",
    icon: BookCheck,
    content: <ApproveCaptures />,
    roles: [Role.admin],
  },
  {
    name: "playbacks",
    label: "playBacks",
    icon: PlayCircle,
    content: <AdminPlayBacks />,
    roles: [Role.admin],
  },
  {
    name: "auditlogs",
    label: "Audit Logs",
    icon: ListOrdered,
    content: <AuditLogs />,
    roles: [Role.admin],
  },
  {
    name: "downloadlogs",
    label: "Download Logs",
    icon: Download,
    content: <DownloadLogs />,
    roles: [Role.admin],
  },
  {
    name: "verifiedemails",
    label: "Verfications",
    icon: MailCheck,
    content: <EmailVerifications/>,
    roles: [Role.admin],
  },
  {
    name: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    content: <FeedbackAdmin/>,
    roles: [Role.admin],
  },
];

export const carouselItems = [
  {
    imgSrc: "images/CapturePage/pronite.webp",
    title: "Pronite",
    route: "/pronite",
    description: `
Brace yourself for a night of electrifying live performances,
featuring top stars, high-energy music, and an unforgettable atmosphere.
Grab your tickets now and be part of the excitement!",`,
  },
  {
    imgSrc: "images/CapturePage/cultural.webp",
    title: "Cultural",
    route: "/cultural",
    description: `Feast your eyes to the glorious display of traditional brilliance paired alongside the glitzy, modern era`,
  },
  {
    imgSrc: "images/CapturePage/playbacks.webp",
    title: "Playbacks",
    route: "/playbacks",
    description: `When your life needs some playbacks!`,
  },
  {
    imgSrc: "images/CapturePage/events.webp",
    title: "Events",
    route: "/events",
    description: `Dive into a thrilling world of exciting events and competitions, tailored for every interest, at Incridea!`,
  },
  {
    imgSrc: "images/CapturePage/yoursnaps.webp",
    title: "Abode Of Memories",
    route: "/your-snaps",
    description: `The memories all so sweet, with moments cherished for life. Here lies the moments cherished with ones we love to cross paths by`,
  },
  {
    imgSrc: "images/CapturePage/behindincridea.webp",
    title: "Behind Incridea",
    route: "/behindincridea",
    description: `Explore the behind-the-scenes moments`,
  },
  {
    imgSrc: "images/CapturePage/accolades.webp",
    title: "Accolades",
    route: "/accolades",
    description: `Accolades – More than just trophies. They’re the celebration of grit, passion, and those unforgettable moments when hard work meets success`,
  },
  {
    imgSrc: "images/CapturePage/faculty.webp",
    title: "Faculty",
    route: "/faculty",
    description: `Curated captures for the faculty`,
  },
];
