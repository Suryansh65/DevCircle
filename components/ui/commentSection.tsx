"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/app/lib/supabase/client";

type CurrentUser = {
  id: string;
  name: string;
  username: string;
};

type Comment = {
  id: number;
  post_id: number;
  user_id: string;
  parent_id: number | null;
  content: string;
  created_at: string;
  author: { name: string; username: string };
};

type CommentSectionProps = {
  postId: string;
  currentUser: CurrentUser;
};

export default function CommentSection({
  postId,
  currentUser,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = createSupabaseClient();

  useEffect(() => {
    // Fetch comments for this postId
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("comments")
          .select(`*, author:users!comments_user_id_fkey(name, username)`)
          .eq("post_id", postId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setComments(data as Comment[]);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  // Handle new comment submission
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError("");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        content: newComment.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment. Please try again.");
    } else {
      setComments((prev) => [
        ...prev,
        {
          ...(data as Comment),
          author: { name: currentUser.name, username: currentUser.username },
        },
      ]);
      setNewComment("");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Comments ({comments.length})
      </h2>

      {loading ? (
        <p className="py-4 text-sm text-gray-500 dark:text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="py-4 text-sm text-gray-500 dark:text-gray-400">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  {comment.author?.name || "Anonymous"}
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    @{comment.author?.username || "user"}
                  </span>
                </p>
                <time className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <label htmlFor="comment" className="sr-only">Add a comment</label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>
    </section>
  );
}
