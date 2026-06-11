import { useUser as useClerkUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { db } from "@/lib/db/supabase";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  credits: number;
  subscription_status: string;
  stripe_customer_id?: string;
}

export async function initializeUser(clerkUser: any) {
  if (!clerkUser?.id) return null;

  const { data: existingUser } = await db
    .from("users")
    .select("*")
    .eq("id", clerkUser.id)
    .single();

  if (!existingUser) {
    const { data: newUser, error } = await db
      .from("users")
      .insert({
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName + " " + clerkUser.lastName,
        credits: 100,
        subscription_status: "free",
      })
      .select()
      .single();

    return newUser;
  }

  return existingUser;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const { userId } = useClerkAuth();
    if (!userId) return null;

    const { data } = await db
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    return data;
  } catch (error) {
    console.error("Failed to get auth user", error);
    return null;
  }
}

export async function updateUserCredits(userId: string, amount: number) {
  const { data: user } = await db
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (!user) throw new Error("User not found");

  const newCredits = Math.max(0, user.credits + amount);

  await db.from("users").update({ credits: newCredits }).eq("id", userId);

  return newCredits;
}

export async function getOrCreateUser(userId: string) {
  const { data: user } = await db.from("users").select("*").eq("id", userId).single();

  if (!user) {
    const { data: newUser } = await db
      .from("users")
      .insert({ id: userId, email: "", credits: 100, subscription_status: "free" })
      .select()
      .single();
    return newUser;
  }

  return user;
}
