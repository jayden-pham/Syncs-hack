"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface ListingsPageProps {
  setCurrentPage: (page: string) => void
}

export default function ListingsPage({ setCurrentPage }: ListingsPageProps) {
  const handleListingClick = (listingId: string) => {
    setCurrentPage(`listing-${listingId}`)
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
        <h2 className="text-2xl font-normal text-black mb-6">Listings</h2>

        <Card
          className="shadow-lg border border-sky-200 rounded-lg overflow-hidden mb-6 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleListingClick("melbourne-apartment")}
        >
          <CardContent className="p-0">
            <div className="w-full h-48 bg-gray-200 rounded-t-lg">
              <img
                src="/modern-apartment-living-room.png"
                alt="Apartment interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-lg font-medium text-black">470$/ week</span>
                </div>
              </div>
              <h3 className="font-medium text-lg text-black mb-2">Apartment in Melbourne</h3>
              <div className="flex items-center gap-1 mb-3">
                <Image src="/rumates-logo-blue.png" alt="Rumates" width={120} height={32} className="h-6 w-auto" />
              </div>
              <p className="text-sm text-sky-400 font-normal leading-relaxed">
                Bright and stylish apartment located just minutes from trams, cafes, and shops. Features an open-plan
                kitchen and living area, built-in wardrobes, and floor-to-ceiling windows with city views ....
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-lg border border-sky-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleListingClick("modern-kitchen")}
        >
          <CardContent className="p-0">
            <div className="w-full h-48 bg-gray-200 rounded-t-lg">
              <img
                src="/modern-kitchen-with-wooden-cabinets-and-large-wind.png"
                alt="Kitchen interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-lg font-medium text-black">520$/ week</span>
                </div>
              </div>
              <h3 className="font-medium text-lg text-black mb-2">Modern Studio in CBD</h3>
              <div className="flex items-center gap-1 mb-3">
                <Image src="/rumates-logo-blue.png" alt="Rumates" width={120} height={32} className="h-6 w-auto" />
              </div>
              <p className="text-sm text-sky-400 font-normal leading-relaxed">
                Contemporary studio with premium finishes and wooden cabinetry. Located in the heart of the city with
                easy access to public transport ....
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
