import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BahFeel - Express Your Emotions",
  description: "A safe space to express emotions through words or images. Get empathetic AI reflections and understand your feelings better. Free, private, and anonymous.",
  keywords: "emotional expression, mental health, AI reflection, emotional support, journaling, image therapy",
  openGraph: {
    title: "BahFeel - Express Your Emotions",
    description: "Express emotions through words or images and receive empathetic AI reflections.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
