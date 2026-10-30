import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loader Animation',
  icons: { icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 fill=%22%230a0a0a%22/><path d=%22M4 28h24%22 stroke=%22%2389AACC%22 stroke-width=%222%22/></svg>' },
  description: 'Design. Create. Inspire. A minimal portfolio loading sequence.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preload" href="/motionsites-results/18/fonts/instrument-serif-italic.ttf" as="font" type="font/ttf" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
