"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

interface InterestsPageProps {
  setCurrentPage: (page: string) => void
}

export default function InterestsPage({ setCurrentPage }: InterestsPageProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const interests = [
    "Music",
    "Sports",
    "Cooking",
    "Reading",
    "Gaming",
    "Fitness",
    "Travel",
    "Movies",
    "Art",
    "Photography",
    "Dancing",
    "Hiking",
    "Yoga",
    "Coffee",
    "Wine",
    "Pets",
    "Gardening",
    "Tech",
    "Fashion",
    "Food",
    "Netflix",
    "Concerts",
    "Beach",
    "Outdoors",
  ]

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("photo")} className="p-2">
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </Button>
          <div></div>
        </div>

        <div>
          <h2 className="text-lg font-normal text-sky-400 mb-8">Interests</h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Let everyone know what you're interested in by adding it to your profile
          </p>
        </div>

        <div className="w-full mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedInterests.includes(interest)
                    ? "bg-sky-300 text-white"
                    : "bg-sky-100 text-sky-600 hover:bg-sky-200"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">Select interests that describe you</p>
        </div>

        <Button
          onClick={() => setCurrentPage("find-people")}
          className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  )
}
