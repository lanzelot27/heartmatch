import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  password: string
  name: string
  age: number
  bio: string
  profileImage: string
  createdAt: string
}

export interface Match {
  id: string
  userId1: string
  userId2: string
  createdAt: string
}

export interface Message {
  id: string
  matchId: string
  senderId: string
  text: string
  createdAt: string
}

export interface Like {
  userId: string
  likedUserId: string
  createdAt: string
}

interface AppStore {
  user: User | null
  users: User[]
  matches: Match[]
  messages: Message[]
  likes: Like[]
  register: (user: User) => void
  login: (email: string, password: string) => boolean
  logout: () => void
  addLike: (userId: string, likedUserId: string) => void
  removeLike: (userId: string, likedUserId: string) => void
  createMatch: (userId1: string, userId2: string) => void
  removeMatch: (matchId: string) => void
  addMessage: (matchId: string, senderId: string, text: string) => void
  getMatches: () => Match[]
  getMessages: (matchId: string) => Message[]
  getLikes: (userId: string) => string[]
  hasLiked: (userId: string, likedUserId: string) => boolean
  getMutualLike: (userId: string, otherUserId: string) => boolean
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User",
    age: 28,
    bio: "Demo account for testing",
    profileImage: "/diverse-woman-smiling.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "alice@example.com",
    password: "alice123",
    name: "Alice",
    age: 26,
    bio: "Love hiking and coffee",
    profileImage: "/woman-hiking.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "bob@example.com",
    password: "bob123",
    name: "Bob",
    age: 29,
    bio: "Tech enthusiast and foodie",
    profileImage: "/man-tech.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    email: "carol@example.com",
    password: "carol123",
    name: "Carol",
    age: 25,
    bio: "Artist and dog lover",
    profileImage: "/woman-artist.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    email: "david@example.com",
    password: "david123",
    name: "David",
    age: 30,
    bio: "Photographer and traveler",
    profileImage: "/man-photographer.png",
    createdAt: new Date().toISOString(),
  },
]

const mockMatches: Match[] = [
  {
    id: "match-1",
    userId1: "1",
    userId2: "2",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

const mockMessages: Message[] = [
  {
    id: "msg-1",
    matchId: "match-1",
    senderId: "2",
    text: "Hey! How's your day going?",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "msg-2",
    matchId: "match-1",
    senderId: "1",
    text: "Pretty good! Just finished a project at work. How about you?",
    createdAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "msg-3",
    matchId: "match-1",
    senderId: "2",
    text: "Nice! I'm planning a hiking trip this weekend. Would love some company!",
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: "msg-4",
    matchId: "match-1",
    senderId: "1",
    text: "That sounds amazing! I'd love to join. Where are you thinking?",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

const mockLikes: Like[] = [
  {
    userId: "1",
    likedUserId: "2",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    userId: "2",
    likedUserId: "1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      users: mockUsers,
      matches: mockMatches,
      messages: mockMessages,
      likes: mockLikes,

      register: (newUser) => {
        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
        }))
      },

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password)
        if (user) {
          set({ user })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null })
      },

      addLike: (userId, likedUserId) => {
        set((state) => ({
          likes: [...state.likes, { userId, likedUserId, createdAt: new Date().toISOString() }],
        }))

        // Check for mutual like
        const { getMutualLike, createMatch } = get()
        if (getMutualLike(userId, likedUserId)) {
          createMatch(userId, likedUserId)
        }
      },

      removeLike: (userId, likedUserId) => {
        set((state) => ({
          likes: state.likes.filter((like) => !(like.userId === userId && like.likedUserId === likedUserId)),
        }))
      },

      createMatch: (userId1, userId2) => {
        const { matches } = get()
        const alreadyMatched = matches.some(
          (m) => (m.userId1 === userId1 && m.userId2 === userId2) || (m.userId1 === userId2 && m.userId2 === userId1),
        )

        if (!alreadyMatched) {
          set((state) => ({
            matches: [
              ...state.matches,
              {
                id: Date.now().toString(),
                userId1,
                userId2,
                createdAt: new Date().toISOString(),
              },
            ],
          }))
        }
      },

      removeMatch: (matchId) => {
        set((state) => ({
          matches: state.matches.filter((m) => m.id !== matchId),
          messages: state.messages.filter((msg) => msg.matchId !== matchId),
        }))
      },

      addMessage: (matchId, senderId, text) => {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              matchId,
              senderId,
              text,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      getMatches: () => {
        const { user, matches } = get()
        if (!user) return []
        return matches.filter((m) => m.userId1 === user.id || m.userId2 === user.id)
      },

      getMessages: (matchId) => {
        return get().messages.filter((m) => m.matchId === matchId)
      },

      getLikes: (userId) => {
        return get()
          .likes.filter((like) => like.userId === userId)
          .map((like) => like.likedUserId)
      },

      hasLiked: (userId, likedUserId) => {
        return get().likes.some((like) => like.userId === userId && like.likedUserId === likedUserId)
      },

      getMutualLike: (userId, otherUserId) => {
        const { hasLiked } = get()
        return hasLiked(userId, otherUserId) && hasLiked(otherUserId, userId)
      },
    }),
    {
      name: "dating-app-store",
    },
  ),
)
