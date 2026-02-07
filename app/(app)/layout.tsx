import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shared/AppShell";
import { QueryProvider } from "@/lib/query-client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <AppShell user={user}>{children}</AppShell>
    </QueryProvider>
  );
}
