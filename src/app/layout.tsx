import type { Metadata, Viewport } from "next";
import { Outfit, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700"],
});

const source = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Fete Nexus Logistics & Removals",
    template: "%s · Fete Nexus",
  },
  description:
    "Your logistics partner for removals, clearance, delivery and collections across Bradford, Leeds and West Yorkshire.",
  icons: {
    icon: [{ url: "/brand/logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/brand/logo.jpg", type: "image/jpeg" }],
    shortcut: ["/brand/logo.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${outfit.variable} ${source.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
