"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ChatPageProps {
  setCurrentPage: (page: string) => void
}

export default function ChatPage({ setCurrentPage }: ChatPageProps) {
  const handleChatClick = (chatName: string) => {
    setCurrentPage(`chat-${chatName.toLowerCase().replace(/\s+/g, "-")}`)
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

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-100">
        <Image src="/rumates-logo-blue.png" alt="Rumates" width={120} height={32} className="h-8 w-auto" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-sky-100">
            <Image src="/profile-icon.png" alt="Profile" width={20} height={20} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-normal text-black mb-6">Chats</h2>

        <div className="flex items-center justify-between gap-2 mb-6">
          <Button
            variant="default"
            className="bg-sky-300 text-white hover:bg-sky-400 rounded-full px-3 py-2 text-sm font-normal flex-1"
          >
            All
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 hover:bg-gray-100 rounded-full px-3 py-2 text-sm font-normal border border-gray-300 flex-1"
          >
            Groups
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 hover:bg-gray-100 rounded-full px-3 py-2 text-sm font-normal border border-gray-300 flex-1"
          >
            Individuals
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 hover:bg-gray-100 rounded-full w-10 h-10 text-sm font-normal border border-gray-300 flex-shrink-0"
          >
            +
          </Button>
        </div>

        <div className="space-y-4">
          <div
            className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
            onClick={() => handleChatClick("The Dream Team")}
          >
            <Image src="/dream-team-avatar.png" alt="The Dream Team" width={48} height={48} className="rounded-full" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base text-black">The Dream Team</h3>
                <span className="text-sm text-gray-500 font-normal">7:00pm</span>
              </div>
              <p className="text-sm text-gray-600 font-normal">Wow thats a really nice place!!!</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div
            className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
            onClick={() => handleChatClick("Goblin Barrel")}
          >
            <Image
              src="/goblin-barrel-avatar.png"
              alt="Goblin Barrel"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base text-black">Goblin Barrel</h3>
                <span className="text-sm text-gray-500 font-normal">Yesterday</span>
              </div>
              <p className="text-sm text-gray-600 font-normal">
                I reckon the princess tower is looking good? Thoughts on checking it out?
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div
            className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
            onClick={() => handleChatClick("Three Musketeers")}
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">⚔️</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base text-black">Three Musketeers</h3>
                <span className="text-sm text-gray-500 font-normal">Thursday</span>
              </div>
              <p className="text-sm text-sky-400 font-normal">Pew pew pew pew</p>
            </div>
            <Badge className="bg-sky-400 text-white text-xs rounded-full px-2 py-1">1</Badge>
          </div>

          <hr className="border-gray-200" />

          <div
            className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
            onClick={() => handleChatClick("E=MC² + AI")}
          >
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">🍕</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base text-black">E=MC² + AI</h3>
                <span className="text-sm text-gray-500 font-normal">1/8/2025</span>
              </div>
              <p className="text-sm text-sky-400 font-normal">erm wts</p>
            </div>
            <Badge className="bg-sky-400 text-white text-xs rounded-full px-2 py-1">2</Badge>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}
