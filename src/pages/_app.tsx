import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
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
import { usePathname } from "next/navigation";
import Footer from "~/components/HeaderFooter/Footer";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Script from "next/script";
import dynamic from "next/dynamic";
import SEO from "~/components/SEO";
import GlobeLoader from '~/components/LoadingAnimation/GlobeLoader'


const items = [
  {
    image: 'https://picsum.photos/300/300',
  },
  {
    image: 'https://picsum.photos/400/400',
  },
  {
    image: 'https://picsum.photos/500/500',
  },
  {
    image: 'https://picsum.photos/600/600',
  }
];


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
  
  const [verifiedEmailData, setVerifiedEmailData] = useState<{ email: string }[] | null>(null);
  const { data: fetchedEmailData, isLoading: isVerifiedEmailLoading } =
    api.verifiedEmail.getEmail.useQuery(undefined, {
      enabled: !verifiedEmailData, // Run only if data is null
    });

  useEffect(() => {
    if (fetchedEmailData && !verifiedEmailData) {
      setVerifiedEmailData(fetchedEmailData); // Store the verified email data once
    }
  }, [fetchedEmailData, verifiedEmailData]);

  const [showIntro,setShowIntro]  = useState(true);

  useEffect(()=>{
    const interval = setInterval(()=>{
      if (sessionStatus === "loading" || (isVerifiedEmailLoading && !verifiedEmailData)){
        setShowIntro(false)
        clearInterval(interval)
      }
    },6000)
  },[])

  if(showIntro) return <GlobeLoader items={items}/>;

  if (!sessionData) return <LoginComponent />;

  const isEmailVerified =
    verifiedEmailData?.some(
      (emailEntry) => emailEntry.email === sessionData?.user?.email
    ) ||
    sessionData?.user?.email?.endsWith("nitte.edu.in") ||
    sessionData?.user?.role === "admin";

  if (!isEmailVerified) return <NotRegistered />;

  const excludedRoute = ["/LoginComponent", "/NotRegistered", "/"];
  const pathname = usePathname();
  const isExcluded = excludedRoute.some((route) => pathname.startsWith(route));
  const queryClient = new QueryClient();
  const isCapturesPath = pathname === "/captures";
  if (isExcluded) {
    return (
      <ScrollArea className="font-description flex h-screen min-h-screen w-full flex-1 flex-col" id="main-scroller">
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
        <ScrollArea className="font-roboto flex h-screen min-h-screen w-full flex-1 flex-col" id="main-scroller"> 
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
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-QRVG032QD4"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QRVG032QD4', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <AuthenticatedApp Component={Component} pageProps={pageProps} />

    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
