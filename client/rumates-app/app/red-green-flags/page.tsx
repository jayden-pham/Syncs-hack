"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface RedGreenFlagsPageProps {
  setCurrentPage: (page: string) => void
  redFlag: string
  setRedFlag: (redFlag: string) => void
  greenFlag: string
  setGreenFlag: (greenFlag: string) => void
}

export default function RedGreenFlagsPage({
  setCurrentPage,
  redFlag,
  setRedFlag,
  greenFlag,
  setGreenFlag,
}: RedGreenFlagsPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage("preferences")} className="p-2">
              <ArrowLeft className="w-5 h-5 text-sky-400" />
            </Button>
            <div></div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-normal text-sky-400 mb-4">Red Flags Green Flags</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            What would you like and not like about your future room mate? This will be shown on your profile.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-medium text-base text-red-500">Red Flag</span>
            </div>
            <div className="w-full h-24 bg-red-50 rounded-lg p-4">
              <Input
                type="text"
                placeholder="Write in me !"
                value={redFlag}
                onChange={(e) => setRedFlag(e.target.value)}
                className="w-full h-full border-0 bg-transparent text-base focus:ring-0 shadow-none resize-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-medium text-base text-green-500">Green Flag</span>
            </div>
            <div className="w-full h-24 bg-green-50 rounded-lg p-4">
              <Input
                type="text"
                placeholder="Write in me !"
                value={greenFlag}
                onChange={(e) => setGreenFlag(e.target.value)}
                className="w-full h-full border-0 bg-transparent text-base focus:ring-0 shadow-none resize-none"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => setCurrentPage("find-place")}
          className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  )
}
