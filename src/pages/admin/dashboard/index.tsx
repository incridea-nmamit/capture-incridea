// src/pages/admin/dashboard.tsx

import React, { useEffect, useState } from 'react';
import TeamAdmin from '~/components/TeamAdminComponent/TeamAdmin';
import useUserRole from '~/hooks/useUserRole'; // Import the custom hook
import EventsAdmin from '~/components/EventsAdminComponent/EventsAdmin';
import CapturesAdmin from '~/components/CapturesAdminComponent/CapturesAdmin';
import Analytics from '../analytics';

// Sample Components for Each Option
const Events = () => <EventsAdmin/>;
const Team = () => <TeamAdmin/>;
const Captures = () => <CapturesAdmin/>;

const Dashboard = () => {
  const userRole = useUserRole(); // Fetch user role in real-time
  const [selectedOption, setSelectedOption] = useState('Captures');
  const [options, setOptions] = useState<string[]>([]); // State for options
  const [analyticsOption, setAnalyticsOption] = useState(false);
  const [activeTab, setActiveTab] = useState('accessData');

  // Update available options based on user role
  useEffect(() => {
    if (userRole === 'admin') {
      setOptions(['Events', 'Team', 'Captures']);
      setSelectedOption('Captures'); // Reset to a default option
    } else if (userRole === 'manager') {
      setOptions(['Events', 'Team']);
      setSelectedOption('Events'); // Reset to a default option
    } else if (userRole === 'editor') {
      setOptions(['Captures']);
      setSelectedOption('Captures'); // Reset to a default option
    } else {
      setOptions([]); // Clear options for unknown roles
    }

    console.log("Updated options:", options); // Debug log
  }, [userRole]); // Run whenever userRole changes

  const renderComponent = () => {
    if (activeTab === 'analytics') {
      return <Analytics />; // Render Analytics component when the Analytics tab is selected
    }
  
    // Render components based on the selected option if the active tab is Access Data
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

  const renderTabNavigation = () => {
    return (
      <div className="flex flex-col mb-4">
        <button
          onClick={() => setActiveTab('accessData')}
          className={`flex-1 text-center p-2 ${activeTab === 'accessData' ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} transition duration-200`}
        >
          Access Data
        </button>
        {userRole === 'admin' && ( // Only render Analytics tab if the user is an admin
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 text-center p-2 ${activeTab === 'analytics' ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'} transition duration-200`}
          >
            Analytics
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row bg-zinc-800 text-white min-h-screen">
      {/* Sidebar */}
      <div className="md:w-48 w-full p-4 bg-zinc-900 bg-cover">
        <h2 className="text-lg font-bold mb-4">Access Data</h2>
  
        {/* Tab Navigation */}        
        {renderTabNavigation()}
  
        {/* Dropdown for Access Data */}
        {activeTab === 'accessData' && (
          <div className="relative">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)} // Update selected option
              className="block appearance-none w-full max-w-xs sm:max-w-full bg-gray-700 border border-gray-600 text-white p-2 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
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
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
  
      {/* Content Area */}
      <div className="md:w-5/6 w-full p-4 bg-zinc-800">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;