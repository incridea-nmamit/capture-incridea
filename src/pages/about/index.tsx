/**
 * About Page Component
 * Displays information about NMAMIT, Incridea, and Capture Incridea
 */

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import SEO from "~/components/SEO/index";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

/**
 * About component
 * Renders three main sections: NMAMIT, Incridea, and Capture Incridea
 */
const About = () => {
  return (
    <>
      <SEO
        title="About | Capture Incridea"
        description="Learn about NMAMIT, Incridea, and Capture Incridea - the official digital gallery platform showcasing the vibrant moments of the annual techno-cultural fest."
        url="https://capture.incridea.in/about"
      />
      {/* Main content container */}
      <main className="container-size my-20 space-y-24 py-8 text-center font-Trap-Regular md:py-16 lg:py-24">
        {/* NMAMIT Section */}
        <section>
          <Image
            src="/images/Logo/nitteLogoWhite.webp"
            width={800}
            height={300}
            alt="nmamit logo"
            className="mx-auto my-14 px-4"
          />

          <p className="mx-auto max-w-4xl">
            {" "}
            Nitte Mahalinga Adyantaya Memorial Institute of Technology (NMAMIT),
            Nitte, established in 1986 and recognized by the All-India Council
            for Technical Education, New Delhi, has been a constituent college
            of Nitte (Deemed to be University), Mangaluru, since June 2022.
            NMAMIT is placed in the Rank band 101-150 in the National
            Institutional Ranking Framework (NIRF) 2023 by the Ministry of
            Education, Government of India. NMAMIT, the off-campus centre of
            Nitte DU located at Nitte Village, has active collaborations with
            several international universities and organizations for faculty and
            student exchanges, research, internships and placements.
            <br />
            <br />
            The Institute offers UG engineering program in fifteen disciplines,
            PG program M.Tech. in seven disciplines & MCA program. All the
            departments have qualified research guides for students interested
            in taking up research work leading to Ph.D. For details, visit{" "}
            <a
              href="https://nitte.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              nitte.edu.in
            </a>
          </p>
        </section>

        {/* Incridea Section */}
        <section className="grid grid-cols-1 place-items-center gap-4 font-Trap-Regular lg:grid-cols-2">
          <div className="border-white p-6">
            <Image
              src="/images/Logo/inc-abt.webp"
              width={600}
              height={500}
              alt="capture logo"
              className="mx-auto h-32 w-full"
            />
          </div>
          <div className="max-w-xl space-y-4">
            <p>
              Incridea is a colossal national-level techno-cultural fest with an
              audience pool spread among 200 colleges all across India. The fest
              holds the values abbreviated in the name, i.e. Innovate, Create
              and Ideate at the highest standard possible by becoming a symbol
              of technology, passion, culture and conviction among students.
              Incridea is conducted with the help of many services and
              technology created and operated by students, making it one of the
              most indigenous college fests with resources and capabilities
              beyond expectations.
            </p>
            <p>
              Pronites of Incridea has seen a wide range of popular and talented
              artists, DJs, and bands. The fest constitutes over 40+ events and
              expected footfall of around 45,000, making it one of the most
              happening fests in the region. With grand successes over the years
              and a flair for perfection, we intend to make Incridea '25 and
              grand success and the best one so far.
            </p>
          </div>
        </section>

        {/* Capture Incridea Section */}
        <section className="grid grid-cols-1 place-items-center gap-4 lg:grid-cols-2">
          <div className="border-white p-6 lg:order-last">
            <Image
              src="/images/Logo/capture.webp"
              width={800}
              height={300}
              alt="capture logo"
              className="mx-auto h-24 max-h-44 w-full max-w-96"
            />
          </div>
          <div className="max-w-xl space-y-4 font-Trap-Regular">
            <p>
              Capture Incridea is the official digital platform curated by the
              Media-Social Media Team of Incridea, the fabulous techno-cultural
              fest of NMAM Institute of Technology, Nitte. It serves as a
              repository of thoughtfully captured moments, showcasing the
              essence of the fest through its stunning captures & engaging
              stories.
            </p>

            <p>
              Capture Incridea features a diverse collection of visuals
              documenting events, programs, participants, and audience
              interactions, providing a glimpse of the vibrant & dynamic spirit
              of Incridea. Capture Incridea aims to preserve and celebrate the
              fest's most memorable experiences in a artistic manner
            </p>
          </div>
        </section>


        <section>
          <FeedbackForm />
        </section>
      </main>
    </>
  );
};

export default About;

import { api } from "~/utils/api";
import { MessagesSquare } from "lucide-react";
const FeedbackForm = () => {
  const { data: session } = useSession();
  const session_user = session?.user.email?.toLowerCase() || "";
  const router = useRouter();

  const [comment, setComment] = useState<string>();
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const feedbackMutation = api.feedback.createFeedback.useMutation();

  const moods = [
    { label: "Very Bad", emoji: "😱", value: 1 },
    { label: "Bad", emoji: "😔", value: 2 },
    { label: "Medium", emoji: "😐", value: 3 },
    { label: "Good", emoji: "🙂", value: 4 },
    { label: "Very Good", emoji: "🥳", value: 5 },
  ];

  const handleSubmit = async () => {
    if (rating == null) {
      toast.error("please select rating")
      return
    }
    setSending(true);

    try {
      await feedbackMutation.mutateAsync({
        rating: rating,
        description: comment,
      })
      toast.success("Feedback submitted successfully");
    } catch (error) {
      toast.error("Error submitting feedback");
    }
    setSending(false);
  };

  return (
    <div className="max-w-md mx-auto  p-6 rounded-2xl gradient-bg border shadow-lg shadow-gray-700/20">
      <h2 className="text-2xl font-semibold  text-left flex items-center justify-start gap-2"><MessagesSquare className="text-lg"/>Feedback</h2>
      <hr className="my-4" />
      <h3 className="text-lg font-medium my-6">How are you feeling?</h3>
      <p className="text-sm text-gray-400 mb-12">
        Your input is valuable in helping us better understand your needs and tailor our service accordingly.
      </p>

      <div className="flex justify-center gap-4 my-8">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => setRating(mood.value)}
            className={`text-3xl p-2 transition-all duration-300 rounded-full ${rating === mood.value ? "bg-green-200 scale-150" : "hover:bg-gray-100 grayscale hover:grayscale-0"
              }`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>

      {rating && (<p className="text-center mt-3 font-medium  text-gray-900 mb-8 py-1 px-4 rounded-full bg-white/90 w-fit mx-auto">{moods.filter(mood => mood.value === rating)[0]?.label}</p>)}

      <textarea
        className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-transparent"
        rows={5}
        placeholder="Add a Comment..."
        value={comment ?? ""}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={sending}
        className="w-full mt-4 bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
      >
        {sending ? <>
          <svg className="mr-3 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
            </circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Submitting...
        </> : "Submit Now"}
      </button>
    </div>
  );
};
