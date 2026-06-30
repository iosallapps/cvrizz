"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const NameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

export async function updateProfile(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const result = NameSchema.safeParse(name);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid name");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: result.data },
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
