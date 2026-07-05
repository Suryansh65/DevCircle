// Protected Route
import { createClient } from "../lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function FeedPage(){
    const supabase = await createClient();

    // Check if user is logged in
    const {data: {user}} = await supabase.auth.getUser(); // Go deep inside data object to find "user" variable
    if(!user)redirect("/auth/login");

    // Test DB connection
    const {data: users, error} = await supabase.from("users").select("*"); // take data and rename it to users

    return(
        <div className="min-h-screen bg-[#0F1117] p-8">
            <h1 className="text-2xl font-bold text-white mb-4">✅Connected! Logged in as: {user.email}</h1>
            <pre className="text-[#8B8FA8] text-sm" >{JSON.stringify({users,error},null,2)}</pre>
            {/* null means do not transform or filter the array and 2 means for indentation for pretty printing */}
            {/* The <pre> tag preserves whitespace and line breaks, so the formatted JSON appears exactly as intended. Without <pre>, the browser would collapse the whitespace into a single line. */}
        </div>
    )
}