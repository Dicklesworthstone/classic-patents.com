import type { Metadata } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Classic Patents — Historical Technical Patent Museum & Dual-Projection Archive",
    template: "%s | Classic Patents",
  },
  description:
    "An open-source digital museum restoring history's most consequential patents into verified transcripts, full original PDFs, rigorous Plain English engineering breakdowns, and interactive 3D physical simulations.",
  keywords: [
    "Patents",
    "Wright Flyer",
    "Nikola Tesla",
    "Thomas Edison",
    "Alexander Graham Bell",
    "Philo Farnsworth",
    "Robert Noyce",
    "Samuel Morse",
    "Charles Goodyear",
    "Guglielmo Marconi",
    "Hedy Lamarr",
    "Integrated Circuit",
    "Kevlar",
    "Microwave Oven",
    "Engineering History",
    "Physics Simulations",
    "Three.js",
  ],
  authors: [{ name: "Jeffrey Emanuel", url: "https://github.com/Dicklesworthstone" }],
  openGraph: {
    title: "Classic Patents — Historical Technical Patent Museum",
    description:
      "Explore history's most consequential patents decoded into plain English with interactive 3D physical simulations and verified transcripts.",
    url: "https://classic-patents.com",
    siteName: "Classic Patents",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Classic Patents — Historical Technical Patent Museum",
    description:
      "Interactive 3-axis flight sims, polyphase AC vector fields, and plain-English deconstructions of history's greatest patents.",
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
      className={`${ebGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} theme-parchment`}
    >
      <body className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
