"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Camera } from "lucide-react"
import { useState } from "react"

interface PhotoPageProps {
  setCurrentPage: (page: string) => void
}

export default function PhotoPage({ setCurrentPage }: PhotoPageProps) {
  const [photos, setPhotos] = useState<string[]>([])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotos((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("personal-info")} className="p-2">
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </Button>
          <div></div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-sky-400 mb-8">Add a photo</h2>
          
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
            {photos[0] ? (
              <img src={photos[0] || "/placeholder.svg"} alt="Profile photo 1" className="w-full h-full object-cover" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <Plus className="w-6 h-6 text-gray-400" />
              </label>
            )}
          </div>

          <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
            {photos[1] ? (
              <img src={photos[1] || "/placeholder.svg"} alt="Profile photo 2" className="w-full h-full object-cover" />
            ) : photos.length >= 1 ? (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <Plus className="w-6 h-6 text-gray-400" />
              </label>
            ) : null}
          </div>

          <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
            {photos[2] ? (
              <img src={photos[2] || "/placeholder.svg"} alt="Profile photo 3" className="w-full h-full object-cover" />
            ) : photos.length >= 2 ? (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <Plus className="w-6 h-6 text-gray-400" />
              </label>
            ) : null}
          </div>

          <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
            {photos[3] ? (
              <img src={photos[3] || "/placeholder.svg"} alt="Profile photo 4" className="w-full h-full object-cover" />
            ) : photos.length >= 3 ? (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <Plus className="w-6 h-6 text-gray-400" />
              </label>
            ) : null}
          </div>
        </div>

        <p className="text-base text-gray-600 mb-8">Profiles with photos get more matches.</p>

        <Button
          onClick={() => setCurrentPage("interests")}
          className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  )
}
