// app/dashboard/layout.jsx
import DashboardGuard from "./guard";
import DashboardShell from "./shell";
import "./globals.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DashboardGuard>
          <DashboardShell>{children}</DashboardShell>
        </DashboardGuard>
      </body>
    </html>
  );
}