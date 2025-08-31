"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, X, RotateCcw } from "lucide-react"
import Image from "next/image"

interface SwipingPageProps {
  setCurrentPage: (page: string) => void
}

const dummyProfiles = [
  {
    id: 1,
    names: "John 22, Amethyst 25, Bella 27",
    match: 94,
    image: "/three-young-roommates-smiling.png",
    bio: "Looking for a clean, friendly roommate to share our 3BR apartment",
    interests: ["Cooking", "Yoga", "Movies"],
    redFlags: ["Loud music after 10pm", "Messy common areas"],
    greenFlags: ["Loves cooking together", "Respectful of personal space", "Great at communication"],
  },
  {
    id: 2,
    names: "Sarah 24",
    match: 89,
    image: "/young-woman-plants.png",
    bio: "Plant lover seeking eco-conscious roommate",
    interests: ["Gardening", "Reading", "Hiking"],
    redFlags: ["No pets allowed", "Early riser (5am workouts)"],
    greenFlags: ["Eco-friendly lifestyle", "Quiet and studious", "Loves plants and nature"],
  },
  {
    id: 3,
    names: "Mike 26, Alex 28",
    match: 92,
    image: "/two-young-men-in-modern-apartment.png",
    bio: "Two professionals looking for a third roommate",
    interests: ["Gaming", "Fitness", "Cooking"],
    redFlags: ["Gaming sessions can get loud", "Gym equipment in living room"],
    greenFlags: ["Split groceries evenly", "Always clean up after themselves", "Great at fixing things"],
  },
  {
    id: 4,
    names: "Emma 23, Lisa 25",
    match: 87,
    image: "/two-young-women-studying.png",
    bio: "Graduate students seeking quiet, studious roommate",
    interests: ["Study", "Coffee", "Art"],
    redFlags: ["Need quiet for studying", "No parties or loud gatherings"],
    greenFlags: ["Great study buddies", "Love coffee shop visits", "Organized and clean"],
  },
  {
    id: 5,
    names: "David 29",
    match: 91,
    image: "/young-professional-man.png",
    bio: "Working professional, clean and organized",
    interests: ["Work", "Gym", "Travel"],
    redFlags: ["Travels frequently for work", "Strict about cleanliness"],
    greenFlags: ["Very organized", "Pays bills on time", "Respectful of shared spaces"],
  },
]

