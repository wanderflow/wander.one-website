import "./globals.css";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hero-headline",
});

export const metadata = {
  metadataBase: new URL("https://wander.one"),
  title: "Wander Social",
  description:
    "Explore a diverse range of trending topics within your community, where you can engage directly with your peers.",
  openGraph: {
    type: "website",
    siteName: "Wander",
    title: "Wander Social",
    description:
      "Explore a diverse range of trending topics within your community, where you can engage directly with your peers.",
    images: [{ url: "/images/wander_logo_colorful.png", alt: "Wander" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wander Social",
    description:
      "Explore a diverse range of trending topics within your community, where you can engage directly with your peers.",
    images: ["/images/wander_logo_colorful.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/images/wander_logo_colorful.png" />
          <link rel="apple-touch-icon" href="/images/wander_logo_colorful.png" />
          <meta name="apple-itunes-app" content="app-id=6474634049" />
          <link
            rel="preconnect"
            href="https://fonts.cdnfonts.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.cdnfonts.com/css/lazy-dog"
            rel="stylesheet"
          />
        </head>
        <body className={`${plusJakartaSans.className} ${outfit.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
