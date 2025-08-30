"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api";


interface LoginPageProps {
  setCurrentPage: (page: string) => void
  username: string
  setUsername: (username: string) => void
  password: string
  setPassword: (password: string) => void
}

export default function LoginPage({ setCurrentPage, username, setUsername, password, setPassword }: LoginPageProps) {
  const handleLogin = async () => {
    try {
      const res = await api("/users/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
  
      // Save token to localStorage for future requests
      localStorage.setItem("access_token", res.access_token);
  
      // Move to next page
      setCurrentPage("personal-info");
    } catch (err) {
      console.error(err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage("landing")} className="p-2">
              <ArrowLeft className="w-5 h-5 text-sky-400" />
            </Button>
            <div></div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sky-400 text-base mb-2">My Username is</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
          </div>

          <div>
            <label className="block text-sky-400 text-base mb-2">My Password is</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 px-4 text-base border-0 border-b-2 border-gray-200 rounded-none focus:border-sky-400 focus:ring-0 bg-transparent shadow-none"
            />
          </div>

          <div className="text-center text-sm text-gray-600 space-y-2 font-normal leading-relaxed">
            <p>
              By signing up you agree to our <span className="text-sky-400 underline">Terms</span> and{" "}
              <span className="text-sky-400 underline">Privacy Policy</span>.
            </p>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-sky-300 text-white py-6 text-base font-medium rounded-full hover:bg-sky-400 shadow-lg"
          >
            SIGN UP
          </Button>

          <p className="text-center text-sm text-gray-600 font-normal">
            Make sure your password is at least 8 characters long and includes a number
          </p>
        </div>
      </div>
    </div>
  )
}
