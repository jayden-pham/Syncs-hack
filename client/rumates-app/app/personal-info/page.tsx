"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface PersonalInfoPageProps {
  setCurrentPage: (page: string) => void
  firstName: string
  setFirstName: (firstName: string) => void
  lastName: string
  setLastName: (lastName: string) => void
  birthday: string
  setBirthday: (birthday: string) => void
  gender: string
  setGender: (gender: string) => void
}

export default function PersonalInfoPage({
  setCurrentPage,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthday,
  setBirthday,
  gender,
  setGender,
}: PersonalInfoPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage("login")} className="p-2">
              <ArrowLeft className="w-5 h-5 text-sky-400" />
            </Button>
            <div></div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sky-400 text-lg font-medium mb-2">My first name is</label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is how it will appear in Rumate, you will not be able to change it later
            </p>
          </div>

          <div>
            <label className="block text-sky-400 text-lg font-medium mb-2">My last name is</label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
          </div>

          <div>
            <label className="block text-sky-400 text-lg font-medium mb-2">My birthday is</label>
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sky-400 text-lg font-medium">I am a</label>
            <div className="flex gap-3">
              <Button
                onClick={() => setGender("WOMAN")}
                variant={gender === "WOMAN" ? "default" : "outline"}
                className={`flex-1 py-4 rounded-full text-base font-medium shadow-sm ${
                  gender === "WOMAN"
                    ? "bg-sky-300 text-white hover:bg-sky-400"
                    : "border-2 border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                }`}
              >
                WOMAN
              </Button>
              <Button
                onClick={() => setGender("MAN")}
                variant={gender === "MAN" ? "default" : "outline"}
                className={`flex-1 py-4 rounded-full text-base font-medium shadow-sm ${
                  gender === "MAN"
                    ? "bg-sky-300 text-white hover:bg-sky-400"
                    : "border-2 border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                }`}
              >
                MAN
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setCurrentPage("photo")}
            className="w-full bg-sky-400 text-white py-6 text-base font-medium rounded-full hover:bg-sky-500 shadow-lg"
          >
            BEGIN
          </Button>
        </div>
      </div>
    </div>
  )
}
