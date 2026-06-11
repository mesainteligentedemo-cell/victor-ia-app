"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "@/lib/db/supabase";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  credits: number;
  subscription_status: string;
}

export function useAuthUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data, error: err } = await db
          .from("users")
          .select("*")
          .eq("id", clerkUser.id)
          .single();

        if (err) throw err;

        if (!data) {
          // Create user if not exists
          const { data: newUser, error: createErr } = await db
            .from("users")
            .insert({
              id: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || "",
              name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
              credits: 100,
              subscription_status: "free",
            })
            .select()
            .single();

          if (createErr) throw createErr;
          setAuthUser(newUser);
        } else {
          setAuthUser(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn, clerkUser]);

  return { user: authUser, isLoading: loading, isSignedIn, error };
}
