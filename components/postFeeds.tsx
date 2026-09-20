"use client";

import {useCallback, useState} from "react";
import CreatePost from "./createPost";
import PostCard from "./postCard";

type CurrentUser = {
    id:string;
    name:string;
    username:string;
    avatarUrl?: string;
};
type Post = {
    id: number;
    user_id: string;
    likes_count: number;
    is_liked: boolean;
    tags: string[];
    author: {name:string, username:string};
    comments_count: number;
    created_at: string;
    content: string;
}
type FeedClientProps = {
    initialPosts: Post[];
    currentUser: CurrentUser;
}


export default function FeedList({initialPosts, currentUser}: FeedClientProps){

    const [posts, setPosts] = useState(initialPosts);
    
    // function to handle comments count change
    const handleCommentCountChange = useCallback((postId: number, commentsCount: number)=>{
        setPosts((prev) => prev.map((post)=> post.id === postId ? {...post, comments_count: commentsCount} : post));
    },[]);
    // function to handle posts
    function handlePostCreated(newPost: Post){
        setPosts((prev: Post[])=> [newPost, ...prev]);
    }

    return (
        <div className="min-h-screen bg-[#0F1117] p-8">
            <CreatePost currentUser={currentUser} onPostCreated={handlePostCreated} />
            {posts?.map((post) => (
                <PostCard 
                key={post.id} 
                post={post} 
                user={currentUser} 
                onCommentsCountChange = {handleCommentCountChange}
                />
            ))}
        </div>
    )
}