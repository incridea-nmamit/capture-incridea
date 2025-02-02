import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import { fonts } from "~/fonts";
import "~/styles/globals.css";
import "~/styles/embla.css";
import Header from "~/components/HeaderFooter/Header";
import TrackPageVisits from "~/components/TrackPageVisits";
import CameraLoading from "~/components/LoadingAnimation/CameraLoading";
import { Toaster } from "react-hot-toast";
import { ScrollArea } from "~/components/ui/scroll-area";
import LoginComponent from "./LoginComponent";
import NotRegistered from "./NotRegistered";
import KeyboardShortcut from "~/components/Shortcuts";
import IntroAnimation from "./Intro";
import { usePathname } from "next/navigation";
import SEO from "~/components/SEO";
import Footer from "~/components/HeaderFooter/Footer";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  const pathname = usePathname();

  // Define unrestricted routes
  const unrestrictedRoutes = ["/privacy-policy", "/terms-and-conditions", "/contact"];

  // Allow access to public routes without authentication
  if (unrestrictedRoutes.includes(pathname)) {
    return (
      <ScrollArea className="font-description flex h-screen min-h-screen w-full flex-1 flex-col">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">
            <Toaster position="top-right" reverseOrder={false} />
            <TrackPageVisits />
            {loading ? <CameraLoading /> : <Component {...pageProps} />}
          </main>
          <Footer />
        </div>
      </ScrollArea>
    );
  }

  // Normal authentication check for other routes
  if (sessionStatus === "loading" || isVerifiedEmailLoading) return <CameraLoading />;
  if (!sessionData) return <LoginComponent />;

  const isEmailVerified =
    verifiedEmailData?.some(
      (emailEntry: { email: string }) =>
        emailEntry.email === sessionData?.user?.email,
    ) ||
    sessionData?.user?.email?.endsWith("nitte.edu.in") ||
    sessionData?.user?.role === "admin";

  if (!isEmailVerified) return <NotRegistered />;

  // Define excluded routes
  const excludedRoutes = ["/LoginComponent", "/NotRegistered", "/"];
  const isExcluded = excludedRoutes.some((route) => pathname.startsWith(route));
  const isCapturesPath = pathname === "/captures";
  const queryClient = new QueryClient();

  if (isExcluded) {
    return (
      <ScrollArea className="font-description flex h-screen min-h-screen w-full flex-1 flex-col">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">
            <Toaster position="top-right" reverseOrder={false} />
            <TrackPageVisits />
            {loading ? <CameraLoading /> : <Component {...pageProps} />}
          </main>
          {!isCapturesPath && <Footer />}
        </div>
      </ScrollArea>
    );
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <ScrollArea className="font-roboto flex h-screen min-h-screen w-full flex-1 flex-col">
          <div className="font-roboto flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
              <Toaster position="top-right" reverseOrder={false} />
              <TrackPageVisits />
              {loading ? <CameraLoading /> : <Component {...pageProps} />}
            </main>
          </div>
        </ScrollArea>
      </QueryClientProvider>
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
      <SEO/>
      <KeyboardShortcut />
      {/* {showIntro ? (
        <IntroAnimation onAnimationComplete={handleIntroAnimationComplete} />
      ) : (
        <AuthenticatedApp Component={Component} pageProps={pageProps} />
      )} */}
      <AuthenticatedApp Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
