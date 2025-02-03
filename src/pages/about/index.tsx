import React from 'react'
import dynamic from "next/dynamic";
import Image from 'next/image';
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const About = () => {

  const cards = [{
    name: "team1",
    image: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR"
  }, {
    name: "team1",
    image: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR"
  }, {
    name: "team1",
    image: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR"
  }, {
    name: "team1",
    image: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR"
  }, {
    name: "team1",
    image: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR"
  }, {
    name: "team1",
    image: "https://utfs.io/f/0yks13NtToBiLV71kwYmgsTC1Ne2Iapcmz9LhH4YD6ZQuJVR"
  },]
  return (
    <>
      <main className='container-size text-center my-20 space-y-24 lg:py-24 md:py-16 py-8 font-Trap-Regular'>
        <section>
          <Image src="/images/Logo/nitteLogoWhite.webp" width={800} height={300} alt="nmamit logo" className='mx-auto px-4 my-14' />

          <p className=' max-w-4xl mx-auto'> Nitte Mahalinga Adyantaya Memorial Institute of Technology
            (NMAMIT), Nitte, established in 1986 and recognized by the
            All-India Council for Technical Education, New Delhi, has been a
            constituent college of Nitte (Deemed to be University), Mangaluru,
            since June 2022. NMAMIT is placed in the Rank band 101-150 in the
            National Institutional Ranking Framework (NIRF) 2023 by the
            Ministry of Education, Government of India. NMAMIT, the off-campus
            centre of Nitte DU located at Nitte Village, has active
            collaborations with several international universities and
            organizations for faculty and student exchanges, research,
            internships and placements.
            <br />
            <br />
            The Institute offers UG engineering program in fifteen
            disciplines, PG program M.Tech. in seven disciplines & MCA
            program. All the departments have qualified research guides for
            students interested in taking up research work leading to Ph.D.
            For details, visit{" "}
            <a
              href="https://nitte.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              nitte.edu.in
            </a></p>
        </section>


        <section className='grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4  font-Trap-Regular'>
          <div className='p-6 border-white'>
            <Image src="/images/Logo/inc-abt.webp" width={600} height={500} alt="capture logo" className='mx-auto h-32  w-full ' />
          </div>
          <div className='space-y-4 max-w-xl'>
            <p>Incridea is a colossal national-level techno-cultural fest with an audience pool spread among 200 colleges all across India.
              The fest holds the values abbreviated in the name, i.e.
              Innovate, Create and Ideate at the highest standard possible by becoming a symbol of technology, passion, culture and
              conviction among students. Incridea is conducted with the help of
              many services and technology created and operated by students, making it one of the most indigenous college fests with resources
              and capabilities beyond expectations.
            </p>
            <p>Pronites of Incridea has seen a wide range of popular and talented artists, DJs, and bands. The fest constitutes over
              40+ events and expected footfall of around 45,000, making it one of
              the most happening fests in the region. With grand successes over the years and
              a flair for perfection, we intend to make Incridea '24 and grand success and the best one so far.</p>
          </div>
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4'>
          <div className='p-6 border-white lg:order-last'>
            <Image src="/images/Logo/capture.webp" width={800} height={300} alt="capture logo" className='mx-auto max-h-44 max-w-96 w-full h-24' />
          </div>
          <div className=' space-y-4 max-w-xl  font-Trap-Regular'>
            <p>Capture Incridea is the official digital platform curated by the Media-Social Media Team 
              of Incridea, the fabulous techno-cultural fest of NMAM Institute of Technology, Nitte. 
              It serves as a repository of thoughtfully captured moments, showcasing the essence of the
               fest through its stunning captures & engaging stories.</p>

            <p>Capture Incridea features a diverse collection of visuals documenting events, programs,
               participants, and audience interactions, providing a glimpse of the vibrant & dynamic spirit of Incridea.
               Capture Incridea aims to preserve and celebrate the fest's most memorable experiences in a artistic manner</p>
          </div>
        </section>

        {/* Video Section */}
        <section className='relative h-[512px] max-h-screen w-full overflow-hidden shrink-0'>
          <div className="w-full h-full items-center md:h-screen lg:h-screen xl:h-screen md:min-h-[396px] md:max-h-[525px] lg:min-h-[620px] lg:max-h-[640px] xl:min-h-[720px] xl:max-h-[780px] 2xl:h-[800px] flex justify-stretch ">
            <ReactPlayer
              url="https://vimeo.com/883551016?share=copy"
              playing
              loop
              muted
              controls={false}
              width="100%"
              height="100%"
            />
          </div>
        </section>

        <section>
          <h5 className='font-Teknaf text-5xl mb-16'>Team Incridea'24</h5>
          <div className='flex flex-wrap gap-4 justify-center'>
            {
              cards.map(card => (<div key={card.name} className='h-44 aspect-video rounded-lg overflow-hidden relative hover:border-blue-600 hover:border-2'>

                <Image src={card.image} width={800} height={300} alt="capture logo" className='mx-auto w-full h-full object-cover' />

                <div className='absolute inset-0 hover:bg-black/55 transition-all grid place-content-center group/card'>
                  <span className='group-hover/card:translate-y-0 translate-y-10 transition-all opacity-0 group-hover/card:opacity-100' >
                    {card.name}
                  </span>
                </div>
              </div>))
            }
          </div>
        </section>
      </main>
    </>
  )
}

export default About
