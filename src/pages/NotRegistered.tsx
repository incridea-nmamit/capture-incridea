import React from 'react';
import { signIn, signOut } from 'next-auth/react';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';

const NotRegistered: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-gray-200 text-center p-6 backdrop-blur-md">
      <FallingClipart/>
      <h1 className="text-5xl font-semibold mb-6 text-shadow-lg text-center">
        We are sorry !
      </h1>

      <div className="text-lg leading-relaxed space-y-4 opacity-90 text-center max-w-lg mx-auto">
        <p className="mb-4 text-xl">
          <strong>It seems like you haven't registered with <a href="https://incridea.in" className="text-white  hover:text-blue-700">incridea.in</a></strong>
        </p>
        
        <p className="mb-4">
        &#x2022; Please head over to <strong> <a href="https://incridea.in" className="text-white  hover:text-blue-700">incridea.in</a> </strong>to register <br/> and join the experience.
        </p>
        
        
      </div>

      <button
        onClick={() => signOut()}
        className="px-6 py-3 my-10 text-lg font-bold text-white bg-gradient-to-r from-red-400 via-pink-500 to-red-600 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
      >
        Log Out
      </button>
      
    </div>
  );
};

export default NotRegistered;
