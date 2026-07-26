// Protected Route
import PostCard from "../../components/postCard";
import { createClient } from "../lib/supabase/server-client";
import { redirect } from "next/navigation";
import CreatePost from "../../components/createPost";
import FeedList from "../../components/postFeeds";

export default async function FeedPage(){
    const supabase = await createClient();

    // Check if user is logged in
    const {data: {user}} = await supabase.auth.getUser(); // Go deep inside data object to find "user" variable
    if(!user)redirect("/auth/login");

    // Test DB connection
    // const {data: users, error} = await supabase.from("users").select("*"); // take data and rename it to users
    
    // Get profile of current logged in user
    const {data: currentUser, error: profileError} = await supabase
    .from("users")
    .select("name, username, id")
    .eq("id", user.id)
    .single();
    if(profileError){
        return (
            <div className="min-h-screen bg-[#0F1117] p-8">
                <h1 className="text-2xl font-bold text-white mb-4">Error fetching profile</h1>
                <pre className="text-[#8B8FA8] text-sm" >{JSON.stringify({profileError},null,2)}</pre>
            </div>
        )
    }

    // Method to fetch all posts from the database
    const {data: posts, error: postError} = await supabase
    .from("posts")
    .select(`
        *,
        author: users!posts_user_id_fkey(
        name,
        username
        )
        `);
    if(postError){
        return (
            <div className="min-h-screen bg-[#0F1117] p-8">
                <h1 className="text-2xl font-bold text-white mb-4">Error fetching posts</h1>
                <pre className="text-[#8B8FA8] text-sm" >{JSON.stringify({postError},null,2)}</pre>
            </div>
        )
    }

    return(
        
        <div className="min-h-screen bg-[#0F1117] p-8">
            <FeedList initialPosts={posts} currentUser={currentUser} />
        </div>
    )
}