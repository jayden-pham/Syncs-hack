"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"

interface PersonalInfoPageProps {
  setCurrentPage: (page: string) => void
  firstName: string
  setFirstName: (firstName: string) => void
  lastName: string
  setLastName: (lastName: string) => void
  birthday: string
  setBirthday: (birthday: string) => void
}

function calcAgeFromBirthday(birthdayISO: string): number | null {
  if (!birthdayISO) return null
  const b = new Date(birthdayISO)
  if (isNaN(b.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
  return age >= 0 ? age : null
}

export default function PersonalInfoPage({
  setCurrentPage,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthday,
  setBirthday,
}: PersonalInfoPageProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const age = useMemo(() => calcAgeFromBirthday(birthday), [birthday])

  const handleSubmit = async () => {
    setError(null);
  
    const name = [firstName, lastName].map(s => (s || "").trim()).filter(Boolean).join(" ");
    if (!name) { setError("Please enter your name."); return }
    if (age === null) { setError("Please enter a valid birthday."); return }
  
    setSubmitting(true);
  
    try {
      const token = localStorage.getItem("access_token");
      await api("/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, age }),
      });
    } catch (e) {
      console.error("Failed to update user:", e);
    } finally {
      setSubmitting(false);
      setCurrentPage("swiping");
    }
  };
  

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage("login")} className="p-2">
              <ArrowLeft className="w-5 h-5 text-sky-400" />
            </Button>
            <div />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sky-400 text-lg font-medium mb-2">My first name is</label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is how it will appear in Rumate, you will not be able to change it later
            </p>
          </div>

          <div>
            <label className="block text-sky-400 text-lg font-medium mb-2">My last name is</label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
          </div>

          <div>
            <label className="block text-sky-400 text-lg font-medium mb-2">My birthday is</label>
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              We’ll store your age only. Calculated age: {age ?? "—"}
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-sky-400 text-white py-6 text-base font-medium rounded-full hover:bg-sky-500 shadow-lg disabled:opacity-60"
          >
            {submitting ? "Saving..." : "BEGIN"}
          </Button>
        </div>
      </div>
    </div>
  )
}
