"use client";

import type { LucideIcon } from "lucide-react";
import { BookOpen, MapPin, Star, User } from "lucide-react";

type IconType = "BookOpen" | "User" | "MapPin";

const ICONS = {
  BookOpen,
  User,
  MapPin,
} satisfies Record<IconType, LucideIcon>;

export function IconBadge({ type }: { type: IconType }) {
  const Comp = ICONS[type] ?? BookOpen;
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-black/30 text-oir-cream">
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
