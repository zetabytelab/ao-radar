import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'AO Radar — fish for the next organisation', description: 'Explore lean, agent-operated organisations. Grade the evidence. Find your next experiment.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
