import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AudioCleanupProvider } from "@/components/layout/AudioCleanupProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://classic-patents.com"),
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
    "Abraham Lincoln",
    "Elias Howe",
    "Robert Goddard",
    "John Bardeen",
    "Willard Boyle",
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
      "Explore history's most consequential patents decoded into plain English with interactive 3D physical simulations.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
};

// Runs synchronously before first paint so dark-mode users never flash the
// light parchment theme. Falls back to the OS preference when no explicit
// choice is stored. ThemeToggle reads back the resulting DOM state on mount.
const themeInitScript = `(function(){try{var s=localStorage.getItem("classic-patents-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var c=document.documentElement.classList;if(d){c.add("dark")}else{c.remove("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline theme bootstrap string, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AudioCleanupProvider />
        {/* WCAG 2.4.1 bypass block: keyboard/SR users can jump straight to content. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-amber-700 focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 relative z-0 isolate outline-none"
          >
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
