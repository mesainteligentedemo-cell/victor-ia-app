"use client";

import { useRouter } from "next/navigation";
import { useAuthUser } from "./useAuthUser";
import { useEffect } from "react";

export function useRequireAuth() {
  const router = useRouter();
  const { isSignedIn, isLoading } = useAuthUser();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, isLoading, router]);

  return { isLoading, isSignedIn };
}
