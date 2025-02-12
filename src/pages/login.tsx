import Image from "next/image";
import { signIn } from "next-auth/react"; // Make sure to import signIn if you're using NextAuth.js
import ImageGrid from "~/components/login/imageGrid";

const LoginComponent = () => {
  return (
    <ImageGrid>
      <div className="z-50 flex h-full flex-col items-center justify-center rounded-t-2xl bg-neutral-950 p-4">
        <a href="/" className="rounded-xl shadow-2xl">
          <Image
            src="/images/Logo/capture-main.webp"
            alt="Logo"
            width={200}
            height={80}
            className="my-10 h-10 w-auto"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        </a>
        <div className="text-md z-50 mx-auto max-w-lg space-y-4 px-4 text-left leading-relaxed opacity-90 sm:px-6 md:text-xl">
          <h1 className="text-shadow-lg z-50 mb-6 py-2 text-center font-Teknaf text-2xl font-semibold md:text-4xl">
            Welcome to Capture Incridea!
          </h1>
          <div className="p-2 font-Trap-Regular text-sm">
            <p className="text-md mb-4">
              <strong>We’re delighted to have you here!</strong>
              <br />
              Experience the magic of Incridea through stunning moments captured
              by our amazing team.
            </p>

            <p className="mb-4 font-Trap-Regular">
              &#x2022; Log in using the Email Id you registered for Incridea.
            </p>

            <p className="mb-4 font-Trap-Regular">
              &#x2022; If you haven't registered yet, head over to{" "}
              <strong>
                <a
                  href="https://incridea.in"
                  className="text-white hover:text-blue-700"
                >
                  incridea.in
                </a>
              </strong>
              to register and join the experience.
            </p>

            <p className="font-Trap-Regular text-sm font-semibold text-white">
              This platform is exclusively for Registered Students & Faculty
              only.
            </p>
          </div>
        </div>

        {/* Log In Button */}
        <button
          onClick={() => signIn("google")}
          className="z-50 mx-auto my-5 max-w-xs transform rounded-lg bg-gradient-to-r from-red-400 via-pink-500 to-red-600 px-6 py-3 font-Trap-Regular text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          Log In
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

export default LoginComponent;
