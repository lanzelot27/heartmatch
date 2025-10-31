"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, X } from "lucide-react"
import { getProfiles, postLike, getLikesForUser } from '@/lib/utils'
import { showNotification, isNotificationEnabled } from '@/lib/notifications'
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";


export function DiscoveryPage() {
  const { user } = useAppStore()
  const [profiles, setProfiles] = useState<any[]>([])
  const [userLikes, setUserLikes] = useState<string[]>([])
  const [passes, setPasses] = useState<string[]>([])
  const [swipeCount, setSwipeCount] = useState(0)
  const [initialTotal, setInitialTotal] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [likeMsg, setLikeMsg] = useState<string | null>(null)

  const initialTotalRef = useRef(0)
  const inSwipe = useRef(false)
  const [cardKey, setCardKey] = useState(0) // to force-card-remount for animation

  // Load passes from localStorage
  useEffect(() => {
    if (!user) return;
    const key = `heartmatch-passes-${user.id}`;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    setPasses(saved ? JSON.parse(saved) : []);
    setSwipeCount(0);
    setCurrentIndex(0);
  }, [user])

  // Always recompute availableProfiles
  const availableProfiles = useMemo(() => {
    return profiles.filter((u: any) => u.id !== user?.id && !userLikes.includes(u.id) && !passes.includes(u.id))
  }, [profiles, userLikes, passes, user])

  // On any user or full reload: fetch backend state, fix denominator.
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const data = await getProfiles();
      setProfiles(data.filter((u: any) => u.id !== user.id));
      const likes = await getLikesForUser(user.id);
      setUserLikes(Array.isArray(likes) ? likes : []);
      // reset everything
      setSwipeCount(0);
      setCurrentIndex(0);
      // Initial denominator should only consider available-at-load
      const skip = typeof window !== 'undefined' ? localStorage.getItem(`heartmatch-passes-${user.id}`) : null;
      const passIds = skip ? JSON.parse(skip) : [];
      const initialAvail = data.filter((u: any) => u.id !== user.id && !(Array.isArray(likes) ? likes.includes(u.id) : false) && !passIds.includes(u.id));
      setInitialTotal(initialAvail.length);
      initialTotalRef.current = initialAvail.length;
    }
    fetchData();
  }, [user]);

  const savePass = (id: string) => {
    if (!user) return;
    const key = `heartmatch-passes-${user.id}`;
    setPasses(prev => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  }

  const handleSwipe = async (direction: "left" | "right") => {
    if (!availableProfiles.length || !user || inSwipe.current) return;
    inSwipe.current = true;
    setSwipeDirection(direction);

    const targetId = availableProfiles[0]?.id as string;
    // Trigger animation
    setCardKey(key => key + 1);

    // If like
    if (direction === "right") {
      setUserLikes(likes => [...likes, targetId])
      try {
        const res = await postLike(user.id, targetId);
        if (res && res.match) {
          setLikeMsg("It's a Match!");
          // Show notification for new match
          if (isNotificationEnabled()) {
            const matchedUserName = currentProfile.name || "Someone"
            showNotification("New Match! ❤️", {
              body: `You matched with ${matchedUserName}!`,
              icon: "/favicon.svg",
            })
          }
        }
        const likes = await getLikesForUser(user.id);
        setUserLikes(Array.isArray(likes) ? likes : []);
      } catch {
        setUserLikes(likes => likes.filter(id => id !== targetId));
        setLikeMsg("Error liking profile");
      }
    } else {
      savePass(targetId);
    }

    setTimeout(() => {
      setSwipeCount(cnt => cnt + 1);
      setSwipeDirection(null);
      setLikeMsg(null);
      inSwipe.current = false;
    }, 340);
  }

  // Mouse/touch events
  const handleMouseDown = (e: React.MouseEvent) => { if (swipeDirection) return; setMouseDown(true); setStartX(e.clientX) }
  const handleMouseMove = (e: React.MouseEvent) => { if (!mouseDown || swipeDirection) return
    const diff = e.clientX - startX
    if (diff > 100) { handleSwipe("right"); setMouseDown(false) }
    else if (diff < -100) { handleSwipe("left"); setMouseDown(false) } }
  const handleMouseUp = () => setMouseDown(false)

  const currentProfile = availableProfiles[0] || null;
  const progNum = Math.min(swipeCount + 1, Math.max(initialTotal, 1));
  const progDen = Math.max(initialTotal, 1);
  const x = useMotionValue(0);
const rotate = useTransform(x, [-200, 200], [-20, 20]); // maps drag distance to rotation


  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No More Profiles</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You've swiped through all available profiles. Check back later!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-24">
      <div className="w-full max-w-md">
        {/* Card with framer-motion animation */}
        <AnimatePresence initial={false} custom={swipeDirection}>
  <motion.div
    key={currentProfile.id + ":" + cardKey}
    className="relative"
    custom={swipeDirection}
    initial={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
    animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
    exit={{
      x: swipeDirection === "right" ? 400 : swipeDirection === "left" ? -400 : 0,
      rotate: swipeDirection === "right" ? 25 : swipeDirection === "left" ? -25 : 0,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.35, ease: "easeInOut" },
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseUp}
    style={{ cursor: swipeDirection ? "grabbing" : "grab" }}
  >
    <Card className="overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing">
    <motion.div
  className="relative h-96 bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center overflow-hidden"
  drag={!swipeDirection}
  style={{ x, rotate }}
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={1}
  onDragEnd={(e, info) => {
    if (info.offset.x > 120) handleSwipe("right");
    else if (info.offset.x < -120) handleSwipe("left");
  }}
>
        {currentProfile.profileImage ? (
          <img
            src={currentProfile.profileImage || "/placeholder.svg"}
            alt={currentProfile.name || "Profile"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center"><div className="text-6xl">👤</div></div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">{currentProfile.name ?? ""}</h2>
          <p className="text-lg opacity-90 mb-3">{currentProfile.age ?? ""} years old</p>
          <p className="text-sm opacity-80 line-clamp-2">{currentProfile.bio ?? ""}</p>
        </div>
      </motion.div>
    </Card>
  </motion.div>
</AnimatePresence>

        {likeMsg && (
          <div className="py-4 text-center">
            <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-100 px-4 py-2 rounded-xl font-medium animate-bounce">{likeMsg}</span>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-6 justify-center mt-8">
          <Button
            onClick={() => handleSwipe("left")}
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 p-0 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            disabled={!!swipeDirection}
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button
            onClick={() => handleSwipe("right")}
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-rose-500 hover:bg-rose-600 text-white"
            disabled={!!swipeDirection}
          >
            <Heart className="w-6 h-6 fill-white" />
          </Button>
        </div>
        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {availableProfiles.length === 0 ? progDen : progNum} of {progDen}
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-2">
            <div
              className="bg-rose-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progDen ? ((Math.min(progNum, progDen)) / progDen) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
