"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, X } from "lucide-react"

export function DiscoveryPage() {
  const { user, users, addLike, getLikes, hasLiked } = useAppStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)

  // Get profiles to show (exclude self and already swiped)
  const availableProfiles = useMemo(() => {
    if (!user) return []
    const userLikes = getLikes(user.id)
    return users.filter((u) => u.id !== user.id && !userLikes.includes(u.id))
  }, [user, users, getLikes])

  const currentProfile = availableProfiles[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentProfile) return

    setSwipeDirection(direction)

    setTimeout(() => {
      if (direction === "right") {
        addLike(user.id, currentProfile.id)
      }

      setCurrentIndex((prev) => prev + 1)
      setSwipeDirection(null)
    }, 300)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return

    const currentX = e.clientX
    const diff = currentX - startX

    // Swipe right (like)
    if (diff > 100) {
      handleSwipe("right")
      setMouseDown(false)
    }
    // Swipe left (skip)
    else if (diff < -100) {
      handleSwipe("left")
      setMouseDown(false)
    }
  }

  const handleMouseUp = () => {
    setMouseDown(false)
  }

  if (availableProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No More Profiles</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You've swiped through all available profiles. Check back later!
          </p>
          <Button onClick={() => setCurrentIndex(0)} className="bg-rose-500 hover:bg-rose-600 text-white">
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-24">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div
          className={`relative transition-all duration-300 ${
            swipeDirection === "right"
              ? "translate-x-96 rotate-12 opacity-0"
              : swipeDirection === "left"
                ? "-translate-x-96 -rotate-12 opacity-0"
                : "translate-x-0 rotate-0 opacity-100"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Card className="overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing">
            {/* Profile Image */}
            <div className="relative h-96 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center overflow-hidden">
              {currentProfile.profileImage ? (
                <img
                  src={currentProfile.profileImage || "/placeholder.svg"}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl">👤</div>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Profile Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{currentProfile.name}</h2>
                <p className="text-lg opacity-90 mb-3">{currentProfile.age} years old</p>
                <p className="text-sm opacity-80 line-clamp-2">{currentProfile.bio}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 justify-center mt-8">
          <Button
            onClick={() => handleSwipe("left")}
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 p-0 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </Button>

          <Button
            onClick={() => handleSwipe("right")}
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Heart className="w-6 h-6 fill-white" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {currentIndex + 1} of {availableProfiles.length}
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-2">
            <div
              className="bg-rose-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / availableProfiles.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
