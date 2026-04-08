import "./globals.css";
import { Nunito, Magra } from "next/font/google";

const NunitoFont = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const MagraFont = Magra({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-magra",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/images/wander_logo_colorful.png" />
        <link rel="apple-touch-icon" href="/images/wander_logo_colorful.png" />
        <meta name="apple-itunes-app" content="app-id=6474634049" />
      </head>
      <body className={`${NunitoFont.className} ${MagraFont.variable}`}>{children}</body>
    </html>
  );
}
