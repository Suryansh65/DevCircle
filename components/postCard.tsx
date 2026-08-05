
type Post = {
    id: number;
    user_id: string;
    likes_count: number;
    is_liked: boolean;
    tags: string[];
    author: {
        name: string;
        username: string;
    };
    comments_count: number;
    created_at: string;
    content: string;
}

export default function PostCard({post}: {post: Post}){
    return(
        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-6 mb-4 w-full max-w-2xl m-auto">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#2A2D3A] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {post.author.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-white font-bold">{post.author.name}</h2>
                    <p className="text-[#8B8FA8] text-sm">
                        @{post.author.username} · {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                </div>
            </div>
            <p className="text-white mb-4">{post.content}</p>
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                        <span key={tag} className="text-[#8B8FA8] bg-[#2A2D3A] text-xs px-2 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button className={post.is_liked ? "text-red-500" : "text-[#8B8FA8] hover:text-white"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 015.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="text-[#8B8FA8]">{post.likes_count}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-[#8B8FA8] hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 5v-5H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 7h.01V7H7zm3.999-.999c-.999-.999-3.999-.999-3.999-.999s3 .999 3.999.999zm3.001 1.999h-.01V7H14z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="text-[#8B8FA8]">{post.comments_count}</span>
                </div>
            </div>
        </div>
    )
}