/**
 * Admin Dashboard Component
 * Provides role-based navigation and content management interface
 */

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { tabs } from '~/components/constants/data';

interface TabState {
  activeTab: string;
  pendingCount: number;
  sidebarOpen: boolean;
}

const Dashboard = () => {
  // State management for tabs and sidebar
  const [state, setState] = useState<TabState>({
    activeTab: '',
    pendingCount: 0,
    sidebarOpen: false
  });

  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: removalRequests } = api.request.getPendingCount.useQuery();

  /**
   * Effect hook to restore active tab from session storage
   */
  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
      setState((prevState) => ({ ...prevState, activeTab: savedTab }));
    }
  }, []);

  useEffect(() => {
    setState((prevState) => ({ ...prevState, pendingCount: removalRequests || 0 }));
  }, [removalRequests]);

  /**
   * Effect hook for authentication and role checks
   */
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/unauthorized');
    } else if (status === 'authenticated' && session?.user?.role === 'user') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  /**
   * Handles tab selection and state persistence
   * @param name - Name of the selected tab
   */
  const handleTabClick = (name: string) => {
    setState((prevState) => ({ ...prevState, activeTab: name, sidebarOpen: false }));
    sessionStorage.setItem('activeTab', name);
  };

  /**
   * Renders the navigation sidebar
   * @returns JSX for sidebar navigation
   */
  const renderSidebar = () => (
    <div
      className={`absolute mt-16 lg:relative bg-neutral-950 max-w-48 transition-all ${
        state.sidebarOpen ? '-ml-48  ' : ''
      } z-20 max-h-[calc(100vh-4rem)] lg:max-h-none overflow-y-auto lg:overflow-visible`}
    >
      <div className="relative p-4">
        <div className="flex flex-col mb-4 gap-4">
          {tabs.map(({ name, label, icon: Icon, roles }) =>
            //happens string matching underthehood so not a problem
            //@ts-ignore
            roles.includes(session?.user?.role) ? (
              <button
                key={name}
                onClick={() =>{
                  handleTabClick(name)
                  setState((prevState) => ({ ...prevState, sidebarOpen: true }));
                }}
                className={`relative flex items-center text-md h-12 gap-2 p-1.5 rounded-lg ${
                  state.activeTab === name
                    ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
                }`}
              >
                <div className="flex-1">{label}</div>
                {name === 'removalrequest' && state.pendingCount > 0 && (
                  <span className="bg-yellow-300 text-black text-xs rounded-full aspect-square w-5 grid place-content-center">
                    {state.pendingCount}
                  </span>
                )}
                <Icon size={18} />
              </button>
            ) : null
          )}
        </div>
        <button
          onClick={() => setState((prevState) => ({ ...prevState, sidebarOpen: !prevState.sidebarOpen }))}
          className="absolute right-0 translate-x-full h-20 bg-gray-800 p-1 md:p-2 grid place-content-center rounded top-1/2 -translate-y-1/2"
        >
          {state.sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
    </div>
  );

  /**
   * Renders the main content area based on active tab
   * @returns JSX for main content
   */
  const renderContent = () => {
    const activeTabData = tabs.find((tab) => tab.name === state.activeTab);
    return activeTabData ? (
      activeTabData.content
    ) : (
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
              ? 'and you can manage all media captures, story management, and remove requests on this website✌!'
              : session?.user.role === 'manager'
                ? 'and you can manage & update events and teams on this website✌!'
                : 'keep up the great work!'}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      <div className="flex">
        {renderSidebar()}
        <main className="w-full">
          <div className="w-full min-h-screen p-0 md:p-4 mt-20">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
