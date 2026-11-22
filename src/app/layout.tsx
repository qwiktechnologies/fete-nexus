import type { Metadata, Viewport } from "next";
import { Outfit, Poppins, Source_Sans_3 } from "next/font/google";
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

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Fete Nexus Logistics & Removals",
    template: "%s · Fete Nexus",
  },
  description:
    "Your logistics partner for removals, clearance, delivery and collections across Bradford, Leeds and West Yorkshire.",
  icons: {
    icon: [{ url: "/figma/brand/logo.png", type: "image/png" }],
    apple: [{ url: "/figma/brand/logo.png", type: "image/png" }],
    shortcut: ["/figma/brand/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#12355B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${outfit.variable} ${source.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
