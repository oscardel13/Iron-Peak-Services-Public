"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import NavLink from "./navlink/navlink.component";
import NavDropdown from "./nav-dropdown/nav-dropdown.component";
import SignInPopup from "../sign-in-popup/sign-in-popup.component";

import METADATA from "@/data/data";
import { getAPI } from "@/utils/api";

function getDashboardPath(user) {
  const accessLevel = user?.accessLevel;

  if (accessLevel === "ADMIN" || accessLevel === "OWNER") {
    return "/dashboard";
  }

  if (accessLevel === "CLIENT") {
    return "/client";
  }

  if (accessLevel === "DRIVER") {
    return "/driver";
  }

  if (accessLevel === "WORKER") {
    return "/worker";
  }

  return null;
}

export default function Navbar() {
  const router = useRouter();

  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      try {
        const response = await getAPI("/auth/me");

        if (!ignore) {
          setUser(response.data?.user ?? null);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setAuthLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setPrevScrollpos(window.pageYOffset);

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const atTop = currentScrollPos <= 10;

      setVisible(prevScrollpos > currentScrollPos || atTop);
      setPrevScrollpos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollpos]);

  function handleDashboardClick() {
    setIsOpen(false);

    const dashboardPath = getDashboardPath(user);

    if (dashboardPath) {
      router.push(dashboardPath);
      return;
    }

    setSignInOpen(true);
  }

  const dashboardButtonText = user ? "Dashboard" : "Login";

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex w-full justify-center px-4 pt-4 lg:px-8">
          <nav className="w-full max-w-6xl rounded-xl bg-graphite px-5 py-4 shadow-lg lg:px-6">
            <div className="flex items-center justify-between gap-3">
              {/* Logo */}
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src="/assets/logo_short.svg"
                  alt="Logo"
                  width={300}
                  height={300}
                  priority
                  className="h-12 w-auto object-fit"
                />
              </Link>

              {/* Desktop Links */}
              <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-3">
                <NavDropdown
                  scrolled={true}
                  links={[
                    { name: "Dumpster Rental", to: "/dumpster-rental" },
                    {
                      name: "Dumpster Weight Calculator",
                      to: "/dumpster-weight-calculator",
                    },
                    { name: "Frequently Asked Questions", to: "/faq" },
                  ]}
                >
                  Our Rentals
                </NavDropdown>

                <NavDropdown
                  scrolled={true}
                  links={METADATA.services.map((service) => ({
                    name: service.name,
                    to: `/services/${service.slug}`,
                  }))}
                >
                  Services
                </NavDropdown>

                <NavLink to="/service-areas" scrolled={true}>
                  Service Areas
                </NavLink>

                <NavLink to="/about" scrolled={true}>
                  About
                </NavLink>
              </div>

              {/* Desktop Actions */}
              <div className="hidden shrink-0 items-center gap-3 lg:flex">
                <button
                  type="button"
                  onClick={handleDashboardClick}
                  disabled={authLoading}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-50"
                >
                  {authLoading ? "Checking..." : dashboardButtonText}
                </button>

                <Link
                  href="/book"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-primary px-6 font-semibold text-white transition hover:bg-brand-primary-hover"
                >
                  Book Online
                  <span className="text-xl leading-none">→</span>
                </Link>
              </div>

              {/* Mobile Toggle */}
              <button
                className="p-2 text-brand-secondary lg:hidden"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <span className="text-3xl">{isOpen ? "✕" : "☰"}</span>
              </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5 lg:hidden">
                <NavDropdown
                  scrolled={true}
                  links={[
                    { name: "Dumpster Rental", to: "/dumpster-rental" },
                    {
                      name: "Dumpster Weight Calculator",
                      to: "/dumpster-weight-calculator",
                    },
                    { name: "Frequently Asked Questions", to: "/faq" },
                  ]}
                >
                  Our Rentals
                </NavDropdown>

                <NavDropdown
                  scrolled={true}
                  links={METADATA.services.map((service) => ({
                    name: service.name,
                    to: `/services/${service.slug}`,
                  }))}
                >
                  Services
                </NavDropdown>

                <NavLink to="/service-areas" scrolled={true}>
                  Service Areas
                </NavLink>

                <NavLink to="/about" scrolled={true}>
                  About
                </NavLink>

                <button
                  type="button"
                  onClick={handleDashboardClick}
                  disabled={authLoading}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-50"
                >
                  {authLoading ? "Checking..." : dashboardButtonText}
                </button>

                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-white transition hover:bg-brand-primary-hover"
                >
                  Book Online
                  <span>→</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {signInOpen && <SignInPopup closeTrigger={() => setSignInOpen(false)} />}
    </>
  );
}
