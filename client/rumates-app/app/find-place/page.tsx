"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

interface FindPlacePageProps {
  setCurrentPage: (page: string) => void
}

export default function FindPlacePage({ setCurrentPage }: FindPlacePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("red-green-flags")} className="p-2">
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </Button>
          <div></div>
        </div>

        <div className="flex justify-center mb-8">
          <Image src="/home-icon.png" alt="Home Icon" width={64} height={64} className="w-16 h-16" />
        </div>

        <div>
          <h2 className="text-2xl font-normal text-sky-400 mb-8">Find Your Place</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            set your listing preferences for budget and location and this helps us show you homes that truly match your
            needs.
          </p>
        </div>

        <Button
          onClick={() => setCurrentPage("budget-city")}
          className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  )
}
