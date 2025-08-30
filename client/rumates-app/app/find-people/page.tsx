"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

interface FindPeoplePageProps {
  setCurrentPage: (page: string) => void
}

export default function FindPeoplePage({ setCurrentPage }: FindPeoplePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("interests")} className="p-2">
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </Button>
          <div></div>
        </div>

        <div className="flex justify-center mb-8">
          <Image src="/home-icon.png" alt="Home Icon" width={64} height={64} className="w-16 h-16" />
        </div>

        <div>
          <h2 className="text-2xl font-normal text-sky-400 mb-8">Find Your People</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Swipe through profiles of individuals and groups, discover roommates who match your lifestyle and budget,
            and connect in group chats.
          </p>
        </div>

        <Button
          onClick={() => setCurrentPage("preferences")}
          className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  )
}
