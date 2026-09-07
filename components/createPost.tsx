"use client";

import {useState} from "react";
import { createSupabaseClient } from "@/app/lib/supabase/client";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";


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

type CreatePostProps = {
    currentUser: CurrentUser;
    onPostCreated: (newPost: Post) => void;
}

export default function CreatePost({currentUser,onPostCreated}: CreatePostProps){
    const [open, setOpen] = useState(false);
    const [content,setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const supabase = createSupabaseClient();

    async function handleCreatePost(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);
        if(!content.trim()){
            setError("Post content cannot be empty");
            setLoading(false);
            return;
        }
        // db query
        const {data, error: dbError} = await supabase.from("posts").insert({
            user_id: currentUser.id,
            content,
            tags,

        }).select(`
            id,
            user_id,
            likes_count,
            tags,
            comments_count,
            created_at,
            content
            `).single();

        if(dbError || !data){
            setError(dbError?.message || "Failed to create post");
            setLoading(false);
            return;
        }
        const newPost: Post = {
            ...data,
            author: {
                name: currentUser.name,
                username: currentUser.username,
            },
            is_liked: false
        }
        onPostCreated(newPost);
        // reset form
        setContent("");
        setTags([]);
        setTagInput("");
        setError("");
        setLoading(false);
        setOpen(false);
    }

    function addTagFromInput(value?: string){
        const raw = (value ?? tagInput).trim().replace(/,$/, "");
        if(!raw) return;
        const candidate = raw.replace(/^#/, "").toLowerCase();
        if(!candidate) return;
        setTags((prev) => {
            if(prev.includes(candidate)) return prev;
            return [...prev, candidate];
        });
        setTagInput("");
    }

    function removeTag(at: number){
        setTags((prev)=> prev.filter((_,i)=> i!==at));
    }

    function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === "," || e.key === "Enter"){
            e.preventDefault();
            addTagFromInput();
        } else if(e.key === "Backspace" && !tagInput && tags.length){
            // remove last tag
            removeTag(tags.length - 1);
        }
    }

    const isEmpty = !content.trim();

    function closeAndReset(){
        setOpen(false);
        setContent(""); setTags([]); setTagInput(""); setError("");
    }

    return (
        <>
            <button
                type="button"
                onClick={()=> setOpen(true)}
                className="flex items-center gap-3 bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-4 mb-6 w-full max-w-2xl m-auto text-left hover:border-[#1D9E75]/50 transition-colors"
            >
                <div className="w-10 h-10 shrink-0 bg-[#2A2D3A] rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.name.charAt(0)}
                </div>
                <span className="flex-1 flex items-center justify-between rounded-full bg-[#0F1117] border border-[#2A2D3A] px-4 py-2.5 text-sm text-[#8B8FA8] ">
                    Create new post
                    <Plus className="cursor-pointer w-4 h-4 text-[#1D9E75] " />
                </span>
            </button>

            <Dialog open={open} onOpenChange={(next)=>{ if(!next) closeAndReset(); else setOpen(true); }}>
                <DialogContent>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 shrink-0 bg-[#2A2D3A] rounded-full flex items-center justify-center text-white font-bold">
                            {currentUser.name.charAt(0)}
                        </div>
                        <div>
                            <DialogTitle>Create Post</DialogTitle>
                            <p className="text-[#8B8FA8] text-sm">Posting as @{currentUser.username}</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreatePost}>
                        {error ? (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-4 text-sm">
                                {error}
                            </div>
                        ) : null}

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[#8B8FA8] mb-1 block">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e)=> setContent(e.target.value)}
                                    placeholder="What's happening?"
                                    rows={4}
                                    autoFocus
                                    className={cn(
                                        "w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-4 py-2.5",
                                        "text-white placeholder-[#8B8FA8] focus:outline-none focus:border-[#1D9E75]",
                                        "text-sm resize-none"
                                    )}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-[#8B8FA8] mb-1 block">Tags</label>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map((t, i)=> (
                                            <div key={t} className="inline-flex items-center gap-1.5 bg-[#2A2D3A] text-[#8B8FA8] rounded-full px-3 py-1 text-xs">
                                                <span>#{t}</span>
                                                <button type="button" aria-label={`Remove ${t}`} onClick={()=> removeTag(i)} className="text-[#8B8FA8] hover:text-white">
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    value={tagInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setTagInput(e.target.value)}
                                    onKeyDown={onTagKeyDown}
                                    onBlur={()=> addTagFromInput()}
                                    placeholder="Add tags — press comma or Enter"
                                    className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-4 py-2.5 text-white placeholder-[#8B8FA8] focus:outline-none focus:border-[#1D9E75] text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                className="rounded-lg text-[#8B8FA8] hover:text-white hover:bg-[#2A2D3A]"
                                onClick={closeAndReset}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || isEmpty}
                                size="sm"
                                className="rounded-lg bg-[#1D9E75] hover:bg-[#17876A] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Posting..." : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}