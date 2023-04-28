import './globals.css'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Climate Risk Rating',
  description: 'Welcome to RiskThinking.AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
