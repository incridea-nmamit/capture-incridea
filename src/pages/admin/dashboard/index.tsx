// src/pages/admin/dashboard.tsx

import React, { useEffect, useState } from 'react';
import TeamAdmin from '~/components/TeamAdminComponent/TeamAdmin';
import useUserRole from '~/hooks/useUserRole';
import EventsAdmin from '~/components/EventsAdminComponent/EventsAdmin';
import CapturesAdmin from '~/components/CapturesAdminComponent/CapturesAdmin';
import Analytics from '../analytics';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

// Sample Components for Each Option
const Events = () => <EventsAdmin />;
const Team = () => <TeamAdmin />;
const Captures = () => <CapturesAdmin />;

const Dashboard = () => {
  const userRole = useUserRole();
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>(''); // Start with no active tab
  const [showMessageOnce, setShowMessageOnce] = useState(true); // Control the default message
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/unauthorized');
    }

    if (status === 'authenticated' && session?.user?.role === 'user') {
      void router.push('/unauthorized');
    }
  }, [session, status, router]);

  // Update options based on user role
  useEffect(() => {
    if (userRole === 'admin') {
      setOptions(['Events', 'Team', 'Captures']);
      setSelectedOption('Captures');
    } else if (userRole === 'manager') {
      setOptions(['Events', 'Team']);
      setSelectedOption('Events');
    } else if (userRole === 'editor') {
      setOptions(['Captures']);
      setSelectedOption('Captures');
    } else {
      setOptions([]);
    }
  }, [userRole]);

  const renderComponent = () => {
    if (activeTab === 'analytics') return <Analytics />;

    if (showMessageOnce) {
      return (
        <div className="text-center mt-20 text-lg">
          <h1 className="text-center text-4xl font-bold mb-8 text-white">
            Hey {session?.user.name}
          </h1>
          <p className="text-blue-400">
            Use <span className="text-yellow-500">Tabs</span> to switch to your destination! 🚀
          </p>
          <p className="text-gray-300 mt-2">
            Don’t worry, we’ve got all your needs covered!
          </p>
          <p className="text-blue-400 mt-10">
            You are the <span className="text-yellow-500">&nbsp;{session?.user.role}&nbsp;</span>
            {session?.user.role === 'admin'
              ? 'you have access to everything✌!'
              : session?.user.role === 'editor'
              ? 'you can upload / delete captures✌!'
              : 'keep up the great work!'}
            🚀
          </p>
        </div>
      );
    }

    switch (selectedOption) {
      case 'Events':
        return <Events />;
      case 'Team':
        return <Team />;
      case 'Captures':
      default:
        return <Captures />;
    }
  };

  const renderTabNavigation = () => (
    <div className="flex flex-col mb-4">
      <button
        onClick={() => {
          setActiveTab('accessData');
          setShowMessageOnce(false); // Hide message when clicking Access Data
        }}
        className={`flex-1 text-center p-2 ${
          activeTab === 'accessData'
            ? 'bg-gray-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        } transition duration-200`}
      >
        Access Data
      </button>

      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('analytics');
            setShowMessageOnce(false); // Hide message when switching to Analytics
          }}
          className={`flex-1 text-center p-2 ${
            activeTab === 'analytics'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          } transition duration-200`}
        >
          Analytics
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row bg-zinc-800 text-white min-h-screen">
      {/* Sidebar */}
      <div className="md:w-48 w-full p-4 bg-zinc-900 bg-cover">
        {renderTabNavigation()}

        {/* Dropdown for Access Data */}
        {activeTab === 'accessData' && (
          <div className="relative mt-2">
            <select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setShowMessageOnce(false); // Hide message when selecting an option
              }}
              className="block w-full max-w-xs sm:max-w-full bg-gray-700 border border-gray-600 text-white p-2 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            >
              {options.length > 0 ? (
                options.map((option) => (
                  <option key={option} value={option} className="bg-gray-700">
                    {option}
                  </option>
                ))
              ) : (
                <option value="" className="bg-gray-700">
                  No Access
                </option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="md:w-5/6 w-full p-4 bg-zinc-800">{renderComponent()}</div>
    </div>
  );
};

export default Dashboard;
