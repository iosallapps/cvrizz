"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim() },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Delete Prisma data first (cascades to resumes via onDelete: Cascade)
  try {
    await prisma.user.delete({ where: { id: user.id } });
  } catch {
    // User might not exist in Prisma yet, continue with auth deletion
  }

  // Delete Supabase Auth user using admin client
  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) throw new Error("Failed to delete account");

  return { success: true };
}
