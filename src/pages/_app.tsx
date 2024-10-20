import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { GeistSans } from "@geist-ui/react"; // Ensure this import is correct
import { api } from "~/utils/api";

import "~/styles/globals.css";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  console.log(GeistSans); // Inspect the object to see its structure

  return (
    <SessionProvider session={session}>
      <div className={GeistSans?.className || "font-sans"}> {/* Use a fallback class */}
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
