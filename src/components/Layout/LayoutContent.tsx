"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <div className="flex h-screen bg-gray-100">
      {isAuthenticated && !isLoginPage && <Sidebar />}
      <main
        className={`flex-1 overflow-auto p-6 bg-gray-100 ${isAuthenticated && !isLoginPage ? "" : "w-full"}`}
      >
        {children}
      </main>
    </div>
  );
}
