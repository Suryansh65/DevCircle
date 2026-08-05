"use client";

import {useState} from "react";
import CreatePost from "./createPost";
import PostCard from "./postCard";

type CurrentUser = {
    id:string;
    name:string;
    username:string;
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
    // function to handle posts
    function handlePostCreated(newPost: Post){
        setPosts((prev: Post[])=> [newPost, ...prev]);
    }
    const [posts, setPosts] = useState(initialPosts);

    return (
        <div className="min-h-screen bg-[#0F1117] p-8">
            <CreatePost currentUser={currentUser} onPostCreated={handlePostCreated} />
            {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}