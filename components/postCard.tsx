"use client";

import LikeButton from "./ui/Likebutton";
import Link from "next/link";
import { useCallback, useState } from "react";
import CommentSection from "./ui/commentSection";

type Post = {
  id: number;
  user_id: string;
  likes_count: number;
  is_liked: boolean;
  tags: string[];
  author: {
    id:string;
    name: string;
    username: string;
  };
  comments_count: number;
  created_at: string;
  content: string;
};
type CurrentUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
};

// type for commentCountChange prop
type PostCardProps = {
  post: Post;
  user: CurrentUser;
  onCommentsCountChange: (postId: number, commentsCount: number) => void;
};

export default function PostCard({
  post,
  user,
  onCommentsCountChange,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const handleCommentsCountChange = useCallback(
    (count: number) => {
      onCommentsCountChange(post.id, count);
    },
    [onCommentsCountChange, post.id],
  );
  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-6 mb-4 w-full max-w-2xl m-auto">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-[#2A2D3A] rounded-full flex items-center justify-center text-white font-bold mr-3">
          {post.author.name.charAt(0)}
        </div>
        <div>
          <Link
            href={`/profile/${post.author.id}`}
            className="font-bold text-white hover:text-[#36c99A]"
          >
            {post.author.name}
          </Link>
          <p className="text-[#8B8FA8] text-sm">
            <Link
              href={`/profile/${post.author.id}`}
              className="hover:text-[#36C99A]"
            >
              @{post.author.username}
            </Link>{" "}
            ·{" "}
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-white mb-4">{post.content}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[#8B8FA8] bg-[#2A2D3A] text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <LikeButton
            postId={post.id.toString()}
            userId={user.id}
            initialIsLiked={post.is_liked}
            initialLikesCount={post.likes_count}
          />
        </div>
        <div className="flex items-center space-x-4 cursor-pointer">
          <button
            className="text-[#8B8FA8] hover:text-white cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 5v-5H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 7h.01V7H7zm3.999-.999c-.999-.999-3.999-.999-3.999-.999s3 .999 3.999.999zm3.001 1.999h-.01V7H14z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-[#8B8FA8]">{post.comments_count}</span>
        </div>
      </div>
      {showComments && (
        <CommentSection
          postId={post.id.toString()}
          currentUser={user}
          postAuthorId={post.user_id}
          onCommentsCountChange={handleCommentsCountChange}
        />
      )}
    </div>
  );
}
