import Image from "next/image";
import { signOut } from "next-auth/react"; // Ensure you are using signOut if you're using NextAuth.js
import ImageGrid from "~/components/login/imageGrid";

const NotRegistered = () => {
  return (
    <ImageGrid>
      <div className="z-50 flex h-full flex-col items-center justify-center rounded-t-2xl bg-neutral-950 p-4">
        <a href="/" className="rounded-xl shadow-2xl">
          <Image
            src="/images/Logo/capture-main.webp"
            alt="Logo"
            width={200}
            height={80}
            className=""
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </a>
        <div className="text-md z-50 mx-auto max-w-lg space-y-4 px-4 text-left leading-relaxed opacity-90 sm:px-6 md:text-xl">
          <h1 className="text-shadow-lg z-50 mb-6 text-center font-Hunters text-4xl font-semibold md:text-5xl">
            Oops, Not Registered Yet!
          </h1>
          <div className="p-2 font-Trap-Regular">
            <p className="text-md mb-4">
              <strong>Oops, it seems like you're not registered yet!</strong>
              <br />
              In order to access all the features of Capture Incridea, you need
              to register first.
            </p>

            <p className="mb-4">
              &#x2022; If you have an account, please log in with the email you
              registered.
            </p>

            <p className="mb-4">
              &#x2022; If you haven’t registered yet, please visit{" "}
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

        {/* Register Button */}
        <button
          onClick={() => (window.location.href = "https://incridea.in")} // Redirecting to the registration page
          className="z-50 mx-auto my-5 max-w-xs transform rounded-lg bg-gradient-to-r from-red-400 via-pink-500 to-red-600 px-6 py-3 font-Trap-Regular text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          Register Now
        </button>

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
