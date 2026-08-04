"use client";

import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Popover from "@/components/popover/popover.component";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const LOGIN_TABS = {
  ADMIN: "admin",
  CLIENT: "client",
};

export default function SignInPopup({ closeTrigger }) {
  const [activeTab, setActiveTab] = useState(LOGIN_TABS.ADMIN);

  const isAdmin = activeTab === LOGIN_TABS.ADMIN;

  function handleGoogleLogin() {
    const loginPath = isAdmin
      ? "/auth/admin/google?path=/dashboard"
      : "/auth/client/google?path=/client";

    window.location.href = `${API_URL}${loginPath}`;
  }

  return (
    <Popover closeTrigger={closeTrigger} top>
      <div className="mt-24 w-[92vw] max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
              {isAdmin ? "Admin Dashboard" : "Client Portal"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Sign in to continue
            </h2>
          </div>

          <button
            type="button"
            onClick={closeTrigger}
            className="rounded-full px-3 py-1 text-2xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close sign in popup"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab(LOGIN_TABS.ADMIN)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isAdmin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Admin
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(LOGIN_TABS.CLIENT)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              !isAdmin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Client
          </button>
        </div>

        {isAdmin ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Admin access only
            </p>
            <p className="mt-1 text-sm text-amber-700">
              This login is restricted to approved admin and owner accounts.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-800">Client portal</p>
            <p className="mt-1 text-sm text-blue-700">
              Sign in with Google to view your bookings, payment status, and
              rental details.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-graphite px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          <GoogleIcon fontSize="small" />
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          You’ll be redirected to Google to securely sign in.
        </p>
      </div>
    </Popover>
  );
}
