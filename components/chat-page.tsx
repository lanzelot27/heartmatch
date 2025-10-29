"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"

interface ChatPageProps {
  matchId: string
  onBack?: () => void
}

export function ChatPage({ matchId, onBack }: ChatPageProps) {
  const { user, users, getMessages, addMessage } = useAppStore()
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = getMessages(matchId)

  // Get match details
  const match = useAppStore((state) => state.matches.find((m) => m.id === matchId))
  const otherUserId = match?.userId1 === user?.id ? match?.userId2 : match?.userId1
  const otherUser = users.find((u) => u.id === otherUserId)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !user) return

    addMessage(matchId, user.id, messageText)
    setMessageText("")
  }

  if (!user || !otherUser) return null

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
          {otherUser.profileImage && (
            <img
              src={otherUser.profileImage || "/placeholder.svg"}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">{otherUser.name}</h2>
            <p className="text-xs text-muted-foreground">{otherUser.age} years old</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
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
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${isOwn ? "text-rose-100" : "text-slate-500 dark:text-slate-400"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
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
