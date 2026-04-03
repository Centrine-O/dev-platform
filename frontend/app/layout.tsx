import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Nav from "@/components/Nav/Nav";

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
      <body>
        <Header />
        <Nav />
        {children}
      </body>
    </html>
  );
}
