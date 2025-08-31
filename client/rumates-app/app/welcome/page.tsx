"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface WelcomePageProps {
  setCurrentPage: (page: string) => void
}

export default function WelcomePage({ setCurrentPage }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-normal text-[#68a4ca] mb-8">
            Welcome to
          </h2>
          <div className="mb-8 flex justify-start">
            <Image
              src="/rumates-welcome-text-transparent.png"
              alt="rumates"
              width={200}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="text-left space-y-4 text-sm font-normal leading-relaxed text-gray-500">
            <p>
              <strong>Now it's time to:</strong>
            </p>
            <p>
              <strong>Find your people:</strong> swipe and connect with groups or individuals looking for roommates.
            </p>
            <p>
              <strong>Find your place:</strong> set your preferences and explore listings that match your lifestyle.
            </p>
            <p>
              <strong>Move in with confidence:</strong> apply as one household when you're ready.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setCurrentPage("swiping")}
          className="w-full bg-sky-400 text-white py-6 text-base font-medium rounded-full hover:bg-sky-500 shadow-lg"
        >
          FIND MY RUMATES
        </Button>
      </div>
    </div>
  )
}
