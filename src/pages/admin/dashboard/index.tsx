import React, { useEffect, useState } from 'react';
import TeamAdmin from '~/components/TeamAdmin/TeamAdmin';
import EventsAdmin from '~/components/EventsAdmin/EventsAdmin';
import CapturesAdmin from '~/components/CapturesAdmin/CapturesAdmin';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import RemovalRequest from '~/components/RemovalRequestAdmin/RemovalRequest';
import { api } from '~/utils/api';
import ManageRoles from '~/components/ManageRoles/ManageRoles';
import SMCUploads from '~/components/SMCUploads/SMCUploads';
import Stories from '~/components/Stories/Stories';
import ApproveCaptures from '~/components/ApproveCapture/ApproveCapture';
import ControlComponent from '~/components/ControlAdmin/ControlComponent';
import { Role } from '@prisma/client';
import { Aperture, ArrowRight, Bell, BookCheck, CalendarCog, ChevronLeft, ChevronRight, GalleryHorizontalEnd, ImageUp, Settings, UserCog, Users } from 'lucide-react';


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"

const tabs = [
  {
    name: "events",
    sideBarContent: ({ }: any) => <><div className='w-full'>Events </div><CalendarCog size={18} /></>,
    content: () => <EventsAdmin />,
    permittedRoles: [Role.admin, Role.manager]
  },
  {
    name: "captures",
    sideBarContent: ({ }: any) => <> <div className='w-full'>Captures </div><Aperture size={18} /></>,
    content: () => <CapturesAdmin />,
    permittedRoles: [Role.admin, Role.manager, Role.editor]
  },
  {
    name: "team",
    sideBarContent: ({ }: any) => <><div className='w-full'>Teams </div><Users size={18} /></>,
    content: () => <TeamAdmin />,
    permittedRoles: [Role.admin, Role.manager]
  },
  {
    name: "roles",
    sideBarContent: ({ }: any) => <><div className='w-full'>User Roles </div><UserCog size={18} /></>,
    content: () => <ManageRoles />,
    permittedRoles: [Role.admin]
  },
  {
    name: "removalrequest",
    sideBarContent: ({ pendingCount = 0 } = {}) => <><div className='w-full'>Request </div>{pendingCount > 0 && (
      <span className="bg-yellow-300 text-black text-xs rounded-full aspect-square w-5 grid place-content-center">
        {pendingCount}
      </span>
    )}<Bell size={18} /> </>,
    content: () => <RemovalRequest />,
    permittedRoles: [Role.admin, Role.manager, Role.editor]
  },
  {
    name: "controls",
    sideBarContent: ({ }: any) => <><div className='w-full'>Settings</div> <Settings size={18} /></>,
    content: () => <ControlComponent />,
    permittedRoles: [Role.admin]
  },
  {
    name: "smc",
    sideBarContent: ({ }: any) => <>Stories Uploads <ImageUp size={18} /></>,
    content: () => <SMCUploads />,
    permittedRoles: [Role.admin, Role.editor, Role.smc]
  },
  {
    name: "stories",
    sideBarContent: ({ }: any) => <>Capture Stories <GalleryHorizontalEnd size={18} /></>,
    content: () => <Stories />,
    permittedRoles: [Role.admin, Role.editor, Role.manager]
  },
  {
    name: "approvecap",
    sideBarContent: ({ }: any) => <>Approve Captures <BookCheck size={18} /></>,
    content: () => <ApproveCaptures />,
    permittedRoles: [Role.admin, Role.manager]
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: removalRequests } = api.request.getPendingCount.useQuery();

  useEffect(() => {
    setPendingCount(removalRequests || 0);
  }, [removalRequests]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/unauthorized');
    }

    if (status === 'authenticated' && session?.user?.role === 'user') {
      void router.push('/unauthorized');
    }
  }, [session, status, router]);

  const renderComponent = () => {
    const activeTabData = tabs.find(tab => tab.name === activeTab);
    if (activeTabData) {
      return activeTabData.content();
    } else {
      return (
        <div className="text-center mt-20 text-lg">
          <h1 className="text-center text-4xl font-Teknaf mb-8 text-white">
            Hey {session?.user.name}
          </h1>
          <p className="text-blue-400 font-Trap-Regular">
            Use <span className="text-yellow-500">Tabs</span> to switch to your destination! 🚀
          </p>
          <p className="text-gray-300 mt-2 font-Trap-Regular">
            Don’t worry, we’ve got all your needs covered!
          </p>
          <p className="text-blue-400 mt-10 font-Trap-Regular">
            You are the <span className="text-yellow-500">&nbsp;{session?.user.role}&nbsp;</span>
            {session?.user.role === 'admin'
              ? ' and you have access to everything✌!'
              : session?.user.role === 'editor'
                ? 'and you can manage all media captures, story management and remove requests on this website✌!'
                : session?.user.role === 'manager'
                  ? 'and you can manage & update events and teams on this website✌!'
                  : 'keep up the great work!'}
          </p>
        </div>
      );
    }
  };

  const renderTabNavigation = (open: boolean) => (

    <div className={`absolute lg:relative bg-primary-900 pt-20 max-w-48 transition-all ${open && "-ml-48"} z-20`} >


      <div className='relative p-4'>
        <div className="flex flex-col mb-4 gap-4 bg-primary-900 relative">
          {
            tabs.map((tab) => {
              //happens string matching underthehood so not a problem
              //@ts-ignore
              if (tab.permittedRoles.includes(session?.user.role)) {
                return (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setActiveTab(tab.name);
                    }}
                    className={`relative flex items-center font-Trap-Regular text-md h-16 justify-center gap-2 text-center p-2 rounded-lg ${activeTab === tab.name
                      ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
                      } transition duration-200`}
                  >
                    {tab.sideBarContent({ pendingCount })}
                  </button>
                );
              }
              return null;
            }
            )
          }

        </div>
        <button className='absolute right-0 translate-x-full max-w-6 h-20 bg-gray-800 p-2 grid place-content-center rounded top-1/2 -translate-y-1/2' onClick={() => setOpen(o => !o)}>
          {open ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

    </div>

  );


  const [open, setOpen] = React.useState(false)

  return (
    <div className="bg-primary-950/50 text-white min-h-screen">
      <div className='flex flex-row'>
        {renderTabNavigation(open)}
        <main className='w-full'>

          <div className="w-full min-h-screen p-4 mt-20">
            {renderComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
