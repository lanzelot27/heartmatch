"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Trash2 } from "lucide-react"

interface MatchesPageProps {
  onChatClick: (matchId: string) => void
}

export function MatchesPage({ onChatClick }: MatchesPageProps) {
  const { user, users, getMatches, removeMatch } = useAppStore()

  if (!user) return null

  const userMatches = getMatches()

  // Get match details
  const matchDetails = userMatches.map((match) => {
    const otherUserId = match.userId1 === user.id ? match.userId2 : match.userId1
    const otherUser = users.find((u) => u.id === otherUserId)
    return { match, otherUser }
  })

  if (matchDetails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Matches Yet</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Start swiping to find your perfect match!</p>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white">Go to Discovery</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Matches</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchDetails.map(({ match, otherUser }) => (
          <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Match Image */}
            <div className="relative h-64 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center overflow-hidden">
              {otherUser?.profileImage ? (
                <img
                  src={otherUser.profileImage || "/placeholder.svg"}
                  alt={otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">👤</div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Match Badge */}
              <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Heart className="w-4 h-4 fill-white" />
                Matched
              </div>
            </div>

            {/* Match Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{otherUser?.name}</h3>
              <p className="text-rose-500 font-semibold mb-3">{otherUser?.age} years old</p>

              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{otherUser?.bio}</p>

              <div className="flex gap-3">
                <Button
                  onClick={() => onChatClick(match.id)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>

                <Button
                  onClick={() => removeMatch(match.id)}
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Unmatch
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
