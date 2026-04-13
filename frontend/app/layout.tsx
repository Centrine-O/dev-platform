import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell/Shell";

export const metadata: Metadata = {
  title: "Dev Life OS",
  description: "Your personal developer platform — audit-ready, all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
