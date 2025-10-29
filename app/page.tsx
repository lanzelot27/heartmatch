"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { AuthPage } from "@/components/auth-page"
import { DatingApp } from "@/components/dating-app"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const { user } = useAppStore()
  const [showAuth, setShowAuth] = useState(false)

  if (!user) {
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />
  }

  return <DatingApp />
}
