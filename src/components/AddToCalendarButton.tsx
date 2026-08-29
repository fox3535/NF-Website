"use client";

import { buildIcs, downloadIcs, EXPO_2026_ICS } from "@/lib/ics";

export default function AddToCalendarButton({
  className,
}: {
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        downloadIcs("nostalgia-fest-expo-2026.ics", buildIcs(EXPO_2026_ICS))
      }
      className={className}
    >
      Add to calendar
    </button>
  );
}
