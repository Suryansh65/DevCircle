"use client";

import {useState} from "react";
import {Heart} from "lucide-react";
import { createSupabaseClient } from "@/app/lib/supabase/client";

type LikeButtonProps = {
    postId: string;
    userId: string;
    initialIsLiked: boolean;
    initialLikesCount: number;
}

export default function LikeButton({postId, userId, initialIsLiked, initialLikesCount}: LikeButtonProps){
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const[likesCount, setLikesCount] = useState(initialLikesCount);
    const[loading,setLoading] = useState(false);
    const supabase = createSupabaseClient();

    // Handle Like button click
    const handleLike = async () =>{
        if(loading)return;
        setLoading(true);

        // Save previous state (for revert)
        const prevIsLiked = isLiked;
        const prevLikesCount = likesCount;

        // Optimistic UI update
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

        try{
            if(!isLiked){
                // Inert like into reactions table
                const {error} = await supabase.from("reactions").insert({post_id: postId, user_id: userId, type: "like"});
                if(error) throw error;
            }
            else{
                // Remove like from reactions table
                const {error} = await supabase.from("reactions").delete().eq("post_id", postId).eq("user_id", userId).eq("type","like");
                if(error) throw error;
            }
        }catch(error){
            console.error("Error updating like:", error);
            // Rever to previous states
            setIsLiked(prevIsLiked);
            setLikesCount(prevLikesCount);
        }finally{
            setLoading(false);
        }
    };
    return (
        <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 ${isLiked ? "text-red-500" : "text-[#8B8FA8] hover:text-white"}`}
        >
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            <span>{likesCount}</span>
        </button>

    )
}
