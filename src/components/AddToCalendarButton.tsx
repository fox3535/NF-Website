"use client";

import { buildIcs, downloadIcs, type IcsEventInput } from "@/lib/ics";

export default function AddToCalendarButton({
  event,
  filename,
  className,
}: {
  event: IcsEventInput;
  filename: string;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadIcs(filename, buildIcs(event))}
      className={className}
    >
      Add to calendar
    </button>
  );
}
