import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IGNIS · Fire-safety research workspace',
  description: 'NASA microgravity fire-safety evidence with its conditions and limits. NASA Space Apps 2026 (team Emberfall). Not affiliated with or endorsed by NASA. Built with AI assistance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
