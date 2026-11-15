import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Host_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Host_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });
const display = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'IGNIS · Fire-safety evidence console',
  description: 'Dashboard that summarises, ranks and interprets NASA microgravity combustion investigations for spacecraft fire safety. NASA Space Apps 2026, team Emberfall. Not affiliated with or endorsed by NASA. Built with AI assistance.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#050505' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
