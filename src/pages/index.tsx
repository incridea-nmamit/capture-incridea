// pages/index.tsx
import Head from "next/head";
import Hero from "~/components/Landing/Hero";
export default function Home() {

  return (
    <>
      <Head>
        <title>Capture Incridea</title>
      </Head>
        <>
          <Hero />
          {/* You can include additional sections here, like the Reel or Experience sections */}
        </>
    </>
  );
}