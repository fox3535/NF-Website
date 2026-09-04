import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// One family, two axes. The width axis gives display type an editorial
// condensed voice and utility labels an expanded one, so the page has
// typographic personality without a second font download.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nostalgiafest.ca"),
  title: "Nostalgia Fest: Trading Cards, Collectibles & Pop Culture",
  description:
    "Nostalgia Fest is a GTA event for trading cards, collectibles, toys, artists and pop culture. Free general admission at the next Nostalgia Fest Expo, October 9 to 11, 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="bg-paper font-sans text-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-text-inverse"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
