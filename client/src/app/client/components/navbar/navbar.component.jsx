"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, LogOut } from "lucide-react";

import { getAPI } from "@/utils/api";

const navItems = [
  { href: "/client", label: "Overview" },
  { href: "/client/bookings", label: "Bookings" },
  { href: "/client/calendar", label: "Calendar" },
  { href: "/client/receipts", label: "Receipts" },
];

function isActive(pathname, href) {
  if (href === "/client") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardNav({
  open,
  isDesktop,
  toggleSidebar,
  closeSidebar,
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await getAPI("/auth/logout");
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      closeSidebar?.();
      router.push("/");
      router.refresh();
    }
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r bg-[rgb(33,37,41)] text-gray-300 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } xl:translate-x-0`}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div>
          <p className="text-sm text-gray-400">Dashboard</p>
          <h2 className="text-lg font-semibold text-white">Client</h2>
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

      <nav className="flex-1 space-y-1 p-3">
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

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
