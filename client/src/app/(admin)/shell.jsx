// components/dashboard/dashboard-shell.jsx
"use client";

import { useEffect, useState } from "react";
import DashboardNav from "./components/navbar/navbar.component";

export default function DashboardShell({ children }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleChange = () => {
      const desktop = mediaQuery.matches;
      setIsDesktop(desktop);
      setOpenSidebar(desktop);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const closeSidebar = () => {
    if (!isDesktop) {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <DashboardNav
        open={openSidebar}
        isDesktop={isDesktop}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {!isDesktop && openSidebar ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/50"
          onClick={closeSidebar}
        />
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-col xl:pl-[280px]">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b bg-white px-4">
          {!isDesktop ? (
            <button
              type="button"
              className="rounded-md border px-3 py-2"
              onClick={toggleSidebar}
            >
              Menu
            </button>
          ) : null}
        </header>

        <main className="min-w-0 flex-1 p-4 xl:p-6">{children}</main>
      </div>
    </div>
  );
}
