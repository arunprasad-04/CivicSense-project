import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CivicSense - AI Urban Infrastructure Reporting',
  description: 'Report and predict urban infrastructure issues with AI-powered analysis',
  keywords: 'civic tech, infrastructure, reporting, AI, urban, damage detection',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Navbar />
        <main className="flex-1 w-full bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-12">{children}</div>
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
