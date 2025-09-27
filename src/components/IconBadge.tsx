"use client";
import type { LucideIcon } from "lucide-react";
import { BookOpen, User, MapPin, Star } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { BookOpen, User, MapPin };

export function IconBadge({ type }: { type: "BookOpen" | "User" | "MapPin" }) {
  const Comp = ICONS[type] ?? BookOpen;
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/30 border border-gold text-oir-cream">
      <Comp size={16} />
    </span>
  );
}

export function StarToggle() {
  return (
    <button className="ml-2 text-gold hover:opacity-80" aria-label="favorite">
      <Star size={16} />
    </button>
  );
}
