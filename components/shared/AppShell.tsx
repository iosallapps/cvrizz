"use client";

import { SidebarProvider } from "@/lib/sidebar";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { PremiumBackground } from "@/components/shared/PremiumBackground";
import type { User } from "@supabase/supabase-js";

interface AppShellProps {
  user: User;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-base relative">
        <PremiumBackground variant="subtle" />
        <Header user={user} />
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 relative z-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
