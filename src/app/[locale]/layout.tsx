import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Naufal Adib Syahrizal | Creative Professional",
  description: "Portfolio & Service Platform — Graphic Design, Illustration, Photography, Video Editing. Premium creative services by Naufal Adib Syahrizal.",
  keywords: ["portfolio", "graphic design", "illustration", "photography", "video editing", "creative", "Naufal Adib"],
  openGraph: {
    title: "Naufal Adib Syahrizal | Creative Professional",
    description: "Premium creative services — Graphic Design, Illustration, Photography, Video Editing.",
    type: "website",
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Script from 'next/script';

import SpaceAmbience from "@/components/SpaceAmbience";
import { AudioProvider } from "@/components/AudioContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <AudioProvider>
            <div className="noise-overlay" />
            {children}
            <SpaceAmbience />
          </AudioProvider>
        </NextIntlClientProvider>
        {/* Midtrans Snap.js — loaded before interactive for payment pages */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
