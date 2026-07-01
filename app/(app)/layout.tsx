import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shared/AppShell";
import { QueryProvider } from "@/lib/query-client";
import { syncUserFromAuth } from "@/lib/user";

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

  // Guarantee the Prisma user row exists before any action that FKs to it
  // (e.g. createResume). syncUserFromAuth is idempotent and self-handles errors.
  await syncUserFromAuth(user);

  return (
    <QueryProvider>
      <AppShell user={user}>{children}</AppShell>
    </QueryProvider>
  );
}
