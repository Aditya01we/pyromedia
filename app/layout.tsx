import type { Metadata } from "next";
import { Geist, Geist_Mono, Abril_Fatface, Chathura, Inter, Playfair_Display, Tapestry, Yeseva_One } from "next/font/google";
import "./globals.css";
import SplashCursor from "./components/SplashCursor";
import ClientWrapper from "./components/ClientWrapper";
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  variable: "--font-abril-fatface",
  subsets: ["latin"],
  weight: "400",
});

const chathura = Chathura({
  variable: "--font-chathura",
  subsets: ["latin"],
  weight: ["300", "400", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700", "900"],
});

const tapestry = Tapestry({
  variable: "--font-tapestry",
  subsets: ["latin"],
  weight: "400",
});

const yesevaOne = Yeseva_One({
  variable: "--font-yeseva-one",
  subsets: ["latin"],
  weight: "400",
});

// Local tracker while developing, the deployed one everywhere else.
const TRACKER_SRC =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/tracker.js"
    : "https://visitors-tracker-lyart.vercel.app/tracker.js";

export const metadata: Metadata = {
  title: "Pyro Media — We Script Blockbusters",
  description: "Forget boring commercials. We create data-driven influencer campaigns that turn brands into protagonists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${abrilFatface.variable} ${chathura.variable} ${inter.variable} ${playfairDisplay.variable} ${tapestry.variable} ${yesevaOne.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src={TRACKER_SRC}
          data-require-consent="true"
          data-capture-forms="true"
          data-capture-autofill="true"
          data-location-on-consent="true"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#051c0e]">
        <ClientWrapper>
          <SplashCursor
            DENSITY_DISSIPATION={1.8}
            VELOCITY_DISSIPATION={1.8}
            PRESSURE={0.5}
            CURL={21}
            SPLAT_RADIUS={0.18}
            RAINBOW_MODE={false}
            COLOR="#1CB354"
          />
          {children}
        </ClientWrapper>
        <CookieBanner />
      </body>
    </html>
  );
}
