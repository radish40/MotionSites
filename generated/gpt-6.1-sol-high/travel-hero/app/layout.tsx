/* eslint-disable @next/next/no-page-custom-font -- The prompt requires Inter via head stylesheet links in the shared App Router layout. */
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import './globals.css';
export const metadata: Metadata = { title: 'Travel — Discover the World', description: 'Escape the ordinary and find inspiration in the most breathtaking corners of the globe.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" className="h-full"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/></head><body className="h-full antialiased" style={{fontFamily:"'Inter', sans-serif"}}><Navbar/>{children}</body></html>;
}
