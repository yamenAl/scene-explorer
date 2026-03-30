import type { Metadata } from "next";
import { Geist_Mono, Inter, Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND} — Immersive 3D scene`,
  description:
    "Cyberpunk-styled landing and browser-native 3D gaussian splat exploration.",
  openGraph: {
    title: `${BRAND} — Immersive 3D scene`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orbitron.variable} ${shareTechMono.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
