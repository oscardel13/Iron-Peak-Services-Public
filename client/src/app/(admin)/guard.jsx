"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAPI } from "@/utils/api";

export default function AdminGuard({ children }) {
  const router = useRouter();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function checkAuth() {
      try {
        setStatus("");
        const res = await getAPI(`/auth/me`);

        if (res.statusText !== "OK") {
          router.replace("/login");
          return;
        }

        const data = await res.data;
        const user = data.user;

        const isAdmin =
          user?.accessLevel === "ADMIN" || user?.accessLevel === "OWNER";

        if (!isAdmin) {
          setStatus("unauthorized");
          setTimeout(() => {
            router.replace("/");
          }, 3000);
          return;
        }
        setStatus("authenticated");
      } catch (error) {
        console.error("Auth check failed:", error);
        setStatus("unauthorized");
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      }
    }

    checkAuth();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Checking access...
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        You do not have permission to access this page.
      </div>
    );
  }

  if (status === "authenticated") {
    return children;
  }

  return null;
}
