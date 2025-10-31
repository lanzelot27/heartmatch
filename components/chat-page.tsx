"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import { getMessagesByMatch } from "@/lib/utils"
import { io, Socket } from "socket.io-client"
import { showNotification, isNotificationEnabled } from "@/lib/notifications"

interface ChatPageProps {
  matchId: string
  onBack?: () => void
  otherUser?: { id: string; name?: string; age?: number; profileImage?: string; bio?: string } | null
}

export function ChatPage({ matchId, onBack, otherUser }: ChatPageProps) {
  const { user, users } = useAppStore()
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Array<{ id: string; matchId: string; senderId: string; content: string; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)
  const socketRef = useRef<Socket | null>(null)

  // Resolve header user fallback from store if not provided
  let headerUser = otherUser || null
  if (!headerUser) {
    const match = useAppStore((state) => state.matches.find((m) => m.id === matchId))
    const otherUserId = match?.userId1 === user?.id ? match?.userId2 : match?.userId1
    headerUser = users.find((u) => u.id === otherUserId) || null
  }

  // Load initial messages and set up WebSocket connection
  useEffect(() => {
    if (!matchId || !user) return

    async function load() {
      setLoading(true)
      try {
        const data = await getMessagesByMatch(matchId)
        setMessages(data)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Connect to WebSocket
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    // Join the match room
    socket.emit('join-room', { matchId })

    // Listen for new messages
    socket.on('new-message', (message: { id: string; matchId: string; senderId: string; content: string; createdAt: string }) => {
      setMessages((prev) => {
        // Avoid duplicates by ID
        if (prev.some((m) => m.id === message.id)) return prev
        // If this is our own message (optimistic), replace the temp one with the real one
        if (message.senderId === user?.id) {
          const tempMsg = prev.find((m) => m.id.startsWith('tmp-') && m.content === message.content && m.senderId === message.senderId)
          if (tempMsg) {
            return prev.map((m) => (m.id === tempMsg.id ? message : m))
          }
        }
        // Show notification for messages from others (only if window is not focused/visible)
        if (message.senderId !== user?.id && isNotificationEnabled()) {
          const otherUserName = headerUser?.name || "Someone"
          // Only show notification if tab/window is not visible
          if (document.hidden) {
            showNotification(`New message from ${otherUserName}`, {
              body: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
              icon: "/favicon.svg",
            })
          }
        }
        return [...prev, message]
      })
    })

    // Cleanup on unmount
    return () => {
      socket.emit('leave-room', { matchId })
      socket.disconnect()
    }
  }, [matchId, user])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !user || !socketRef.current) return

    const tempId = `tmp-${Date.now()}`
    const optimistic = {
      id: tempId,
      matchId,
      senderId: user.id,
      content: messageText,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setMessageText("")

    try {
      // Send via WebSocket (which will also save to DB and broadcast)
      socketRef.current.emit('send-message', {
        matchId,
        senderId: user.id,
        content: optimistic.content,
      })

      // The real message will come via 'new-message' event and replace the optimistic one automatically
      // Fallback: remove optimistic message after 3 seconds if real one never arrives (error case)
      setTimeout(() => {
        setMessages((prev) => {
          const hasReal = prev.some((m) => m.matchId === matchId && m.content === optimistic.content && m.senderId === user.id && !m.id.startsWith('tmp-'))
          if (!hasReal) {
            // Message failed, revert
            return prev.filter((m) => m.id !== tempId)
          }
          return prev
        })
      }, 3000)
    } catch {
      // Revert on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setMessageText(optimistic.content)
    }
  }

  if (!user || !headerUser) return null

  // --- Group messages by day and render date separators ---
  const formatDay = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
  }
  const grouped = messages.reduce((acc: Record<string, typeof messages>, m) => {
    const key = formatDay(m.createdAt)
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})
  const dayKeys = Object.keys(grouped)

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 flex-1">
          {headerUser.profileImage && (
            <img
              src={headerUser.profileImage || "/placeholder.svg"}
              alt={headerUser.name || "Match"}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">{headerUser.name || "Match"}</h2>
            {headerUser.age != null && <p className="text-xs text-muted-foreground">{headerUser.age} years old</p>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation!</p>
            </div>
          </div>
        ) : (
          dayKeys.map((day) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center justify-center">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  {day}
                </span>
              </div>
              {grouped[day].map((message) => {
                const isOwn = message.senderId === user.id
                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isOwn
                          ? "bg-rose-500 text-white rounded-br-none"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? "text-rose-100" : "text-slate-500 dark:text-slate-400"}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
          />
          <Button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
