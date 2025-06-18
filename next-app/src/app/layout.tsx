import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from "./components/Header";
import BackgroundParticles from "./components/BackgroundParticles";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Quantix - Professional Trading Dashboard & Analytics",
    template: "%s | Quantix Trading"
  },
  description: "Professional trading dashboard with real-time analytics, market insights, trading strategies, and community-driven content. Access advanced trading tools, portfolio tracking, and expert analysis.",
  keywords: [
    "trading dashboard",
    "stock market analysis",
    "portfolio tracking",
    "trading strategies",
    "market analytics",
    "financial tools",
    "investment platform",
    "trading community",
    "market insights",
    "trading education"
  ],
  authors: [{ name: "Quantix Team" }],
  creator: "Quantix",
  publisher: "Quantix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://quantix-trading.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quantix-trading.com',
    title: 'Quantix - Professional Trading Dashboard & Analytics',
    description: 'Professional trading dashboard with real-time analytics, market insights, trading strategies, and community-driven content.',
    siteName: 'Quantix Trading',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Quantix Trading Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantix - Professional Trading Dashboard & Analytics',
    description: 'Professional trading dashboard with real-time analytics, market insights, trading strategies, and community-driven content.',
    images: ['/og-image.jpg'], // Same image as Open Graph
    creator: '@quantix_trading', // Replace with your Twitter handle
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
