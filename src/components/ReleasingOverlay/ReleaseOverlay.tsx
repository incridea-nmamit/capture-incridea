"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Spline from "@splinetool/react-spline"
import { Sparkles } from "lucide-react"

interface ReleaseOverlayProps {
  releaseDate: string
  onRelease: () => void
}

const ReleaseOverlay: React.FC<ReleaseOverlayProps> = ({ releaseDate, onRelease }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft(releaseDate)
      setTimeLeft(newTimeLeft)
      if (newTimeLeft <= 0) {
        clearInterval(interval)
        onRelease()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [releaseDate, onRelease])

  function getTimeLeft(releaseDate: string): number {
    const now = new Date()
    const releaseDateTime = new Date(releaseDate)

    if (isNaN(releaseDateTime.getTime())) {
      console.error("Invalid release date:", releaseDate)
      return 0
    }

    const distance = releaseDateTime.getTime() - now.getTime()
    return distance > 0 ? distance : 0
  }

  const formatTimeLeft = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds }
  }

  const formatTwoDigits = (num: number) => String(num).padStart(2, "0")

  if (!isMounted) {
    return null
  }

  const timeDisplay = timeLeft !== null ? formatTimeLeft(timeLeft) : { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Spline scene="https://draft.spline.design/7UcOBlblhk99F78R/scene.splinecode" />
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 p-4 sm:p-6 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 w-full max-w-4xl"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold font-cursive tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            >
              Captures
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 sm:mb-8 w-full text-center text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-white"
            >
              <span className="font-bold text-purple-300">
                Capture Incridea is your ultimate hub for experiencing the vibrant energy of Incridea!
              </span>
              <br />
              <br />
              All the exciting captures from various events and activities happening throughout the day, in your hands
              on the same day.
              <br />
              Immerse yourself in the spirit of our college community as we celebrate the unforgettable moments that
              make Incridea truly special!
            </motion.p>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              {["Days", "Hours", "Minutes", "Seconds"].map((label, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-28 md:w-32 lg:w-36"
                >
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                    {formatTwoDigits(timeDisplay[label.toLowerCase() as keyof typeof timeDisplay])}
                  </span>
                  <div className="text-xs sm:text-sm md:text-base font-semibold mt-1">{label}</div>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-purple-200 flex items-center justify-center"
            >
              <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Hold tight while we sift through today's moments to bring you pure captures like never before!
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ReleaseOverlay
