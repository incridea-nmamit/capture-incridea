import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import Head from "next/head";

import "~/styles/globals.css";
import Header from "~/components/HeaderFooter/Header";
import Footer from "~/components/HeaderFooter/Footer";
import TrackPageVisits from "~/components/TrackPageVisits";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import { Toaster } from "react-hot-toast";
import { ScrollArea } from "~/components/ui/scroll-area";
import LoginComponent from "./LoginComponent";
import NotRegistered from "./NotRegistered";
import KeyboardShortcut from "~/components/Shortcuts";
import IntroAnimation from "./Intro";
import { usePathname } from "next/navigation";
import FluidAnimation from "./../components/fluidAnimtion/FluidAnimation";

const useRouteLoading = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  return loading;
};

const AuthenticatedApp = ({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) => {
  const loading = useRouteLoading();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: verifiedEmailData, isLoading: isVerifiedEmailLoading } =
    api.verifiedEmail.getEmail.useQuery();

  if (sessionStatus === "loading" || isVerifiedEmailLoading)
    return <CameraLoading />;

  // if (!sessionData) return <LoginComponent />;

  const isEmailVerified =
    verifiedEmailData?.some(
      (emailEntry: { email: string }) =>
        emailEntry.email === sessionData?.user?.email,
    ) ||
    sessionData?.user?.email?.endsWith("nitte.edu.in") ||
    sessionData?.user?.role === "admin";

  // if (!isEmailVerified) return <NotRegistered />;

  const excludedRoute = ["/LoginComponent", "/NotRegistered"];
  const pathname = usePathname();
  const isExcluded = excludedRoute.some((route) => pathname.startsWith(route));
  if (isExcluded) {
    return <>{loading ? <CameraLoading /> : <Component {...pageProps} />} </>;
  } else {
    return (
      <ScrollArea className="font-roboto flex h-screen min-h-screen w-full flex-1 flex-col">
        <div className="font-roboto flex min-h-screen flex-col">
          <FluidAnimation />
          <Header />
          <main className="flex-grow">
            <Toaster position="top-right" reverseOrder={false} />
            <TrackPageVisits />
            {loading ? <CameraLoading /> : <Component {...pageProps} />}
          </main>
          {/*<Footer />*/}
        </div>
      </ScrollArea>
    );
  }
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [showIntro, setShowIntro] = useState(true); // Initially, show intro animation

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro === "true") {
      setShowIntro(false); // Skip intro if it's already seen
    }
  }, []);

  const handleIntroAnimationComplete = () => {
    setShowIntro(false); // Once the intro completes, show the main app
    sessionStorage.setItem("hasSeenIntro", "true"); // Store that intro has been seen
  };

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Capture Incridea</title>
        <meta
          name="description"
          content="Capture Incridea: Get your event photos and story-worthy moments."
        />
        <link
          rel="icon"
          href="https://utfs.io/f/0yks13NtToBia9tXha8GMCjeJVFKURvyq263Lgw98YaAfWdx"
        />
        <meta property="og:title" content="Capture Incridea" />
        <meta
          property="og:description"
          content="Get your event photos and story-worthy moments. Experience them the same day!"
        />
        <meta property="og:url" content="https://captures.incridea.in" />
      </Head>
      <KeyboardShortcut />
      {showIntro ? (
        <IntroAnimation onAnimationComplete={handleIntroAnimationComplete} />
      ) : (
        <AuthenticatedApp Component={Component} pageProps={pageProps} />
      )}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
