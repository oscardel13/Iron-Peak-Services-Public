"use client";

import METADATA from "@/data/data";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#191919] text-[#FDFDFD] pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* TOP ROW */}
        <div className="flex flex-row justify-between items-start gap-12 xl:px-40">
          {/* LEFT: Logo + location + phone */}
          <div className="flex flex-col">
            <Image
              src="/assets/logo.svg"
              alt="Iron Peak Services Logo"
              width={250}
              height={250}
              priority
              className="opacity-100"
            />
          </div>
          <div>
            <p className="mt-4 text-sm text-gray-300">{METADATA.address}</p>
            <a
              href={METADATA.clickablePhone}
              className="mt-1 text-sm font-medium underline"
            >
              {METADATA.phone}
            </a>
          </div>

          {/* RIGHT: Link columns */}
          <div className="flex flex-row gap-10 text-sm">
            <div>
              <h4 className="text-xs font-semibold tracking-[0.18em] text-gray-400 mb-3 uppercase">
                EXPLORE
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/service-areas"
                    className="hover:text-white transition"
                  >
                    Service Areas
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <hr className="border-gray-700 my-6" />

        {/* BOTTOM ROW */}
        <div className="flex flex-row items-center justify-between text-xs text-gray-400 gap-4 w-full">
          <p className="w-1/4">
            © {year} {METADATA.title}. All rights reserved.
          </p>

          <div className="flex flex-row items-center justify-center gap-4 w-1/2">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition"
            >
              Terms of Service
            </Link>
          </div>

          <p className="text-right text-gray-400 w-1/4">Built by oscarshub</p>
        </div>
      </div>
    </footer>
  );
}
