"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LandingPageProps {
  setCurrentPage: (page: string) => void
}

export default function LandingPage({ setCurrentPage }: LandingPageProps) {
  const handleSignInWithUsername = () => {
    setCurrentPage("login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#9ad4ff] to-[#8feeff] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Image src="/rumates-logo-white.png" alt="Rumates" width={120} height={32} className="h-12 w-auto mx-auto" />
        </div>

        <div className="space-y-4">
          <Button
        className="w-full bg-clear text-white py-6 text-base font-medium rounded-full hover:bg-gray-50 hover:text-[#9ad4ff] shadow-lg border-2 border-white"

          >
            SIGN IN WITH APPLE
          </Button>

          <Button
            onClick={handleSignInWithUsername}
          className="w-full bg-clear text-white py-6 text-base font-medium rounded-full hover:bg-gray-50 hover:text-[#9ad4ff] shadow-lg border-2 border-white"

          >
            SIGN IN WITH USERNAME
          </Button>
        </div>

        <div className="text-center">
          <button className="text-white underline text-sm font-normal hover:text-gray-200">Trouble signing in?</button>
        </div>
      </div>
    </div>
  )
}
