"use client";
import { usePathname } from "next/navigation";
import Layout from "./components/Layout";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const isLoginPage = pathname === "/login";

   return <>{!isLoginPage ? <Layout backgroundColor="#0b072d">{children}</Layout> : children}</>;
}
