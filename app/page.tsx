"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [authenticated, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-950">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}
