import Image from "next/image";
import { signOut, useSession } from "next-auth/react"; // Ensure you are using signOut if you're using NextAuth.js
import ImageGrid from "~/components/login/imageGrid";
import { HiOutlineLogout } from "react-icons/hi";

const NotRegistered = () => {
  const { data: session } = useSession();
  return (
    <ImageGrid>
      <div className="z-50 flex h-full flex-col items-center justify-center rounded-t-2xl bg-neutral-950 p-4">
      <Image
            src="/images/Logo/inc-abt.webp"
            alt="Logo"
            width={100}
            height={80}
            className="mt-6 h-7 w-auto"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            loading="lazy" // added lazy loading
          />
          <Image
            src="/images/Logo/capture-main.webp"
            alt="Logo"
            width={200}
            height={80}
            className="mb-10 h-10 w-auto"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            loading="lazy" // added lazy loading
          />
        <div className="text-md z-50 mx-auto max-w-lg space-y-4 px-4 text-left leading-relaxed opacity-90 sm:px-6 md:text-xl">
          <h1 className="text-shadow-lg z-50 mb-6 text-center font-Hunters text-2xl font-semibold md:text-3xl">
            Oops, Not Registered Yet!
          </h1>
          <div className="p-2 font-Trap-Regular text-sm">
            <p className="text-md mb-4">
              <strong>Oops, it seems like you're not registered yet!</strong>
              <br />
              In order to access all the features of Capture Incridea, you need
              to register first.
            </p>

            <p className="mb-4">
            &rarr; If you have an account, please log in with the email you
              registered.
            </p>

            <p className="mb-4">
            &rarr; If you haven’t registered yet, please visit{" "}
              <strong>
                <a
                  href="https://incridea.in"
                  className="text-white hover:text-blue-700"
                >
                  incridea.in
                </a>
              </strong>
              to create an account and join our community.
            </p>

            <p className="text-sm font-semibold text-white">
              This platform is exclusively for Registered Students & Faculty
              only.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-10">
          {/* Register Button */}
          <button
            onClick={() => (window.location.href = "https://incridea.in")} // Redirecting to the registration page
            className="z-50 mx-auto my-10 max-w-xs w-52 transform rounded-full bg-gradient-to-br from-gray-900 via-blue-800 to-gray-900 px-6 py-3 font-Trap-Regular text-md font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl border-1 border-white"
          >
            Register Now
          </button>

        {session && (
          <div className="flex items-center justify-center">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 font-Trap-Regular text-lg text-white"
          >
            <HiOutlineLogout size={32}/>
          </button>
          </div>
        )}
        </div>

        {/* Footer */}
        <p className="z-50 text-center font-Trap-Regular text-xs">
          If you encounter any issues, <br /> Please feel free to reach out to
          us at{" "}
          <a href="mailto:capture.incridea@nmamit.in" className="text-white">
            capture.incridea@nmamit.in
          </a>
        </p>
      </div>
    </ImageGrid>
  );
};

export default NotRegistered;
