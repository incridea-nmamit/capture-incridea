import React from 'react';
import { signIn } from 'next-auth/react';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';

const LoginComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-950/50 text-gray-200 text-center p-6 backdrop-blur-md">
      <FallingClipart/>
      <h1 className="text-5xl font-semibold mb-6 text-shadow-lg text-center">
        Welcome to Capture Incridea!
      </h1>

      <div className="text-lg leading-relaxed space-y-4 opacity-90 text-center max-w-lg mx-auto">
        <p className="mb-4 text-xl">
          <strong>We’re delighted to have you here ! </strong><br/> Experience the magic of Incridea through stunning moments captured by our amazing team
        </p>
        
        <p className="mb-4">
        &#x2022; Log in using the Email Id you registered for Incridea
        </p>
        
        <p className="mb-4">
        &#x2022; If you haven't registered yet head over to <strong> <a href="https://incridea.in" className="text-white  hover:text-blue-700">incridea.in</a> </strong>to register <br/> and join the experience.
        </p>
        
        <p className="font-semibold text-white text-sm ">
        This platform is exclusively for Registered Students & Faculty only <br/>
        
        </p>
      </div>

      <button
        onClick={() => signIn()}
        className="px-6 py-3 my-10 text-lg font-bold text-white bg-gradient-to-r from-red-400 via-pink-500 to-red-600 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
      >
        Log In
      </button>
      <p className='font-normal text-xs'>If you encounter any issues, <br/> Please feel free to reach out to us at capture.incridea@nmamit.in</p>
    </div>
  );
};

export default LoginComponent;
