"use client";
import { useState } from "react";

const ICON_PATHS: Record<string, string> = {
  BookOpen: "M4 5h8l4 3v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
  User: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 1.79-8 4v1h16v-1c0-2.21-3.67-4-8-4z",
  MapPin: "M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z",
};

type IconType = "BookOpen" | "User" | "MapPin";

export function IconBadge({ type }: { type: IconType }) {
  const path = ICON_PATHS[type] ?? ICON_PATHS.BookOpen;
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-black/30 text-oir-cream">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </span>
  );
}

export function StarToggle() {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setActive((prev) => !prev)}
      className="ml-2 text-gold transition-opacity hover:opacity-80"
      aria-label={active ? "Remove favorite" : "Add favorite"}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? 0 : 2}
      >
        <path d="M12 3.5 14.6 9l5.4.8-3.9 3.8.9 5.4-4.9-2.6-4.9 2.6.9-5.4-3.9-3.8L9.4 9 12 3.5z" />
      </svg>
    </button>
  );
}
