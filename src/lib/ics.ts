// Hand-written .ics builder — no calendar library. Confirmed data only.

function foldLine(line: string): string {
  return line;
}

function toIcsDate(iso: string): string {
  // iso like "2026-10-09T16:00:00-04:00" -> "20261009T200000Z" (UTC)
  const d = new Date(iso);
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export interface IcsEventInput {
  uid: string;
  title: string;
  description: string;
  location: string;
  startIso: string;
  endIso: string;
}

export function buildIcs(event: IcsEventInput): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nostalgia Fest//Homepage//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(event.startIso)}`,
    `DTEND:${toIcsDate(event.endIso)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n");
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Expo 2026 spans three days with different hours (see docs/event-data.md).
// A single calendar entry covering the full open window is the simplest
// honest representation — Fri 4 PM open to Sun 6 PM close, America/Toronto.
export const EXPO_2026_ICS: IcsEventInput = {
  uid: "nf-expo-2026@nostalgiafest.ca",
  title: "Nostalgia Fest Expo",
  description:
    "Nostalgia Fest Expo: trading cards, toys, comics, artists and collectibles. Free general admission. Fri 4-8 PM, Sat 11 AM-8 PM, Sun 11 AM-6 PM.",
  location: "Square One Event Hall, 199 Rathburn Rd W, Mississauga, Ontario",
  startIso: "2026-10-09T16:00:00-04:00",
  endIso: "2026-10-11T18:00:00-04:00",
};
