"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface OopsPageProps {
  setCurrentPage: (page: string) => void
}

export default function OopsPage({ setCurrentPage }: OopsPageProps) {
  const handleCreateAccount = () => {
    setCurrentPage("login")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("login")} className="p-2">
            <X className="w-5 h-5 text-sky-400" />
          </Button>
          <div></div>
        </div>

        <div>
          <h2 className="text-2xl font-normal text-black mb-8">Oops!</h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            We couldn't find a Rumate account connected to that Username
          </p>
        </div>

        <Button
          onClick={handleCreateAccount}
          className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
        >
          Create New Account
        </Button>
      </div>
    </div>
  )
}