export default function SwipingPage({ setCurrentPage }: SwipingPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentProfile = dummyProfiles[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return

    setIsAnimating(true)
    setDragOffset({ x: direction === "right" ? 300 : -300, y: 0 })

    setTimeout(() => {
      if (currentIndex < dummyProfiles.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(0) // Loop back to first profile
      }
      setDragOffset({ x: 0, y: 0 })
      setIsAnimating(false)
      setIsFlipped(false)
    }, 300) // Reduced animation duration from 500ms to 300ms for quicker animations
  }

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDragging && !isAnimating) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return
    e.preventDefault()

    setIsDragging(true)
    const startX = e.clientX
    const startY = e.clientY

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      setDragOffset({ x: deltaX, y: deltaY * 0.1 }) // Reduce vertical movement
    }

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false)
      const finalDeltaX = e.clientX - startX

      if (Math.abs(finalDeltaX) > 100) {
        handleSwipe(finalDeltaX > 0 ? "right" : "left")
      } else {
        setDragOffset({ x: 0, y: 0 })
      }

      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return

    setIsDragging(true)
    const startX = e.touches[0].clientX
    const startY = e.touches[0].clientY

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const deltaX = e.touches[0].clientX - startX
      const deltaY = e.touches[0].clientY - startY
      setDragOffset({ x: deltaX, y: deltaY * 0.1 }) // Reduce vertical movement
    }

    const handleTouchEnd = (e: TouchEvent) => {
      setIsDragging(false)
      const finalDeltaX = e.changedTouches[0].clientX - startX

      if (Math.abs(finalDeltaX) > 100) {
        handleSwipe(finalDeltaX > 0 ? "right" : "left")
      } else {
        setDragOffset({ x: 0, y: 0 })
      }

      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-sky-300 px-4 py-3">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <Button
          onClick={() => setCurrentPage("chat")}
          className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center"
        >
          <Image src="/chat-icon.png" alt="Chat" width={24} height={24} />
        </Button>

        <Button
          onClick={() => setCurrentPage("swiping")}
          className="w-16 h-16 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center shadow-lg"
        >
          <Image src="/home-icon.png" alt="Home" width={32} height={32} />
        </Button>

        <Button
          onClick={() => setCurrentPage("listings")}
          className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center"
        >
          <Image src="/listing-icon.png" alt="Listings" width={24} height={24} />
        </Button>
      </div>
    </div>
  )

  if (!currentProfile) {
    return <div>No more profiles!</div>
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-100">
        <Image src="/rumates-logo-blue.png" alt="Rumates" width={120} height={32} className="h-8 w-auto" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-sky-100" onClick={() => setCurrentPage("filters")}>
            <Image src="/filter-icon-new.png" alt="Filter" width={20} height={20} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-sky-100">
            <Image src="/profile-icon.png" alt="Profile" width={20} height={20} />
          </Button>
        </div>
      </div>

      <div className="p-4 relative">
        <div className="relative max-w-sm mx-auto">
          {/* Next card (behind current) */}
          {currentIndex < dummyProfiles.length - 1 && (
            <Card className="absolute top-2 left-2 right-2 shadow-lg border-0 bg-white rounded-2xl overflow-hidden transform scale-95 opacity-50">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={dummyProfiles[currentIndex + 1].image || "/placeholder.svg"}
                    alt="Next profile"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current card */}
          <Card
            ref={cardRef}
            className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
              opacity: Math.abs(dragOffset.x) > 150 ? 0.5 : 1,
              transition: isDragging ? "none" : "all 0.3s ease-out", // Reduced transition duration from 0.5s to 0.3s for quicker animations
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <CardContent className="p-0">
              <div className="relative h-80">
                <div
                  className="relative w-full h-full transition-transform duration-500 preserve-3d"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front of card */}
                  <div className="absolute inset-0 backface-hidden">
                    <img
                      src={currentProfile.image || "/placeholder.svg"}
                      alt={currentProfile.names}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-sky-400 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                        {currentProfile.match}%
                      </Badge>
                    </div>

                    <Button
                      onClick={handleFlip}
                      className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-600" />
                    </Button>

                    {Math.abs(dragOffset.x) > 50 && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                          dragOffset.x > 0 ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        <div
                          className={`text-6xl font-bold transform transition-transform duration-200 ${
                            dragOffset.x > 0 ? "text-green-500 scale-110" : "text-red-500 scale-110"
                          }`}
                        >
                          {dragOffset.x > 0 ? "❤️" : "✕"}
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="font-medium text-lg text-white mb-1">{currentProfile.names}</h3>
                      <p className="text-white/90 text-sm mb-2">{currentProfile.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {currentProfile.interests.map((interest, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-white/20 text-white border-white/30"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 backface-hidden bg-white p-4 overflow-y-auto"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">{currentProfile.names}</h3>
                      <Button
                        onClick={handleFlip}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        size="sm"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Green Flags */}
                      <div>
                        <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          Green Flags
                        </h4>
                        <div className="space-y-2">
                          {currentProfile.greenFlags.map((flag, index) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-800">{flag}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Red Flags */}
                      <div>
                        <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          Red Flags
                        </h4>
                        <div className="space-y-2">
                          {currentProfile.redFlags.map((flag, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-800">{flag}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-8 mt-8">
          <Button
            onClick={() => handleSwipe("left")}
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 bg-white border-2 border-red-200 hover:bg-red-50 shadow-lg"
            disabled={isAnimating}
          >
            <X className="w-8 h-8 text-red-500" />
          </Button>
          <Button
            onClick={() => handleSwipe("right")}
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 bg-white border-2 border-green-200 hover:bg-green-50 shadow-lg"
            disabled={isAnimating}
          >
            <Heart className="w-8 h-8 text-green-500" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
