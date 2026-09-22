import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RaituSevak360 - Admin & Analytics Portal',
  description: 'Administrative command center for farmer management, bookings, analytics, and ecosystem metrics.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Users', href: '/users' },
    { label: 'Farmers', href: '/farmers' },
    { label: 'Crops', href: '/crops' },
    { label: 'Labour', href: '/labour' },
    { label: 'Machinery', href: '/machinery' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Orders', href: '/orders' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Notifications', href: '/notifications' },
  ];

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        <div className="flex min-h-screen">
          <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4">
            <div className="mb-6 flex items-center gap-2 px-2 text-lg font-bold text-emerald-400">
              <span>🛡️</span> RaituSevak Admin
            </div>
            <nav className="space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
