import React from 'react'
import Button from './Button'

function About() {
    return (
        <section className="container-size mx-auto flex flex-col items-center justify-center text-center h-screen gap-8">
            <h3 className='mb-8 w-full font-ClubHouse text-5xl md:text-6xl lg:text-7xl text-center'>We capture what u see....</h3>

            <p className="max-w-2xl font-Trap-Regular">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has b
                een the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley o
                f type and scrambled it to make a type specimen book. It has survived not only five centuries, but a
                lso the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset sheets containing Lorem Ipsum passages, and more re
                cently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                About capture incredia
            </p>

            <Button>
                let's capture incredia
            </Button>
        </section>
    )
}

export default About