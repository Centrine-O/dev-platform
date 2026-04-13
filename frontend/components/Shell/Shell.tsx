"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Nav from "@/components/Nav/Nav";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin  = pathname === "/login";

  return (
    <>
      {!isLogin && <Header />}
      {!isLogin && <Nav />}
      {children}
    </>
  );
}
