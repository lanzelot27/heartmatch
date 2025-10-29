"use client"

import { Button } from "@/components/ui/button"
import { Heart, Zap, MessageCircle } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-rose-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">HeartMatch</span>
          </div>
          <Button onClick={onGetStarted} className="bg-rose-500 hover:bg-rose-600 text-white">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 text-balance">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto text-balance">
            Connect with people who share your interests. Swipe, match, and start meaningful conversations.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Smart Matching</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Our algorithm helps you find compatible matches based on your preferences and interests.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Quick Swipe</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Swipe right to like or left to skip. It's fast, fun, and intuitive.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Real Connections</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Chat with your matches and build meaningful connections.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-200 dark:border-slate-800 mt-20 py-8 text-center text-slate-600 dark:text-slate-400">
        <p>© 2025 HeartMatch. All rights reserved.</p>
      </footer>
    </div>
  )
}
