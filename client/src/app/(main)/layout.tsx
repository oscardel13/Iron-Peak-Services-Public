// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar/navbar.component";
import Footer from "@/components/footer/footer.component";
import CallButton from "@/components/call-button/call-button.component";
import "./globals.css";

const siteUrl = "https://iron-peak-services.com";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Iron Peak Services | Dumpster Rental, Junk Removal & Demolition",
    template: "%s | Iron Peak Services",
  },
  description:
    "Iron Peak Services provides dumpster rental, junk removal, and demolition services across the Denver metro area with reliable scheduling, fair pricing, and friendly local service.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Iron Peak Services | Dumpster Rental, Junk Removal & Demolition",
    description:
      "Reliable dumpster rentals, junk removal, and light demolition services across the Denver metro area.",
    siteName: "Iron Peak Services",
    images: [
      {
        url: "/og/OG.png",
        width: 1536,
        height: 1024,
        alt: "Iron Peak Services dumpster rental, junk removal, and demolition services",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iron Peak Services | Dumpster Rental, Junk Removal & Demolition",
    description:
      "Dumpster rental, junk removal, and demolition services in the Denver metro area.",
    images: ["/og/OG.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  applicationName: "Iron Peak Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <Navbar />
        {children}
        <Footer />
        <CallButton />
      </body>
    </html>
  );
}