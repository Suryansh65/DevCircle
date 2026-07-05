import { createClient } from "@/app/lib/supabase/server-client";
import { notFound } from "next/navigation";

export default async function ProfilePage({params, }:{params:Promise<{username:string}>;}){
    const {username} = await params;

    // check user in DB
    const supabase = await createClient();
    // fetch user profile from DB
    const {data:profile, error} = await supabase.from("users").select("*").eq("username", username).single();
    console.log("Profile Data:", profile);
    // Error while fetching profile
    if(error){
        return (
            <div className="min-h-screen bg-[#0F1117] p-8">
                <h1 className="text-2xl font-bold text-white mb-4">Error fetching profile</h1>
                <pre className="text-[#8B8FA8] text-sm" >{JSON.stringify({error},null,2)}</pre>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-[#0F1117] p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Profile of {profile.name}</h1>
            <small className="text-[#8B8FA8] text-sm" >{profile.username}</small>
            <p className="text-[#8B8FA8] text-sm ">{profile.bio}</p>
        </div>
    )
}