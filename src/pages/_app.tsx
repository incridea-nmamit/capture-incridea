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
    image: '/images/general/s1.webp',
  },
  {
    image: '/images/general/s12.webp',
  },
  {
    image: '/images/general/s11.webp',
  },
  {
    image: '/images/general/s10.webp',
  },
  {
    image: '/images/general/s7.webp',
  },
  {
    image: '/images/general/s9.webp',
  },
  {
    image: '/images/general/s8.webp',
  },
  {
    image: '/images/general/s5.webp',
  },
  {
    image: '/images/general/s6.webp',
  },
  {
    image: '/images/general/s2.webp',
  },
  {
    image: '/images/general/s4.webp',
  },
  {
    image: '/images/general/s3.webp',
  },
  {
    image: '/images/general/s13.webp',
  },
  {
    image: '/images/general/s14.webp',
  },
  {
    image: '/images/general/s15.webp',
  },
  {
    image: '/images/general/s16.webp',
  },
  {
    image: '/images/general/s17.webp',
  },
  {
    image: '/images/general/s18.webp',
  },
  {
    image: '/images/general/s19.webp',
  },
  {
    image: '/images/general/s20.webp',
  },
  {
    image: '/images/general/s21.webp',
  },
  {
    image: '/images/general/s22.webp',
  },
  {
    image: '/images/general/s23.webp',
  },
  {
    image: '/images/general/s24.webp',
  },
  {
    image: '/images/general/s25.webp',
  },
  {
    image: '/images/general/s26.webp',
  },
  {
    image: '/images/general/s27.webp',
  },
  {
    image: '/images/general/s28.webp',
  },
  {
    image: '/images/general/s29.webp',
  },
  {
    image: '/images/general/s30.webp',
  },
  {
    image: '/images/general/s31.webp',
  },
  {
    image: '/images/general/s32.webp',
  },
  {
    image: '/images/general/s33.webp',
  },
  {
    image: '/images/general/s34.webp',
  },
  {
    image: '/images/general/s35.webp',
  },
  {
    image: '/images/general/s36.webp',
  },
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
  const [showIntro, setShowIntro] = useState(true);
  
  const [verifiedEmailData, setVerifiedEmailData] = useState<{ email: string }[] | null>(null);
  const { data: fetchedEmailData, isLoading: isVerifiedEmailLoading } =
    api.verifiedEmail.getEmail.useQuery(undefined, {
      enabled: sessionStatus === "authenticated", // Only run when session is available
    });

  useEffect(() => {
    if (fetchedEmailData && !verifiedEmailData) {
      setVerifiedEmailData(fetchedEmailData);
    }
  }, [fetchedEmailData, verifiedEmailData]);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro === "true") {
      setShowIntro(false);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("hasSeenIntro", "true");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Show loading state while checking session or email verification
  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && isVerifiedEmailLoading)) {
    return <CameraLoading />;
  }

  if (showIntro) return <GlobeLoader items={items} />;

  if (sessionStatus === "unauthenticated") return <LoginComponent />;

  const isEmailVerified =
    verifiedEmailData?.some(
      (emailEntry) => emailEntry.email.toLowerCase() === sessionData?.user?.email?.toLowerCase()
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
