import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const typewriterEffect = (text: string, delay: number) => {
  return new Promise<void>((resolve) => {
    let index = 0;
    const result = setInterval(() => {
      if (index < text.length) {
        index++;
      } else {
        clearInterval(result);
        resolve(); // Resolve the promise when the typing is done
      }
    }, delay);
  });
};

function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    const welcomeMessage = `Welcome to the Admin Panel, ${session?.user?.name}!`;
    const typingDelay = 0; // milliseconds

    // Typewriter effect
    const typeText = async () => {
      for (let i = 0; i <= welcomeMessage.length; i++) {
        setWelcomeText(welcomeMessage.slice(0, i)); // Update welcome text
        await typewriterEffect(welcomeMessage.slice(0, i), typingDelay); // Wait for typing delay
      }
    };

    if (status === 'authenticated' && session) {
      typeText();
    }

    // Check user role and redirect if necessary
    if (status === 'authenticated' && session?.user?.role === 'user') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="text-white">Loading...</div>; // Loading state
  }


  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white bg-cover">
        <div className="text-center ">
          <h1 className="text-5xl font-velocista mb-4 ">
            {welcomeText}
          </h1>
          <p className="font-silkscreen text-lg mb-2">
            You are logged in with {session.user.email}
          </p>
          <button className="font-velocista mt-4 px-6 py-2 border border-blue-500 text-blue-500 font-bold rounded shadow-lg transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            You are the {session.user.role}
          </button>
          <div className="mt-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="font-velocista px-6 py-2 bg-blue-500 text-white font-bold rounded shadow-lg transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
