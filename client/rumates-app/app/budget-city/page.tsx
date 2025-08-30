"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface BudgetCityPageProps {
  setCurrentPage: (page: string) => void
  city: string
  setCity: (city: string) => void
  budget: string
  setBudget: (budget: string) => void
}

const inputCls =
  "w-full py-4 px-4 text-base border-0 border-b-2 border-transparent rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-normal text-sky-400">{label}</h2>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  )
}

export default function BudgetCityPage({
  setCurrentPage,
  city,
  setCity,
  budget,
  setBudget,
}: BudgetCityPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="flex items-center justify-start mb-8">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage("find-place")} className="p-2">
            <ArrowLeft className="w-5 h-5 text-sky-400" />
          </Button>
        </div>

        {/* Fields */}
        <div className="space-y-8">
          <LabeledInput label="What city do you want to live in?" value={city} onChange={setCity} />
          <LabeledInput label="What's your budget per week?" value={budget} onChange={setBudget} />
        </div>

        {/* CTA */}
        <Button
          onClick={() => setCurrentPage("welcome")}
          className="w-full bg-sky-400 text-white py-6 text-base font-medium rounded-full hover:bg-sky-500 shadow-lg"
        >
          BEGIN
        </Button>
      </div>
    </div>
  )
}
