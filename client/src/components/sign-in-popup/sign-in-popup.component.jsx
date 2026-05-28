"use client";

import GoogleIcon from "@mui/icons-material/Google";
import Popover from "@/components/popover/popover.component";

const API_URL = /*process.env.NEXT_PUBLIC_API_URL || */ "http://localhost:8000";

export default function SignInPopup({ closeTrigger }) {
  function handleGoogleLogin() {
    window.location.href = `${API_URL}/auth/user/google?path=/dashboard`;
  }

  return (
    <Popover closeTrigger={closeTrigger} top>
      <div className="mt-24 w-[92vw] max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
              Admin Dashboard
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

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">
            Admin access only for now
          </p>
          <p className="mt-1 text-sm text-amber-700">
            The client portal is currently in development. For now, this login
            is only available to admins.
          </p>
        </div>

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