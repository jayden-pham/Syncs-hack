"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ChatConversationProps {
  setCurrentPage: (page: string) => void
}

export default function ChatConversation({ setCurrentPage }: ChatConversationProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button
          onClick={() => setCurrentPage("chat")}
          variant="ghost"
          size="sm"
          className="text-sky-400 hover:bg-sky-50"
        >
          ← Back
        </Button>
        <div className="flex items-center gap-2">
          <Image src="/dream-team-avatar.png" alt="The Dream Team" width={32} height={32} className="rounded-full" />
          <h1 className="text-lg font-medium text-black">The Dream Team</h1>
        </div>
        <div className="w-16"></div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="flex justify-start">
          <div className="flex items-start gap-2">
            <Image src="/dream-team-avatar.png" alt="John" width={24} height={24} className="rounded-full mt-1" />
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
              <p className="text-xs text-gray-600 mb-1">John</p>
              <p className="text-sm text-gray-800">
                Hey everyone! I found this amazing place in Melbourne. What do you think?
              </p>
              <span className="text-xs text-gray-500">2:30pm</span>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs text-white font-medium mt-1">
              A
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
              <p className="text-xs text-gray-600 mb-1">Amethyst</p>
              <p className="text-sm text-gray-800">Looks great! What's the rent split between the three of us?</p>
              <span className="text-xs text-gray-500">3:15pm</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-sky-400 rounded-lg px-4 py-2 max-w-xs">
            <p className="text-sm text-white">About $157 each per week. Pretty reasonable for the location!</p>
            <span className="text-xs text-sky-100">3:20pm</span>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center text-xs text-white font-medium mt-1">
              B
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
              <p className="text-xs text-gray-600 mb-1">Bella</p>
              <p className="text-sm text-gray-800">I love the kitchen! And those city views 😍</p>
              <span className="text-xs text-gray-500">6:45pm</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-sky-400 rounded-lg px-4 py-2 max-w-xs">
            <p className="text-sm text-white">Wow thats a really nice place!!!</p>
            <span className="text-xs text-sky-100">7:00pm</span>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="flex items-start gap-2">
            <Image src="/dream-team-avatar.png" alt="John" width={24} height={24} className="rounded-full mt-1" />
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
              <p className="text-xs text-gray-600 mb-1">John</p>
              <p className="text-sm text-gray-800">Should we schedule a viewing for this weekend?</p>
              <span className="text-xs text-gray-500">7:05pm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-sky-400"
          />
          <Button className="bg-sky-400 hover:bg-sky-500 text-white rounded-full px-6">Send</Button>
        </div>
      </div>
    </div>
  )
}
