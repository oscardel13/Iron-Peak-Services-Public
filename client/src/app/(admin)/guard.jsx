// components/dashboard/dashboard-guard.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardGuard({ children }) {
  return children;
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setAuthorized(true);
    setCheckingAuth(false);
  }, [router, pathname]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking auth...
      </div>
    );
  }

  if (!authorized) return null;

  return children;
}