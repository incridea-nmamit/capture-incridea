import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import Head from 'next/head';  // Import Head from next/head

import "~/styles/globals.css";
import Header from "~/components/HeaderFooter/Header";
import Footer from "~/components/HeaderFooter/Footer";
import TrackPageVisits from "~/components/TrackPageVisits";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Capture Incridea</title> {/* Set a title for the homepage */}
        <meta name="description" content="Capture Incridea: Get your event photos and story-worthy moments." />
        <link rel="icon" href="/images/favicon/favicon.ico" /> {/* Favicon path */}
        {/* Open Graph Tags */}
        <meta property="og:title" content="Capture Incridea" />
        <meta property="og:description" content="Get your event photos and story-worthy moments. Experience them the same day!" />
        <meta property="og:image" content="/images/img-3.png" />
        <meta property="og:url" content="https://captures.incridea.in" />
        {/* You can add more meta tags here if needed */}
      </Head>
      <div className="flex flex-col min-h-screen font-roboto"> {/* Use Flexbox to structure the layout */}
        <Header />
        <main className="flex-grow bg-black text-white"> {/* Allow the main content to grow */}
          <TrackPageVisits />
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
