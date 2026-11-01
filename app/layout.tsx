import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import './globals.css';
import './evidence.css';
export const metadata: Metadata = { title: 'AO Radar — fish for the next organisation', description: 'Explore lean, agent-operated organisations. Grade the evidence. Find your next experiment.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
