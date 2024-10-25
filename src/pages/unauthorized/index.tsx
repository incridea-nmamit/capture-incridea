import React, { useEffect } from 'react';
import { signOut, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const NotAuthorized = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if the session is loading
    if (status === 'loading') return;
    // If the session exists and the role is not 'user', redirect to /admin
    if (session && session.user.role !== 'user') {
      void router.push('/admin');
    }
  }, [session, status, router]);

  const handleSignOutAndIn = async () => {
    await signOut({ redirect: false }); // Do not redirect immediately
    await signIn();
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg/aaric.jpg')" }}
    >
      {/* Dim the background using an absolute div with black background and opacity */}
      <div className="absolute inset-0 bg-black opacity-75" />
      <div className="relative z-10 text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">Oops! Unauthorized!</h1>
        <p className="text-xl mb-8">Looks like you stumbled into the wrong neighborhood! </p>
        <p className="text-lg">
          This page isn&apos;t for you! If you think you belong here, maybe try signing in again!
        </p>
        <button
          onClick={handleSignOutAndIn}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
