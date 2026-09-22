import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-emerald-700 text-lg">
            <span>🌾</span>
            <span>RaituSevak360</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/services" className="text-slate-600 hover:text-emerald-600">సేవలు (Services)</Link>
            <Link href="/about" className="text-slate-600 hover:text-emerald-600">గురించి (About)</Link>
            <Link href="/contact" className="text-slate-600 hover:text-emerald-600">సంప్రదించండి (Contact)</Link>
            <Link
              href="/login"
              className="rounded-full bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
            >
              లాగిన్ (Login)
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-slate-900 py-6 text-center text-sm text-slate-400">
        <p>© 2026 RaituSevak360. All rights reserved. Smart Agriculture Ecosystem.</p>
      </footer>
    </div>
  );
}
