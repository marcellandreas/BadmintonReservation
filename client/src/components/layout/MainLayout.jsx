"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isOwnerPath = pathname.includes("dashboard");

  return (
    <>
      {!isOwnerPath && <Header />}
      <main>{children}</main>
      {!isOwnerPath && <Footer />}
    </>
  );
}
