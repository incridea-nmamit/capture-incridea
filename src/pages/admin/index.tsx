/**
 * Admin Page Component
 * Handles authentication, role-based access, and displays welcome message
 */

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

/**
 * Creates a typewriter effect animation
 * @param text - Text to animate
 * @param delay - Delay between each character
 */
const typewriterEffect = (text: string, delay: number) => {
  return new Promise<void>((resolve) => {
    let index = 0;
    const result = setInterval(() => {
      if (index < text.length) {
        index++;
      } else {
        clearInterval(result);
        resolve();
      }
    }, delay);
  });
};

/**
 * Main Admin component
 * Handles session management and renders appropriate content based on user role
 */
function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [welcomeText, setWelcomeText] = useState('');

  /**
   * Effect hook for authentication and welcome message
   * Handles routing based on authentication status and user role
   */
  useEffect(() => {
    const welcomeMessage = `${session?.user?.name}!`;
    const typingDelay = 0; 
    const typeText = async () => {
      for (let i = 0; i <= welcomeMessage.length; i++) {
        setWelcomeText(welcomeMessage.slice(0, i));
        await typewriterEffect(welcomeMessage.slice(0, i), typingDelay);
      }
    };

    if (status === 'authenticated' && session) {
      void typeText();
    }
    
    if(status ==='unauthenticated')
    {
      void router.push('unauthorized')
    }
    if (status === 'authenticated' && session?.user?.role === 'user') {
      void router.push('/unauthorized');
    }
  }, [session, status, router]);

  // Loading state
  if (status === 'loading') {
    return <div className="text-white">Loading...</div>;
  }

  /**
   * Render authenticated user content
   * Shows welcome message and dashboard access button
   */
  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-neutral-950 text-white bg-cover">
        <div className="text-center ">
          <h1 className="text-5xl font-Teknaf mb-4 ">
            Welcome to the {session.user.role.toUpperCase()} Panel <br/>
            {welcomeText}
          </h1>
          <p className="font-Trap-Regular text-lg mb-2">
            You are logged in with {session.user.email?.toLowerCase()}
          </p>
          <button className="font-Trap-Black mt-4 px-6 py-2 text-blue-500 font-bold rounded shadow-lg transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            You have the {session.user.role} access
          </button>
          <div className="mt-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="font-Trap-Black px-6 py-2 bg-blue-800 text-white font-bold rounded shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
