import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'RaituSevak360 - AI-Powered Smart Agriculture Ecosystem',
  description: 'Comprehensive smart farming platform with AI crop advisory, weather intelligence, and agricultural services.',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-emerald-100">
        {children}
      </body>
    </html>
  );
}
