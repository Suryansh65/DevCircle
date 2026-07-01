"use client";

import { createSupabaseClient } from "@/app/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseClient();
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed"); //redirect after login
    router.refresh(); //refresh server components
  }
  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-[#8B8FA8] mb-6">Sign in to DevCircle</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-[#8B8FA8] mb-1 block">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-4 py-2.5 text-white placeholder-[#8B8FA8] focus:outline-none focus:border-[#1D9E75] text-sm"
            />
          </div>
          {/* Password */}
          <div>
            <label className="text-sm text-[#8B8FA8] mb-1 block">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-4 py-2.5 text-white placeholder-[#8B8FA8] focus:outline-none focus:border-[#1D9E75] text-sm"
            />
          </div>

          {/* Login button */}
          {/* className="{w-full bg=[#1d9e75] hover:bg-[#17876A] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed}" */}
          <Button
            size="xs"
            variant="outline"
            onClick={handleLogin}
            disabled={loading}
            className="outline-none border-[#2A2D3A] p-4 rounded-lg hover:bg-[#2A2D3A]"
          >
           <LogIn /> {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
