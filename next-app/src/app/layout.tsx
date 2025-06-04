import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from "./components/Header";
import BackgroundParticles from "./components/BackgroundParticles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Trading Platform",
  description: "Professional trading dashboard with real-time analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundParticles />
        <Header />
        {children}
      </body>
    </html>
  );
}
