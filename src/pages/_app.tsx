// pages/_app.tsx
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import Head from 'next/head';

import "~/styles/globals.css";
import Header from "~/components/HeaderFooter/Header";
import Footer from "~/components/HeaderFooter/Footer";
import TrackPageVisits from "~/components/TrackPageVisits";
import CameraLoading from "~/components/CameraLoading";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Capture Incridea</title>
        <meta name="description" content="Capture Incridea: Get your event photos and story-worthy moments." />
        <link rel="icon" href="/images/favicon/favicon.ico" />
        <meta property="og:title" content="Capture Incridea" />
        <meta property="og:description" content="Get your event photos and story-worthy moments. Experience them the same day!" />
        <meta property="og:image" content="/images/img-3.png" />
        <meta property="og:url" content="https://captures.incridea.in" />
      </Head>
      <div className="flex flex-col min-h-screen font-roboto">        
        <Header />        
        <main className="flex-grow bg-black text-white">
          <div>
            <Toaster position="top-right"
            reverseOrder={false}
            />
          </div>
          <TrackPageVisits />
          {loading ? (
            <CameraLoading /> // Show loading animation
          ) : (
            <Component {...pageProps} />
          )}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
