'use client';

import Link from 'next/link';

export function Sidebar() {
  const navItems = [
    { label: 'డ్యాష్‌బోర్డ్ (Home)', href: '/dashboard', icon: '🏠' },
    { label: 'పంటలు (Crops)', href: '/dashboard/crops', icon: '🌾' },
    { label: 'వాతావరణం (Weather)', href: '/dashboard/weather', icon: '⛅' },
    { label: 'నేల పరీక్ష (Soil)', href: '/dashboard/soil', icon: '🧪' },
    { label: 'AI సలహాదారు (AI Advisor)', href: '/dashboard/ai-advisor', icon: '🤖' },
    { label: 'కూలీలు (Labour)', href: '/dashboard/labour', icon: '👥' },
    { label: 'యంత్రాలు (Machinery)', href: '/dashboard/machinery', icon: '🚜' },
    { label: 'మార్కెట్ (Marketplace)', href: '/dashboard/marketplace', icon: '🛍️' },
  ];

  return (
    <aside className="hidden w-64 border-r bg-white p-4 lg:block">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
