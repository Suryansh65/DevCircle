"use client";

import { createSupabaseClient } from "@/app/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const supabase = createSupabaseClient();
    const router = useRouter();

    async function handleSignup(){
        setLoading(true);
        setError("");

        // Step:1 Create Auth user in Supabase Auth
        const {data,error: authError} = await supabase.auth.signUp({
            email,
            password,
        });

        if(authError){
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Step:2 Insert into our user table
        if(data.user){
            const {error:dbError} = await supabase.from("users").insert({
                id: data.user.id,
                name,
                username: username.toLowerCase(),
                bio:"",
                skills:[],
            });

            if(dbError){
                setError(dbError.message);
                setLoading(false);
                return;
            }
        }
        router.push("/feed");
        router.refresh();
    }
    return (
        <div className="min-h-screen bg-[#0F1117] flex items-center justify-center" >
            <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-8 w-full max-w-md" >
                <h1 className="text-2xl font-bold text-white mb-2" >Join DevCircle</h1>
                <p className="text-[#8B8FA8] mb-6" >Community for Indian developers</p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm" >{error}</div>
            )}
                  <div className="space-y-4">
          <div>
            <label className="text-sm text-[#8B8FA8] mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Suryansh Agrawal"
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg 
                         px-4 py-2.5 text-white placeholder-[#8B8FA8] 
                         focus:outline-none focus:border-[#1D9E75] text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-[#8B8FA8] mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="suryansh65"
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg 
                         px-4 py-2.5 text-white placeholder-[#8B8FA8] 
                         focus:outline-none focus:border-[#1D9E75] text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-[#8B8FA8] mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg 
                         px-4 py-2.5 text-white placeholder-[#8B8FA8] 
                         focus:outline-none focus:border-[#1D9E75] text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-[#8B8FA8] mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg 
                         px-4 py-2.5 text-white placeholder-[#8B8FA8] 
                         focus:outline-none focus:border-[#1D9E75] text-sm"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#1D9E75] hover:bg-[#17876A] text-white 
                       font-medium py-2.5 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-[#8B8FA8]">
            Already have an account?{" "}
            <a href="/Auth/login" className="text-[#1D9E75] hover:underline">
              Sign in
            </a>
          </p>
        </div>
            </div>

        </div>
    )
}