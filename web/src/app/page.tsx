import type { Metadata } from 'next';
import Landing from '../ui/landing/Landing';

export const metadata: Metadata = {
  title: 'IGNIS · Fire-safety evidence for crewed spaceflight',
  description: 'Explore NASA combustion research, compare atmosphere cases, inspect detector data and trace model claims in the IGNIS research console.',
};

export default function Page() {
  return <Landing />;
}
