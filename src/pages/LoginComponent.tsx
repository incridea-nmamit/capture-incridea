import React from 'react';
import { signIn } from 'next-auth/react';

const LoginComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-950/50 text-gray-200 text-center p-6 backdrop-blur-md">
      <h1 className="text-4xl font-semibold mb-4 text-shadow-lg">
        Welcome to Captures!
      </h1>
      <p className="text-lg mb-8 max-w-md leading-relaxed opacity-90">
        Sign in to explore the stunning moments captured by our amazing team.
        Your adventure starts here!
      </p>
      <button
        onClick={() => signIn()}
        className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-red-400 via-pink-500 to-red-600 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
      >
        Sign In
      </button>
    </div>
  );
};

export default LoginComponent;
