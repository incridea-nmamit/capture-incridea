import React, { useEffect, useState } from 'react';
import TeamAdmin from '~/components/TeamAdminComponent/TeamAdmin';
import useUserRole from '~/hooks/useUserRole';
import EventsAdmin from '~/components/EventsAdminComponent/EventsAdmin';
import CapturesAdmin from '~/components/CapturesAdminComponent/CapturesAdmin';
import Analytics from '../analytics';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import RemovalRequest from '~/components/RemovalRequestPage/RemovalRequest';
import { api } from '~/utils/api';
import ManageRoles from '~/components/ManageRoles/ManageRoles';
import ExecuteEvents from '~/components/ExecuteTabAdmin/ExecuteEvents';
import VariableComponent from '~/components/VariableComponent';
import SMCUploads from '~/components/SMCUploads/SMCUploads';
import Stories from '~/components/Stories/Stories';
import ApproveCaptures from '~/components/ApproveCapture/ApproveCapture';

const Dashboard = () => {
  const userRole = useUserRole();
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>(''); 
  const [showMessageOnce, setShowMessageOnce] = useState(true); 
  const [pendingCount, setPendingCount] = useState<number>(0); 
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: removalRequests} = api.request.getAll.useQuery();

  useEffect(() => {
    if (removalRequests) {
      const pendingRequests = removalRequests.filter((req) => req.status === 'pending');
      setPendingCount(pendingRequests.length);
    }
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
    if (activeTab === 'events') return <div><EventsAdmin /></div>;
    if (activeTab === 'captures') return <div><CapturesAdmin /></div>;
    if (activeTab === 'team') return <div><TeamAdmin /></div>;
    if (activeTab === 'analytics') return <div><Analytics /></div>;
    if (activeTab === 'manageroles') return <div><ManageRoles /></div>;
    if (activeTab === 'removalrequest') return <div><RemovalRequest /></div>;
    if (activeTab === 'executeevents') return <div><ExecuteEvents /></div>;
    if (activeTab === 'variables') return <div><VariableComponent /></div>;
    if (activeTab === 'smc') return <div><SMCUploads /></div>;
    if (activeTab === 'stories') return <div><Stories /></div>;
    if (activeTab === 'approvecap') return <div><ApproveCaptures /></div>;

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
              ? ' and you have access to everything✌!'
              : session?.user.role === 'editor'
              ? 'and you can manage all media captures on this website✌!'
              : session?.user.role === 'manager'
              ? 'and you can manage & update events and teams on this website✌!'
              : 'keep up the great work!'}
            🚀
          </p>
        </div>
      );
    }
  };

  const renderTabNavigation = () => (
    <div className="flex flex-col mb-4 gap-5">
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('manageroles');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'manageroles'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
        >
          Manage Roles
        </button>
      )}
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('events');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'events'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
        >
          Events
        </button>
      )}
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('team');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'team'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
        >
          Teams
        </button>
      )}
      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('captures');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'captures'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
        >
          Captures
        </button>
      )}

      {userRole === 'admin' && (
        <button
          onClick={() => {
            setActiveTab('analytics');
            setShowMessageOnce(false);
          }}
          className={`flex-1 text-center p-2 rounded-lg font-BebasNeue text-lg ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}                
        >
          Analytics
        </button>
      )}

        {(userRole === 'admin' || userRole === 'editor') && (
        <button
        onClick={() => {
          setActiveTab('removalrequest');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'removalrequest'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
      >
        Request
        {pendingCount > 0 && (
          <span className="bg-white text-black text-xs rounded-full px-2 py-1">
            {pendingCount}
          </span>
        )}
      </button>
      
      )}

{(userRole === 'admin') && (
        <button
        onClick={() => {
          setActiveTab('variables');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'variables'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
      >
        Variables
      </button>
      
      )}

{(userRole === 'admin') && (
        <button
        onClick={() => {
          setActiveTab('executeevents');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'executeevents'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
      >
        Execute Events
      </button>
      
      )}

{(userRole === 'admin'|| userRole === 'editor' || userRole === 'smc' ) && (
        <button
        onClick={() => {
          setActiveTab('smc');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'smc'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
      >
        SMC Uploads
      </button>
      
      )}

{(userRole === 'admin'|| userRole === 'editor') && (
        <button
        onClick={() => {
          setActiveTab('stories');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'stories'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
      >
        Stories
      </button>
      
      )}

{(userRole === 'admin'|| userRole === 'manager') && (
        <button
        onClick={() => {
          setActiveTab('approvecap');
          setShowMessageOnce(false);
        }}
        className={`relative flex items-center justify-center gap-2 text-center p-2 rounded-lg  font-BebasNeue text-lg ${
          activeTab === 'approvecap'
              ? 'bg-gradient-to-r from-blue-700 to-green-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gradient-to-r from-blue-700 to-green-700'
          } transition duration-200`}  
      >
        Approve Captures
      </button>
      
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row bg-zinc-800 text-white min-h-screen ">
      {/* Sidebar */}
      <div className="md:w-48 w-full p-4 bg-zinc-900 bg-cover bg-opacity-100">
        {renderTabNavigation()}
      </div>

      {/* Content Area */}
      <div className="md:w-5/6 w-full min-h-screen p-4" style={{ backgroundImage: "url('https://utfs.io/f/0yks13NtToBi0t1oCo8NtToBiULsc4C1KNaJSf9je8Rp2kXm')"}}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
