"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface FiltersPageProps {
  setCurrentPage: (page: string) => void
}

export default function FiltersPage({ setCurrentPage }: FiltersPageProps) {
  const [peopleFilters, setPeopleFilters] = useState({
    minAge: "18",
    maxAge: "35",
    gender: "Any",
    budget: "500",
  })

  const [listingFilters, setListingFilters] = useState({
    minBudget: "300",
    maxBudget: "800",
    location: "Melbourne",
  })

  const handlePeopleFilterChange = (key: string, value: string) => {
    setPeopleFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleListingFilterChange = (key: string, value: string) => {
    setListingFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between mb-8 p-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentPage("swiping")} className="p-2">
          <ArrowLeft className="w-5 h-5 text-sky-400" />
        </Button>
        <div></div>
      </div>

      <div className="px-4">
        <div className="text-center mb-8">
          <Image
            src="/rumates-logo-blue.png"
            alt="Rumates"
            width={120}
            height={32}
            className="h-8 w-auto mx-auto mb-4"
          />
          <h1 className="text-lg font-medium text-black mb-2">Filters</h1>
          <p className="text-base text-gray-600">Adjust your preferences for finding people and places</p>
        </div>

        <div className="space-y-8">
          {/* People Filters Section */}
          <div className="bg-sky-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-black mb-4">People Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={peopleFilters.minAge}
                    onChange={(e) => handlePeopleFilterChange("minAge", e.target.value)}
                    className="flex-1"
                    placeholder="Min age"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    value={peopleFilters.maxAge}
                    onChange={(e) => handlePeopleFilterChange("maxAge", e.target.value)}
                    className="flex-1"
                    placeholder="Max age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
                <div className="flex gap-2">
                  {["Any", "Woman", "Man"].map((gender) => (
                    <Button
                      key={gender}
                      variant={peopleFilters.gender === gender ? "default" : "outline"}
                      className={`flex-1 ${
                        peopleFilters.gender === gender
                          ? "bg-sky-400 text-white hover:bg-sky-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePeopleFilterChange("gender", gender)}
                    >
                      {gender}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget per week ($)</label>
                <Input
                  type="number"
                  value={peopleFilters.budget}
                  onChange={(e) => handlePeopleFilterChange("budget", e.target.value)}
                  placeholder="Maximum budget"
                />
              </div>
            </div>
          </div>

          {/* Listing Filters Section */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-black mb-4">Listing Preferences</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range ($/week)</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={listingFilters.minBudget}
                    onChange={(e) => handleListingFilterChange("minBudget", e.target.value)}
                    className="flex-1"
                    placeholder="Min budget"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    value={listingFilters.maxBudget}
                    onChange={(e) => handleListingFilterChange("maxBudget", e.target.value)}
                    className="flex-1"
                    placeholder="Max budget"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Input
                  type="text"
                  value={listingFilters.location}
                  onChange={(e) => handleListingFilterChange("location", e.target.value)}
                  placeholder="City or suburb"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 pb-8">
          <Button
            onClick={() => setCurrentPage("swiping")}
            className="w-full bg-sky-400 text-white hover:bg-sky-500 py-3 rounded-lg text-base font-medium"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
