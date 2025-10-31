"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { DiscoveryPage } from "./discovery-page"
import { MatchesPage } from "./matches-page"
import { ChatPage } from "./chat-page"
import { ProfilePage } from "./profile-page"
import { Button } from "@/components/ui/button"
import { Heart, Users, User, LogOut, Moon, Sun, Bell } from "lucide-react"
import { showNotification, requestNotificationPermission } from "@/lib/notifications"

export function DatingApp() {
  const [currentPage, setCurrentPage] = useState<"discovery" | "matches" | "chat" | "profile">("discovery")
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [chatPeer, setChatPeer] = useState<any | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { user, logout, getMatches } = useAppStore()
  const previousMatchCount = useAppStore((state) => state.matches.length)

  useEffect(() => {
    if (notificationsEnabled && user) {
      const currentMatches = getMatches()
      if (currentMatches.length > 0) {
        showNotification("New Match!", {
          body: "You have a new match! Check it out.",
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' fontSize='75'>❤️</text></svg>",
        })
      }
    }
  }, [notificationsEnabled, user, getMatches])

  const handleLogout = () => {
    logout()
  }

  const handleChatClick = (matchId: string, otherUser: any) => {
    setSelectedMatchId(matchId)
    setChatPeer(otherUser)
    setCurrentPage("chat")
  }

  const handleEnableNotifications = () => {
    requestNotificationPermission()
    setNotificationsEnabled(true)
  }

  const handleGoToDiscovery = () => setCurrentPage("discovery")

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold">HeartMatch</span>
            </div>

            <div className="flex items-center gap-2">
              {!notificationsEnabled && (
                <Button
                  onClick={handleEnableNotifications}
                  variant="ghost"
                  size="sm"
                  className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Enable Notifications
                </Button>
              )}

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {currentPage === "discovery" && <DiscoveryPage />}
          {currentPage === "matches" && <MatchesPage onChatClick={handleChatClick} onGoToDiscovery={handleGoToDiscovery} />}
          {currentPage === "chat" && selectedMatchId && (
            <ChatPage matchId={selectedMatchId} onBack={() => setCurrentPage("matches")} otherUser={chatPeer} />
          )}
          {currentPage === "profile" && <ProfilePage />}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-around h-16">
            <button
              onClick={() => setCurrentPage("discovery")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "discovery"
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs font-medium">Discover</span>
            </button>

            <button
              onClick={() => setCurrentPage("matches")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "matches"
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium">Matches</span>
            </button>

            <button
              onClick={() => setCurrentPage("profile")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === "profile"
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </nav>

        {/* Spacer for bottom nav */}
        <div className="h-20" />
      </div>
    </div>
  )
}
