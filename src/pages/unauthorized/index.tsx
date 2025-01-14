import React, { useEffect } from 'react';
import { signOut, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';
import ImageGrid from '~/components/login/imageGrid';

const NotAuthorized = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session && session.user.role !== 'user') {
      void router.push('/admin');
    }
  }, [session, status, router]);

  const handleSignOutAndIn = async () => {
    await signOut({ redirect: false }); // Do not redirect immediately
    await signIn();
  };

  return (
    <ImageGrid>
      <FallingClipart />
      <div className="z-50 flex flex-col items-center justify-center h-full bg-neutral-950 rounded-t-2xl p-4 ">
        <a href="/" className="shadow-2xl bg-black rounded-xl">
          <Image
            src="/images/Logo/capture-main.png"
            alt="Logo"
            width={200}
            height={80}
            className=""
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </a>
        <div className="z-50 text-md md:text-xl leading-relaxed space-y-4 opacity-90 text-left max-w-lg mx-auto px-4 sm:px-6">
          <h1 className="z-50 text-4xl font-Hunters md:text-5xl font-semibold mb-6 text-shadow-lg text-center">
            Oops! Your Unauthorized!
          </h1>
          <div className="p-2 font-Trap-Regular">
            <p className="mb-4 text-md">
              <strong>Oops, it seems like are at wrong destination</strong><br />
              Looks like you stumbled into the wrong neighborhood!
            </p>

            <p className="mb-4">
              This page isn&apos;t for you! Maybe try signing in again with a authorized account!
            </p>


          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={handleSignOutAndIn}
          className="mt-4 px-6 py-2 bg-white text-black font-bold rounded hover:bg-black hover:text-white transition"
        >
          Sign In
        </button>

        {/* Footer */}
        <p className="z-50 font-Trap-Regular text-xs text-center">
          If you encounter any issues, <br /> Please feel free to reach out to us at{" "}
          <a href="mailto:capture.incridea@nmamit.in" className="text-white">
            capture.incridea@nmamit.in
          </a>
        </p>
      </div>
    </ImageGrid>
  );
};

export default NotAuthorized;
