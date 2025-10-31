import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const API = process.env.NEXT_PUBLIC_API_URL!;

export async function getProfiles() {
  const res = await fetch(`${API}/profiles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}

export async function loginProfile(email: string, password: string) {
  const res = await fetch(`${API}/profiles/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid email or password');
  return res.json();
}

export async function createProfile(data: { email: string; name?: string; bio?: string; profileImage?: string; age: number; password: string }) {
  const res = await fetch(`${API}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create profile');
  return res.json();
}

export async function updateProfile(id: string, data: { name?: string; age?: number; bio?: string; profileImage?: string }) {
  const res = await fetch(`${API}/profiles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function getLikesForUser(userId: string) {
  const res = await fetch(`${API}/likes?userId=${userId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch likes');
  return res.json();
}

export async function postLike(fromId: string, toId: string) {
  const res = await fetch(`${API}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromId, toId }),
  });
  if (!res.ok) throw new Error('Failed to like');
  return res.json();
}

export async function getMatchesForUser(userId: string) {
  const res = await fetch(`${API}/matches?userId=${userId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch matches');
  return res.json();
}

// Chat APIs
export async function getMessagesByMatch(matchId: string) {
  const res = await fetch(`${API}/messages?matchId=${matchId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(matchId: string, senderId: string, content: string) {
  const res = await fetch(`${API}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, senderId, content }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}
