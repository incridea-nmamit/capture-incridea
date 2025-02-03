import Image from "next/image";
import { signIn } from "next-auth/react";
import ImageGrid from "~/components/login/imageGrid";

const LoginComponent = () => {
  return (
    <ImageGrid>
      <div className="z-50 flex h-full flex-col items-center justify-center rounded-t-3xl bg-neutral-950 p-4">
      <Image
            src="/images/Logo/inc-abt.webp"
            alt="Logo"
            width={100}
            height={80}
            className="mt-6 h-7 w-auto"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          <Image
            src="/images/Logo/capture-main.webp"
            alt="Logo"
            width={200}
            height={80}
            className="mb-10 h-10 w-auto"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        <div className="text-md text-left z-50 mx-auto max-w-lg space-y-4 px-4 leading-relaxed opacity-90 sm:px-6 md:text-xl">
          <div className="p-2 font-Trap-Regular text-sm">
            <p className="text-md mb-8 text-md text-center">
              <strong>We’re delighted to have you here!</strong>
              <br />
              Experience the magic of Incridea through stunning moments captured
              by our amazing team.
            </p>

            <p className="mb-4 font-Trap-Regular">
              &rarr; Log in using the Email Id you registered for Incridea.
            </p>

            <p className="mb-4 font-Trap-Regular">
              &rarr; If you haven't registered yet, head over to{" "}
              <strong>
                <a
                  href="https://incridea.in"
                  className="text-white hover:text-blue-700"
                >
                  incridea.in &nbsp;
                </a>
              </strong>
              <br/>to register and join the experience.
            </p>
          </div>
        </div>

        {/* Log In Button */}
        <button
          onClick={() => signIn('google')}
          className="z-50 mx-auto my-5 max-w-xs w-52 transform rounded-full bg-gradient-to-br from-gray-900 via-blue-800 to-gray-900 px-6 py-3 font-Trap-Regular text-md font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl border-1 border-white"
        >
          Log In
        </button>
        
        <p className="font-Trap-Regular text-xs font-semibold text-white text-center mt-10">
              This platform is exclusively for Registered Students & Faculty
              only.
            </p>

        {/* Footer */}
        <p className="z-50 text-center font-Trap-Regular text-xs my-5">
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
