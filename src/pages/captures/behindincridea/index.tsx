import React from 'react'

const behindincridea = () => {
  return (
    <div className="relative w-full h-[50vh] md:h-[55vh] bg-cover bg-center" 
      style={{ backgroundImage: "url('/images/admin-bg.png')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-65 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-Hunters md:text-7xl text-white text-center">Behind Incridea</h1>
        <p className="mt-2 text-base md:text-lg text-gray-300 max-w-2xl text-center">
          Engaging our audience and building community through strategic social media initiatives.
        </p>
      </div>
    </div>
  )
}

export default behindincridea
