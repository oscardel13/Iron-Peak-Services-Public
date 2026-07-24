// components/dashboard/dashboard-nav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/dashboard/inventory", label: "Inventory" },
];

function isActive(pathname, href) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardNav({
  open,
  isDesktop,
  toggleSidebar,
  closeSidebar,
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-[280px] border-r bg-[rgb(33,37,41)] text-gray-300 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } xl:translate-x-0`}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div>
          <p className="text-sm text-gray-400">Dashboard</p>
          <h2 className="text-lg font-semibold text-white">Barber Admin</h2>
        </div>

        {!isDesktop && (
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}