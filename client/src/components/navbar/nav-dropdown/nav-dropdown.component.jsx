"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavDropdown({ children, scrolled, links = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Active if any child is active
  const isActive = links.some(
    (link) => pathname.toLowerCase() === link.to.toLowerCase(),
  );

  // Close when route changes
  useEffect(() => setOpen(false), [pathname]);

  // Close when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full lg:w-auto"
      // Hover only on large screens
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)} // ✅ mobile friendly toggle
        className={`w-full lg:w-auto flex items-center justify-between lg:justify-start gap-2 px-4 py-2 font-semibold text-lg rounded-full hover:underline transition-colors
        ${
          isActive
            ? "text-black"
            : !scrolled
              ? "text-brand-primary lg:text-white hover:text-black"
              : "text-brand-primary hover:text-black"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{children}</span>

        {/* Arrow Down */}
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="
            mt-2 lg:mt-0
            w-full lg:w-56
            lg:absolute lg:left-0
            rounded-xl bg-white shadow-lg border z-50 overflow-hidden
          "
          role="menu"
        >
          {links.map((link) => {
            const childActive =
              pathname.toLowerCase() === link.to.toLowerCase();

            return (
              <Link
                key={link.to}
                href={link.to}
                className={`block w-full px-4 py-3 text-base transition-colors
                ${
                  childActive
                    ? "bg-gray-100 font-semibold text-black"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
                role="menuitem"
                onClick={() => setOpen(false)} // nice UX on mobile
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
