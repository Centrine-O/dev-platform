import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Life OS",
  description: "Your personal developer platform — audit-ready, all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
