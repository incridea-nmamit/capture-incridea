import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

export const TimeLine = () => {

    const years = [{
        title: 2022,
        content: "Started working on Capture Incridea"
    }, {
        title: 2023,
        content: "Started working on Capture Incridea"
    }, {
        title: 2024,
        content: "Started working on Capture Incridea"
    }]

    const containerRef = useRef<HTMLDivElement>(null);
    const timelineHighlightRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 20%",
                end: "bottom 50%",
                scrub: true
            },
        })

        tl.fromTo(timelineHighlightRef.current, {
            height: 0
        }, {
            height: '100%',
        })
    })

    return (
        <section className='container-size mx-auto mt-20 my-20'>
            <h3 className="mb-16 w-full font-Teknaf text-5xl md:text-6xl lg:text-6xl text-center">Explore the past memory</h3>
            <div className='grid gap-8 relative'
                style={{
                    gridTemplateColumns: "20% auto"
                }}

                ref={containerRef}
            >
                {years.map(year => {

                    return <>
                        <div className='w-full h-full'>
                            <div className='flex gap-2 items-center sticky top-1/2'>
                                <div className='w-4 h-4 border-4 border-gray-600 bg-black rounded-full'></div><span>{year.title}</span>
                            </div>
                        </div>

                        <div>
                            <div className='w-full h-full overflow-hidden max-h-[80vh]'>
                                <div className='columns-2 '>
                                    <img src="https://placehold.co/600x400" alt="" className='m-2' />
                                    <img src="https://placehold.co/600x600" alt="" className='m-2' />
                                    <img src="https://placehold.co/600x600" alt="" className='m-2' />
                                    <img src="https://placehold.co/600x400" alt="" className='m-2' />
                                </div>
                            </div>
                        </div>
                    </>
                })}

                <div className='absolute top-0 timeline-highlight  -z-10 w-1 left-[6px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full' ref={timelineHighlightRef}>
                </div>
            </div>
        </section>
    );
};


export default TimeLine