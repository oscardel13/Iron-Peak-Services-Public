"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ children, scrolled, to }) {
  const pathname = usePathname();

  // Check if current path matches the link
  const isActive = pathname.toLowerCase() === to.toLowerCase();

  return (
    <Link
      href={to}
      className={`px-4 py-2 font-semibold text-lg rounded-full hover:underline
        ${
          isActive
            ? scrolled
              ? "text-black" // active + scrolled
              : "text-black" // active + not scrolled
            : !scrolled
            ? "text-brand-primary lg:text-white hover:text-black"
            : "text-brand-primary hover:text-black"
        }`}
    >
      {children}
    </Link>
  );
}
