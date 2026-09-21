"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseClient } from "@/app/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out failed:", error);
      setLoading(false);
      return;
    }

    router.replace("/Auth/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      aria-label="Sign out"
      title="Sign out"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#8B8FA8] transition-colors hover:bg-[#2A2D3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOut className="size-4" />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}