"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ListingDetailProps {
  setCurrentPage: (page: string) => void
}

export default function ListingDetail({ setCurrentPage }: ListingDetailProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button
          onClick={() => setCurrentPage("listings")}
          variant="ghost"
          size="sm"
          className="text-sky-400 hover:bg-sky-50"
        >
          ← Back
        </Button>
        <Image src="/rumates-logo-blue.png" alt="Rumates" width={120} height={32} className="h-8 w-auto" />
        <div className="w-16"></div>
      </div>

      <div className="w-full h-64 bg-gray-200">
        <img src="/modern-apartment-living-room.png" alt="Apartment interior" className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <img
            src="/modern-kitchen-with-wooden-cabinets-and-large-wind.png"
            alt="Kitchen"
            className="w-full h-20 object-cover rounded"
          />
          <div className="bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">+3 more</span>
          </div>
          <div className="bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">View all</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-medium text-black mb-2">Apartment in Melbourne</h1>
            <span className="text-xl font-medium text-black">$470 / week</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">2 bed • 1 bath</div>
            <div className="text-sm text-gray-600">Available now</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-black mb-2">Location</h3>
          <p className="text-base text-gray-700 mb-2">123 Collins Street, Melbourne VIC 3000</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>🚊 2 min to tram</span>
            <span>☕ 5 min to cafes</span>
            <span>🛒 3 min to shops</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-black mb-2">Description</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            Bright and stylish apartment located just minutes from trams, cafes, and shops. Features an open-plan
            kitchen and living area, built-in wardrobes, and floor-to-ceiling windows with city views. Perfect for young
            professionals or students looking for a modern living space in the heart of Melbourne.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-black mb-2">Features</h3>
          <ul className="space-y-2 text-base text-gray-700">
            <li>• Open-plan kitchen and living area</li>
            <li>• Built-in wardrobes</li>
            <li>• Floor-to-ceiling windows</li>
            <li>• City views</li>
            <li>• Close to public transport</li>
            <li>• Near cafes and shops</li>
            <li>• Air conditioning</li>
            <li>• Dishwasher included</li>
            <li>• Secure building entry</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-black mb-2">Lease Details</h3>
          <div className="space-y-2 text-base text-gray-700">
            <div className="flex justify-between">
              <span>Bond:</span>
              <span>$1,880 (4 weeks)</span>
            </div>
            <div className="flex justify-between">
              <span>Minimum lease:</span>
              <span>12 months</span>
            </div>
            <div className="flex justify-between">
              <span>Pets:</span>
              <span>On application</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 bg-sky-400 hover:bg-sky-500 text-white">Contact Agent</Button>
          <Button variant="outline" className="flex-1 border-sky-400 text-sky-400 hover:bg-sky-50 bg-transparent">
            Save Listing
          </Button>
        </div>
      </div>
    </div>
  )
}
