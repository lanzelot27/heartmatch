"use client"

import type React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Edit2, Save, X } from "lucide-react"
import { updateProfile } from '@/lib/utils';

export function ProfilePage() {
  const { user, users } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedAge, setEditedAge] = useState(user?.age != null ? user.age.toString() : "");
  const [editedBio, setEditedBio] = useState(user?.bio || "")
  const [editedImage, setEditedImage] = useState(user?.profileImage || "")

  if (!user) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(user.id, {
        name: editedName,
        age: Number.parseInt(editedAge),
        bio: editedBio,
        profileImage: editedImage,
      });
      useAppStore.setState({ user: updatedUser });
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="relative">
          {/* Profile Image */}
          <div className="relative h-64 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center overflow-hidden">
            {editedImage ? (
              <img src={editedImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-6xl">📷</div>
                <p className="text-slate-500 dark:text-slate-400 mt-2">No photo</p>
              </div>
            )}

            {isEditing && (
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="text-white font-semibold">Change Photo</span>
              </label>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
                  <Input
                    type="number"
                    value={editedAge}
                    onChange={(e) => setEditedAge(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSave} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setEditedName(user.name)
                      setEditedAge(user.age.toString())
                      setEditedBio(user.bio)
                      setEditedImage(user.profileImage)
                    }}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h2>
                <p className="text-lg text-rose-500 font-semibold mb-4">{user.age} years old</p>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{user.bio || "No bio added yet"}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
