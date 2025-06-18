import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import Header from "./components/Header";
import Header from "../components/layout/Header";
import BackgroundParticles from "../components/BackgroundParticles";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Fluxtrade - Professional Trading Dashboard & Analytics",
    template: "%s | Fluxtrade Trading"
  },
  description: "Advanced trading dashboard with real-time market data, strategies, and analytics for professional traders and investors.",
  keywords: ["trading", "dashboard", "analytics", "market data", "trading strategies", "investment", "finance"],
  authors: [{ name: "Fluxtrade Team" }],
  creator: "Fluxtrade",
  publisher: "Fluxtrade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fluxtrade.vercel.app'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fluxtrade.vercel.app',
    title: 'Fluxtrade - Professional Trading Dashboard & Analytics',
    description: 'Advanced trading dashboard with real-time market data, strategies, and analytics for professional traders and investors.',
    siteName: 'Fluxtrade Trading',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fluxtrade Trading Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluxtrade - Professional Trading Dashboard & Analytics',
    description: 'Advanced trading dashboard with real-time market data, strategies, and analytics for professional traders and investors.',
    creator: '@fluxtrade_trading', // Replace with your Twitter handle
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <BackgroundParticles />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
