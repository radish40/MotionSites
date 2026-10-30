import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Michael Smith — Portfolio', description: 'Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-theme="dark"><body className="font-body">{children}</body></html>; }
