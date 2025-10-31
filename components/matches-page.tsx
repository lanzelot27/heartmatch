"use client"

import { useEffect, useState } from 'react';
import { getMatchesForUser, getProfiles } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MatchesPageProps {
  onChatClick: (matchId: string, otherUser: any) => void;
  onGoToDiscovery?: () => void;
}

export function MatchesPage({ onChatClick, onGoToDiscovery }: MatchesPageProps) {
  const { user } = useAppStore();
  const [matches, setMatches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState(false);
  const [matchToUnmatch, setMatchToUnmatch] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      setLoading(true);
      const [ms, us] = await Promise.all([
        getMatchesForUser(user.id),
        getProfiles(),
      ]);
      if (!mounted) return;
      setMatches(ms);
      setUsers(us);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const handleUnmatchClick = (matchId: string) => {
    setMatchToUnmatch(matchId);
    setUnmatchDialogOpen(true);
  };

  const handleUnmatchConfirm = async () => {
    if (!matchToUnmatch) return;
    try {
      const API = process.env.NEXT_PUBLIC_API_URL!;
      await fetch(`${API}/matches/${matchToUnmatch}`, { method: 'DELETE' });
      setMatches((prev) => prev.filter((m) => m.id !== matchToUnmatch));
      setUnmatchDialogOpen(false);
      setMatchToUnmatch(null);
    } catch (error) {
      console.error('Failed to unmatch:', error);
    }
  };

  if (!user) return null;
  if (loading) return <div className="p-12 text-center">Loading...</div>;

  // Get match details
  const matchDetails = matches.map((match) => {
    const otherUserId = match.userAId === user.id ? match.userBId : match.userAId;
    const otherUser = users.find((u) => u.id === otherUserId);
    return { match, otherUser };
  });

  if (matchDetails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Matches Yet</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Start swiping to find your perfect match!</p>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white" onClick={onGoToDiscovery}>Go to Discovery</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-8">Your Matches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchDetails.map(({ match, otherUser }) => (
            <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white" />
                  Matched
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{otherUser?.name}</h3>
                <p className="text-rose-500 font-semibold mb-3">{otherUser?.age} years old</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{otherUser?.bio}</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => otherUser && onChatClick(match.id, otherUser)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </Button>
                  <Button
                    onClick={() => handleUnmatchClick(match.id)}
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

      <AlertDialog open={unmatchDialogOpen} onOpenChange={setUnmatchDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to unmatch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You will no longer be able to see or message this person.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnmatchConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Unmatch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
