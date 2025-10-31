"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { loginProfile, getProfiles, createProfile } from "@/lib/utils"
import { Heart, ArrowLeft } from "lucide-react"

interface AuthPageProps {
  onBack: () => void
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState<string>("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  // Only keep and set the logged-in user in Zustand for session
  const setUser = (user: any) => useAppStore.setState({ user })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (isSignUp) {
        if (!name || !email || !password || !age || !profileImage) {
          setError("Please fill in all fields and upload a profile picture")
          setLoading(false)
          return
        }
        const ageNum = Number.parseInt(age)
        if (isNaN(ageNum) || ageNum < 18) {
          setError("You must be 18 years or older to use HeartMatch")
          setLoading(false)
          return
        }
        // Fake user creation: send to backend. WARNING: Do not send plaintext passwords in real apps!
        const newUser = await createProfile({
          email,
          name,
          bio,
          password,
          age: ageNum,
          profileImage, // send base64 image as profileImage
        })
        setUser(newUser)
        // ...route to home or dashboard
      } else {
        if (!email || !password) {
          setError("Please enter email and password")
          setLoading(false)
          return
        }
        try {
          const user = await loginProfile(email, password);
          setUser(user);
          // ...route to home or dashboard
        } catch (e) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }
        // Basic demo login: fetch all users and check
        const users = await getProfiles()
        const user = users.find((u: any) => u.email === email && u.password === password)
        if (user) {
          setUser(user)
          // ...route to home or dashboard
        } else {
          setError("Invalid email or password")
        }
      }
    } catch (err) {
      setError("Failed to authenticate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Card className="bg-white dark:bg-slate-800 border-0 shadow-xl">
          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HeartMatch</h1>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
              {isSignUp ? "Create Your Profile" : "Welcome Back"}
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
                      <Input
                        type="number"
                        min="18"
                        value={age}
                        onChange={(e) => {
                          const value = e.target.value
                          const numValue = Number.parseInt(value)
                          if (value === "" || (numValue >= 18)) {
                            setAge(value)
                          }
                        }}
                        placeholder="18"
                        className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Profile Picture
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image"
                      />
                      <label
                        htmlFor="profile-image"
                        className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      >
                        {profileImage ? (
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Change photo</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-600 dark:text-slate-400">Click to upload photo</span>
                        )}
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2">
                {loading ? 'Loading...' : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError("")
                  }}
                  className="text-rose-500 hover:text-rose-600 font-semibold"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
