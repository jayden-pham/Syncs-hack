"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

interface PreferencesPageProps {
  setCurrentPage: (page: string) => void
}

export default function PreferencesPage({ setCurrentPage }: PreferencesPageProps) {
  const [genderPreference, setGenderPreference] = useState("")
  const [agePreference, setAgePreference] = useState("")

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("find-people")} className="p-2">
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </Button>
          <div></div>
        </div>

        <div>
          <h2 className="text-base font-normal text-sky-400 mb-4">What gender do you prefer?</h2>
          <div className="flex gap-3 justify-center">
            <Button
              variant={genderPreference === "WOMAN" ? "default" : "outline"}
              onClick={() => setGenderPreference("WOMAN")}
              className={`px-4 py-3 rounded-full text-sm font-medium ${
                genderPreference === "WOMAN"
                  ? "bg-sky-400 text-white hover:bg-sky-500"
                  : "border-sky-400 text-sky-400 hover:bg-sky-50"
              }`}
            >
              WOMAN
            </Button>
            <Button
              variant={genderPreference === "MAN" ? "default" : "outline"}
              onClick={() => setGenderPreference("MAN")}
              className={`px-4 py-3 rounded-full text-sm font-medium ${
                genderPreference === "MAN"
                  ? "bg-sky-400 text-white hover:bg-sky-500"
                  : "border-sky-400 text-sky-400 hover:bg-sky-50"
              }`}
            >
              MAN
            </Button>
            <Button
              variant={genderPreference === "ANY" ? "default" : "outline"}
              onClick={() => setGenderPreference("ANY")}
              className={`px-4 py-3 rounded-full text-sm font-medium ${
                genderPreference === "ANY"
                  ? "bg-sky-400 text-white hover:bg-sky-500"
                  : "border-sky-400 text-sky-400 hover:bg-sky-50"
              }`}
            >
              ANY
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-base font-normal text-sky-400 mb-4">What age do you prefer?</h2>
          <div className="flex gap-3 justify-center items-center">
            <input
              type="number"
              min="18"
              max="65"
              placeholder="Min age"
              value={agePreference.split("-")[0] || ""}
              onChange={(e) => {
                const maxAge = agePreference.split("-")[1] || ""
                setAgePreference(`${e.target.value}${maxAge ? `-${maxAge}` : ""}`)
              }}
              className="w-20 px-3 py-2 border border-sky-400 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <span className="text-sky-400">to</span>
            <input
              type="number"
              min="18"
              max="65"
              placeholder="Max age"
              value={agePreference.split("-")[1] || ""}
              onChange={(e) => {
                const minAge = agePreference.split("-")[0] || ""
                setAgePreference(`${minAge}${minAge ? "-" : ""}${e.target.value}`)
              }}
              className="w-20 px-3 py-2 border border-sky-400 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <Button
          onClick={() => setCurrentPage("red-green-flags")}
          className="w-full bg-sky-400 text-white py-6 text-base font-medium rounded-full hover:bg-sky-500 shadow-lg"
        >
          BEGIN
        </Button>
      </div>
    </div>
  )
}
