import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { RefreshCcw } from 'lucide-react';
const images = [
    { src: "https://utfs.io/f/0yks13NtToBiyMGDp5dKMt25jkdFfWpIvLESBusza14COqm3" },
    { src: "https://utfs.io/f/0yks13NtToBiRytYFqGmqjGOIgx47y3cAJSCbQ1V82Nitrsf" },
    { src: "https://utfs.io/f/0yks13NtToBi6HmZQ4hUy9ofa2RpzAV7ldXGwM4xgSure8sE" },
    { src: "https://utfs.io/f/0yks13NtToBiJ9b4q7w4BLygFdW15xChAKiDEleRHcja6tkI" },
    { src: "https://utfs.io/f/0yks13NtToBipWkLivmnEQxj9Ckq6tA4uGeavWLzMV5woYHP" },
    { src: "https://utfs.io/f/0yks13NtToBidkGYwLhfcvGemo1qIhyiPK56u3ZrnLzJUQRW" },
    { src: "https://utfs.io/f/0yks13NtToBiWfMRyqVYXTQy1FZeNvkVStrj2lsMHdq5GfK4" },
];

function Images() {
    const repeatDelay = 1;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: repeatDelay, yoyo: true,onReverseComplete: () => {
        tl.repeatDelay(repeatDelay);
        tl.play()
    }})

    useGSAP(() => {
        tl.fromTo(".slide-image", {
            y: "100vh",
        }, {
            y: 0,
            duration:1,
            stagger: {
                each: 0.1,
                from: 'center',
                grid: 'auto',
                ease: 'power2.inOut',
                onStart: updateImage,
            }
        })

        tl.play()
    },[])

    function updateImage() {
        const imageElements = document.querySelectorAll(".slide-image");
        imageElements.forEach((element) => {
            element.setAttribute('src', images[Math.floor(Math.random()*images.length)]!.src)
        })
    }

    return (
        <section className=" h-fit relative text-center space-y-8 overflow-hidden flex flex-col items-center">
            <h3 className='mb-12 w-3/4 font-Teknaf text-3xl md:text-4xl lg:text-5xl text-center'>We cherish the memory what we see , so y not make it available to all</h3>
            <div className="flex overflow-hidden w-full items-center justify-center gap-6">
                <img src="https://placehold.co/400x600" alt="" className="slide-image w-[50%] h-full object-cover rounded-lg"  />
                <img src="https://placehold.co/400x600" alt="" className="slide-image w-[50%] rounded-lg " />
                <img src="https://placehold.co/400x600" alt="" className="slide-image w-[50%] rounded-lg" />
            </div>
            <button
                className="absolute h-24 aspect-square top-20 right-1/3 rounded-full cursor-pointer text-white p-2 md:p-6  z-10 border-2 hover:rotate-[24deg] transition backdrop-blur-sm bg-white/30 grid place-content-center"
                onClick={() => {
                    if(!tl.reversed()){
                        tl.repeatDelay(0)
                        tl.reverse()
                    }
                }}
            >
                <RefreshCcw size={36} className='w-full'  strokeWidth={2}/>
            </button>
            <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-primary-950 from-10% via-primary-950 via-20% to-transparent to-90% "></div>
        </section>
    )
}

export default Images