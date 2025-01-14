







// u can check unauthoried/notregistered/login component here







// import Image from "next/image";
// import { signIn } from "next-auth/react"; // Make sure to import signIn if you're using NextAuth.js
// import ImageGrid from "~/components/login/imageGrid";
// import FallingClipart from "~/components/BackgroundFallAnimation/FallingClipart";

// const Test = () => {
//     return (
//         <ImageGrid>
//             <FallingClipart />
//             <div className=" z-50 flex flex-col items-center justify-center h-full bg-neutral-950 rounded-t-2xl p-4 ">
//                 <a href="/" className="shadow-2xl bg-black rounded-xl">
//                     <Image
//                         src="/images/Logo/capture-main.png"
//                         alt="Logo"
//                         width={200}
//                         height={80}
//                         className=""
//                         onContextMenu={(e) => e.preventDefault()}
//                         onDragStart={(e) => e.preventDefault()}
//                     />
//                 </a>
//                 <div className="z-50 text-md md:text-xl leading-relaxed space-y-4 opacity-90 text-left max-w-lg mx-auto px-4 sm:px-6">
//                     <h1 className="z-50 text-4xl font-Hunters md:text-5xl font-semibold mb-6 text-shadow-lg text-center">
//                         Welcome to Capture Incridea!
//                     </h1>
//                     <div className="p-2 font-Trap-Regular">
//                         <p className="mb-4 text-md">
//                             <strong>We’re delighted to have you here!</strong><br />
//                             Experience the magic of Incridea through stunning moments captured by our amazing team.
//                         </p>

//                         <p className="mb-4">
//                             &#x2022; Log in using the Email Id you registered for Incridea.
//                         </p>

//                         <p className="mb-4">
//                             &#x2022; If you haven't registered yet, head over to{" "}
//                             <strong>
//                                 <a href="https://incridea.in" className="text-white hover:text-blue-700">
//                                     incridea.in
//                                 </a>
//                             </strong>
//                             to register and join the experience.
//                         </p>

//                         <p className="font-semibold text-white text-sm">
//                             This platform is exclusively for Registered Students & Faculty only.
//                         </p>
//                     </div>
//                 </div>
//                 <button
//                     onClick={() => signIn()}
//                     className="font-Trap-Regular z-50 px-6 py-3 my-5 text-lg font-bold text-white bg-gradient-to-r from-red-400 via-pink-500 to-red-600 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 max-w-xs mx-auto"
//                 >
//                     Log In
//                 </button>

//                 {/* Footer */}
//                 <p className="z-50 font-Trap-Regular text-xs text-center">
//                     If you encounter any issues, <br /> Please feel free to reach out to us at{" "}
//                     <a href="mailto:capture.incridea@nmamit.in" className="text-white">
//                         capture.incridea@nmamit.in
//                     </a>
//                 </p>
//             </div>
//         </ImageGrid>
//     );
// };

// export default Test;


// import Image from "next/image";
// import { signOut } from "next-auth/react"; // Ensure you are using signOut if you're using NextAuth.js
// import ImageGrid from "~/components/login/imageGrid";
// import FallingClipart from "~/components/BackgroundFallAnimation/FallingClipart";

// const Test = () => {
//     return (
//         <ImageGrid>
//             <FallingClipart />
//             <div className="z-50 flex flex-col items-center justify-center h-full bg-neutral-950 rounded-t-2xl p-4 ">
//                 <a href="/" className="shadow-2xl bg-black rounded-xl">
//                     <Image
//                         src="/images/Logo/capture-main.png"
//                         alt="Logo"
//                         width={200}
//                         height={80}
//                         className=""
//                         onContextMenu={(e) => e.preventDefault()}
//                         onDragStart={(e) => e.preventDefault()}
//                     />
//                 </a>
//                 <div className="z-50 text-md md:text-xl leading-relaxed space-y-4 opacity-90 text-left max-w-lg mx-auto px-4 sm:px-6">
//                     <h1 className="z-50 text-4xl font-Hunters md:text-5xl font-semibold mb-6 text-shadow-lg text-center">
//                     Oops, Not Registered Yet!
//                     </h1>
//                     <div className="p-2 font-Trap-Regular">
//                         <p className="mb-4 text-md">
//                             <strong>Oops, it seems like you're not registered yet!</strong><br />
//                             In order to access all the features of Capture Incridea, you need to register first.
//                         </p>

//                         <p className="mb-4">
//                             &#x2022; If you have an account, please log in with the email you registered.
//                         </p>

//                         <p className="mb-4">
//                             &#x2022; If you haven’t registered yet, please visit{" "}
//                             <strong>
//                                 <a href="https://incridea.in" className="text-white hover:text-blue-700">
//                                     incridea.in
//                                 </a>
//                             </strong>
//                             to create an account and join our community.
//                         </p>

//                         <p className="font-semibold text-white text-sm">
//                             This platform is exclusively for Registered Students & Faculty only.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Register Button */}
//                 <button
//                     onClick={() => window.location.href = "https://incridea.in"} // Redirecting to the registration page
//                     className="font-Trap-Regular z-50 px-6 py-3 my-5 text-lg font-bold text-white bg-gradient-to-r from-red-400 via-pink-500 to-red-600 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 max-w-xs mx-auto"
//                 >
//                     Register Now
//                 </button>

//                 {/* Footer */}
//                 <p className="z-50 font-Trap-Regular text-xs text-center">
//                     If you encounter any issues, <br /> Please feel free to reach out to us at{" "}
//                     <a href="mailto:capture.incridea@nmamit.in" className="text-white">
//                         capture.incridea@nmamit.in
//                     </a>
//                 </p>
//             </div>
//         </ImageGrid>
//     );
// };

// export default Test;



