"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import NavLink from "./navlink/navlink.component";
import NavDropdown from "./nav-dropdown/nav-dropdown.component";

import METADATA from "@/data/data";

export default function Navbar() {
  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full flex justify-center px-4 lg:px-8 pt-4">
        <nav className="w-full max-w-5xl rounded-xl bg-graphite shadow-lg px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
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
            <div className="hidden lg:flex items-center justify-center gap-2 xl:gap-4 flex-1">
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

              {/* <NavLink to="/contact" scrolled={true}>
                Contact
              </NavLink> */}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex shrink-0">
              <Link
                href="/book"
                className="inline-flex items-center gap-3 rounded-xl h-12 bg-brand-primary px-8 py-4 text-white font-semibold text-lg hover:bg-brand-primary-hover transition"
              >
                Book Online
                <span className="text-2xl leading-none">→</span>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-brand-secondary"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className="text-3xl">{isOpen ? "✕" : "☰"}</span>
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="lg:hidden mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5">
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

              {/* <NavLink to="/contact" scrolled={true}>
                Contact
              </NavLink> */}

              <Link
                href="/book"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 text-white font-semibold hover:bg-brand-primary-hover transition"
              >
                Book Online
                <span>→</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}