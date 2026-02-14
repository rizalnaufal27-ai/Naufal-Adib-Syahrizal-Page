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

import SpaceAmbience from "@/components/SpaceAmbience";

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
          <div className="noise-overlay" />
          {children}
          <SpaceAmbience />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
